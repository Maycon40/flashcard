import { createRouter } from "next-connect";
import { NextApiRequest, NextApiResponse } from "next/types";

import controller from "infra/controller";
import authorization from "models/authorization";
import library from "models/library";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.use(controller.injectAnonymousOrUser);

router.get(controller.canRequest("read:library"), getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request: NextApiRequest, response: NextApiResponse) {
  const userTryingToGet = request.context?.user;

  const libraryData = await library.findAll();

  const secureOutputValues = authorization.filterOutput(
    userTryingToGet,
    "read:library:all",
    libraryData,
  );

  response.status(200).json(secureOutputValues);
}
