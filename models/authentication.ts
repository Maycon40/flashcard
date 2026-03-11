import {
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "@/infra/errors";
import password from "@/models/password";
import user from "@/models/user";

async function validate(email: string, providedPassword: string) {
  try {
    const storedUser = await findUserByEmail(email);
    await validatePassword(providedPassword, storedUser.password);

    return storedUser;
  } catch (error) {
    if (error instanceof ValidationError) {
      throw new UnauthorizedError({
        message: "Dados de autenticação não conferem.",
        action: "Verifique se os dados enviados estão corretos.",
        cause: error,
      });
    }

    throw error;
  }

  async function findUserByEmail(email: string) {
    try {
      const storedUser = await user.findOneByEmail(email);

      return storedUser;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new ValidationError({
          message: "Email não está cadastrado.",
          action: "Verifique se esse campo está correto.",
        });
      }

      throw error;
    }
  }

  async function validatePassword(
    providedPassword: string,
    storedPassword: string,
  ) {
    const correctPasswordMatch = await password.compare(
      providedPassword,
      storedPassword,
    );

    if (!correctPasswordMatch) {
      throw new ValidationError({
        message: "Senha informada está errada.",
        action: "Verifique se esse campo está correto.",
      });
    }
  }
}

const authentication = {
  validate,
};

export default authentication;
