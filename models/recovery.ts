import {
  InternalServerError,
  NotFoundError,
  ValidationError,
} from "@/infra/errors";
import { Token, User } from "@/types/types";
import database from "infra/database";
import email from "infra/email";
import session from "models/session";
import user from "models/user";

async function requestPasswordRecovery(
  secureInputValues: User,
  origin: string,
) {
  try {
    const userFound = await findUserByUsernameOrEmail(secureInputValues);
    const validTokensCount = await countValidTokensByUserId(userFound.id);

    if (validTokensCount >= 2) {
      return buildFakeToken();
    }

    const tokenObject = await create(userFound);
    await sendEmailToUser(userFound, tokenObject.id, origin);

    return tokenObject;
  } catch (error) {
    if (error instanceof NotFoundError && error.key === "email") {
      return buildFakeToken();
    }

    throw error;
  }
}

async function findUserByUsernameOrEmail({ username, email }: User) {
  if (username) {
    return await user.findOneByUsername(username);
  } else if (email) {
    return await user.findOneByEmail(email);
  } else {
    throw new ValidationError({
      message: "Objeto enviado deve ter no mínimo uma chave.",
      action: "Ajuste os dados enviados e tente novamente.",
    });
  }
}

async function countValidTokensByUserId(userId: string) {
  const tokenNumber = await runSelectQuery(userId);

  return tokenNumber;

  async function runSelectQuery(userId: string) {
    const results = await database.query({
      text: `
        SELECT
          COUNT(*)
        FROM
          reset_password_tokens
        WHERE
          user_id = $1
          AND used_at IS NULL
          AND expires_at >= now()
      ;`,
      values: [userId],
    });

    return Number(results.rows[0].count);
  }
}

function buildFakeToken() {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 1000 * 60 * 15);

  return {
    used_at: null,
    expires_at: expiresAt,
    created_at: now,
    updated_at: now,
  };
}

async function create(user: User) {
  const createdUser = await runInsertQuery(user);

  return createdUser;

  async function runInsertQuery(user: User) {
    const results = await database.query({
      text: `
        INSERT INTO
          reset_password_tokens (user_id, expires_at)
        VALUES
          ($1, now() + interval '15 minutes')
        RETURNING *
      ;`,
      values: [user.id],
    });

    return results.rows[0];
  }
}

async function sendEmailToUser(user: User, tokenId: string, origin: string) {
  await email.send({
    from: `Contato <${process.env.EMAIL_FROM_ADDRESS}>`,
    to: user.email,
    subject: "Recuperação de Senha",
    text: `${user.username}, uma recuperação de senha foi solicitada.

Clique no link abaixo para definir uma nova senha:
${origin}/recovery/confirm-email/${tokenId}

Atenciosamente`,
  });
}

async function resetUserPassword(secureInputValues: User) {
  const tokenObject = await findOneValidTokenById(
    secureInputValues.token_id as string,
  );
  const usedToken = await markTokenAsUsed(tokenObject.id);

  await session.expireAllFromUserId(tokenObject.user_id);
  await user.update(
    { id: tokenObject.user_id },
    { password: secureInputValues.password },
  );

  return usedToken;
}

async function findOneTokenById(tokenId: string) {
  if (process.env.NODE_ENV !== "test") {
    throw new InternalServerError({
      action: "Verifique se o ambiente está correto.",
    });
  }

  const token = await runSelectQuery(tokenId);

  return token;

  async function runSelectQuery(tokenId: string) {
    const results = await database.query({
      text: `
        SELECT
          *
        FROM
          reset_password_tokens
        WHERE
          id = $1
        LIMIT
          1
      ;`,
      values: [tokenId],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: `O token de recuperação de senha utilizado não foi encontrado no sistema.`,
        action: "Certifique-se que está sendo enviado o token corretamente.",
      });
    }

    return results.rows[0];
  }
}

async function findOneValidTokenById(tokenId: string) {
  const token = await runSelectQuery(tokenId);

  return token;

  async function runSelectQuery(tokenId: string) {
    const results = await database.query({
      text: `
        SELECT
          *
        FROM
          reset_password_tokens
        WHERE
          id = $1
          AND used_at IS NULL
          AND expires_at >= now()
        LIMIT
          1
      ;`,
      values: [tokenId],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: `O token de recuperação de senha utilizado não foi encontrado no sistema ou expirou.`,
        action: "Solicite uma nova recuperação de senha.",
        key: "token_id",
      });
    }

    return results.rows[0];
  }
}

async function findOneTokenByUserId(userId: string) {
  if (process.env.NODE_ENV !== "test") {
    throw new InternalServerError({
      action: "Verifique se o ambiente está correto.",
    });
  }

  const token = await runSelectQuery(userId);

  return token;

  async function runSelectQuery(userId: string) {
    const results = await database.query({
      text: `
      SELECT
        *
      FROM
        reset_password_tokens
      WHERE
        user_id = $1
      ORDER BY
        created_at DESC
      LIMIT
        1
    ;`,
      values: [userId],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: `O token de recuperação de senha utilizado não foi encontrado no sistema.`,
        action: "Certifique-se que está sendo enviado o token corretamente.",
      });
    }

    return results.rows[0];
  }
}

async function markTokenAsUsed(tokenId: string) {
  const usedToken = await runUpdateQuery(tokenId);

  return usedToken;

  async function runUpdateQuery(tokenId: string) {
    const results = await database.query({
      text: `
        UPDATE
          reset_password_tokens
        SET
          used_at = timezone('utc', now()),
          updated_at = timezone('utc', now())
        WHERE
          id = $1
        RETURNING
          *
      ;`,
      values: [tokenId],
    });
    return results.rows[0];
  }
}

async function update(tokenId: string, tokenBody: Token) {
  if (process.env.NODE_ENV !== "test") {
    throw new InternalServerError({
      action: "Verifique se o ambiente está correto.",
    });
  }

  const currentToken = await findOneTokenById(tokenId);
  const tokenNewValues = { ...currentToken, ...tokenBody };

  const updatedToken = await runUpdateQuery(tokenId, tokenNewValues);

  return updatedToken;

  async function runUpdateQuery(tokenId: string, tokenBody: Token) {
    const results = await database.query({
      text: `
        UPDATE
          reset_password_tokens
        SET
          user_id = $2,
          used_at = $3,
          expires_at = $4,
          created_at = $5,
          updated_at = $6
        WHERE
          id = $1
        RETURNING
          *
      ;`,
      values: [
        tokenId,
        tokenBody.user_id,
        tokenBody.used_at,
        tokenBody.expires_at,
        tokenBody.created_at,
        tokenBody.updated_at,
      ],
    });

    return results.rows[0];
  }
}

const recovery = {
  create,
  update,
  findOneTokenById,
  findOneTokenByUserId,
  requestPasswordRecovery,
  resetUserPassword,
};

export default recovery;
