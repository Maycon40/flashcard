import { createRouter } from "next-connect";
import { NextApiRequest, NextApiResponse } from "next/types";

import { ForbiddenError } from "@/infra/errors";
import authorization from "@/models/authorization";
import controller from "@/infra/controller";
import recovery from "@/models/recovery";

const router = createRouter<NextApiRequest, NextApiResponse>();
router.use(controller.injectAnonymousOrUser);
router.post(controller.canRequest("create:recovery_token"), postHandler);
router.patch(controller.canRequest("update:recovery_token"), patchHandler);
export default router.handler(controller.errorHandlers);

async function postHandler(request: NextApiRequest, response: NextApiResponse) {
  const userTryingToRecover = request.context?.user;
  const validatedInputValues = request.body;

  const protocol = request.headers["x-forwarded-proto"] ?? "https";
  const host = request.headers.host;
  const origin = `${protocol}://${host}`;

  if (
    validatedInputValues.username &&
    !authorization.can(userTryingToRecover, "create:recovery_token:username")
  ) {
    throw new ForbiddenError({
      message: `Você não possui permissão para criar um token de recuperação com username.`,
      action: `Verifique se o usuário tem permissão para realizar essa ação.`,
    });
  }

  const tokenObject = await recovery.requestPasswordRecovery(
    validatedInputValues,
    origin,
  );

  const authorizedValuesToReturn = authorization.filterOutput(
    userTryingToRecover,
    "read:recovery_token",
    tokenObject,
  );

  return response.status(201).json(authorizedValuesToReturn);
}

async function patchHandler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const userTryingToRecover = request.context?.user;
  const validatedInputValues = request.body;

  const tokenObject = await recovery.resetUserPassword(validatedInputValues);

  const authorizedValuesToReturn = authorization.filterOutput(
    userTryingToRecover,
    "read:recovery_token",
    tokenObject,
  );

  return response.status(200).json(authorizedValuesToReturn);
}
