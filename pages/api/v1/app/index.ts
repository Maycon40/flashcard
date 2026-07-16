import { createRouter } from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";

import controller from "@/infra/controller";
import authorization from "@/models/authorization";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.use(controller.injectAnonymousOrUser);

router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request: NextApiRequest, response: NextApiResponse) {
  const userTryingToGet = request.context?.user;

  const updatedAt = new Date().toISOString();

  const statusObject = {
    minVersionRequired: "1.1.4",
    latestVersion: "1.1.4",
    updateUrl:
      "https://play.google.com/store/apps/details?id=com.maycon.myflashcard",
    updated_at: updatedAt,
  };

  const secureOutputValues = authorization.filterOutput(
    userTryingToGet,
    "read:app",
    statusObject,
  );

  return response.status(200).json(secureOutputValues);
}
