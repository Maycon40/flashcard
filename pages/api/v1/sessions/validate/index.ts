import { createRouter } from "next-connect";
import { NextApiRequest, NextApiResponse } from "next/types";

import controller from "infra/controller";
import { UnauthorizedError } from "infra/errors";
import session from "models/session";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request: NextApiRequest, response: NextApiResponse) {
  response.setHeader(
    "Cache-Control",
    "no-store, no-cache, max-age=0, must-revalidate",
  );

  const sessionToken = controller.getSessionToken(request);

  if (!sessionToken) {
    throw new UnauthorizedError({
      message: "Usuário não possui sessão ativa.",
      action: "Verifique se o usuário está logado e tente novamente.",
    });
  }

  await session.findOneValidByToken(sessionToken);

  return response.status(200).json({ valid: true });
}
