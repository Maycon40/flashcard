import database from "@/infra/database";
import { NotFoundError, ValidationError } from "@/infra/errors";
import { Deck } from "@/types/types";
import card from "@/models/card";

async function create(deck: Deck, userId: string) {
  await validateUniqueDeckName(deck.name || "", userId);

  const newDeck = await runInsertQuery(deck, userId);

  return newDeck;

  async function runInsertQuery(deck: Deck, userId: string) {
    const { name } = deck;

    const results = await database.query({
      text: `
        INSERT INTO
          decks (name, user_id)
        VALUES
          ($1, $2)
        RETURNING
          *
      ;`,
      values: [name, userId],
    });

    return results.rows[0];
  }
}

async function validateUniqueDeckName(deckName: string, userId: string) {
  const results = await database.query({
    text: `
    SELECT
      name
    FROM
      decks
    WHERE
      LOWER(name) = LOWER($1) AND
      user_id = $2
    ;`,
    values: [deckName, userId],
  });

  if (results.rowCount && results.rowCount > 0) {
    throw new ValidationError({
      message: "O nome do baralho já está sendo utilizado.",
      action: "Utilize outro nome.",
    });
  }
}

async function findAllByUserId(userId: string) {
  const decksFound = await runSelectQuery(userId);

  return decksFound;

  async function runSelectQuery(userId: string) {
    const results = await database.query({
      text: `
        SELECT
          *
        FROM
          decks
        WHERE
          user_id = $1
        ORDER BY
          LOWER(name)
        ;`,
      values: [userId],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "Nenhum baralho foi encontrado no sistema.",
        action: "Verifique se o usuário já criou algum baralho.",
      });
    }

    return results.rows;
  }
}

async function findOneByUserIdAndName(userId: string, deckName: string) {
  const deckFound = await runSelectQuery(userId, deckName);

  return deckFound;

  async function runSelectQuery(userId: string, deckName: string) {
    const results = await database.query({
      text: `
        SELECT
          *
        FROM
          decks
        WHERE
          user_id = $1 AND
          name = $2
        ;`,
      values: [userId, deckName],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "Esse baralho não foi encontrado no sistema.",
        action: "Verifique se o nome do baralho foi digitado corretamente.",
      });
    }

    return results.rows[0];
  }
}

async function updateByUserIdAndName(deckValues: Deck, deckNewValues: Deck) {
  if (
    deckNewValues.name &&
    deckNewValues.name?.toLowerCase() !== deckValues.name?.toLowerCase()
  ) {
    await validateUniqueDeckName(
      deckNewValues.name || "",
      deckValues.user_id || "",
    );
  }

  const deckWithNewValues = {
    ...deckValues,
    name: deckNewValues.name,
  };

  const updatedDeck = await runUpdateQuery(deckWithNewValues);

  return updatedDeck;

  async function runUpdateQuery(deckValues: Deck) {
    const result = await database.query({
      text: `
        UPDATE
          decks
        SET
          name = $2
        WHERE
          id = $1
        RETURNING
          *
        ;
      `,
      values: [deckValues.id, deckValues.name],
    });

    return result.rows[0];
  }
}

async function deleteById(deckId: string) {
  try {
    await card.findAllByDeckId(deckId);

    throw new ValidationError({
      message: "Não é possível excluir um baralho que ainda contém cartões.",
      action: "Apague os cartões do baralho ou mova-os para um outro baralho.",
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      const deletedDeck = await runDeleteQuery(deckId);

      return deletedDeck;
    }

    throw error;
  }

  async function runDeleteQuery(deckId: string) {
    const result = await database.query({
      text: `
        DELETE FROM
          decks
        WHERE
          id = $1
        RETURNING
          *
        ;
      `,
      values: [deckId],
    });

    return result.rows[0];
  }
}

const deck = {
  create,
  findAllByUserId,
  findOneByUserIdAndName,
  updateByUserIdAndName,
  deleteById,
};

export default deck;
