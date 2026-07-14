import { createRouter } from "next-connect";
import { NextApiRequest, NextApiResponse } from "next/types";

import controller from "infra/controller";
import session from "models/session";
import user from "models/user";
import authorization from "models/authorization";
import authentication from "models/authentication";
import { UnauthorizedError, ValidationError } from "infra/errors";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.use(controller.injectAnonymousOrUser);

router.get(controller.canRequest("read:session"), getHandler);

router.delete(deleteHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request: NextApiRequest, response: NextApiResponse) {
  const userTryingToGet = request.context?.user;
  const sessionToken = controller.getSessionToken(request);

  const sessionObject = await session.findOneValidByToken(
    sessionToken as string,
  );
  await session.renew(sessionObject.id);

  const userFound = await user.findOneById(sessionObject.user_id);

  controller.setSessionCookie(sessionObject.token, response);

  response.setHeader(
    "Cache-Control",
    "no-store, no-cache, max-age=0, must-revalidate",
  );

  const secureOutputValues = authorization.filterOutput(
    userTryingToGet,
    "read:user:self",
    userFound,
  );

  response.status(200).json(secureOutputValues);
}

async function deleteHandler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const { username, email, password } = request.body || {};

  if (!username || !email || !password) {
    throw new ValidationError({
      message: "Credenciais insuficientes fornecidas para exclusão de conta.",
      action: "Informe o nome de usuário, e-mail e senha corretos.",
    });
  }

  const authenticatedUser = await authentication.validate(email, password);

  if (authenticatedUser.username.toLowerCase() !== username.toLowerCase()) {
    throw new UnauthorizedError({
      message: "O nome de usuário não coincide com as credenciais informadas.",
      action: "Verifique as informações digitadas e tente novamente.",
    });
  }

  const userDeleted = await user.deleteById(authenticatedUser.id);

  controller.clearSessionCookie(response);

  const secureOutputValues = authorization.filterOutput(
    authenticatedUser,
    "read:user:self",
    userDeleted,
  );

  response.status(200).json(secureOutputValues);
}
