import { createRouter } from "next-connect";
import { NextApiRequest, NextApiResponse } from "next/types";

import controller from "infra/controller";
import session from "models/session";
import user from "models/user";
import authorization from "models/authorization";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.use(controller.injectAnonymousOrUser);

router.get(controller.canRequest("read:session"), getHandler);

router.delete(controller.canRequest("delete:user"), deleteHandler);

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
  const userTryingToDelete = request.context?.user;

  const userDeleted = await user.deleteById(userTryingToDelete.id);

  const secureOutputValues = authorization.filterOutput(
    userTryingToDelete,
    "read:user:self",
    userDeleted,
  );

  response.status(200).json(secureOutputValues);
}
