import { createRouter } from "next-connect";
import { NextApiRequest, NextApiResponse } from "next/types";

import controller from "infra/controller";
import authorization from "models/authorization";
import deck from "@/models/deck";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.use(controller.injectAnonymousOrUser);

router.get(controller.canRequest("read:deck"), getHandler);
router.post(controller.canRequest("create:deck"), postHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request: NextApiRequest, response: NextApiResponse) {
  const userTryingToGet = request.context?.user;
  const deckData = await deck.findAllByUserId(userTryingToGet.id as string);

  const secureOutputValues = authorization.filterOutput(
    userTryingToGet,
    "read:deck:all",
    deckData,
  );

  response.status(200).json(secureOutputValues);
}

async function postHandler(request: NextApiRequest, response: NextApiResponse) {
  const userTryingToPost = request.context?.user;
  const deckInputValues = request.body;

  const newDeck = await deck.create(deckInputValues, userTryingToPost.id);

  const secureOutputValues = authorization.filterOutput(
    userTryingToPost,
    "read:deck",
    newDeck,
  );

  response.status(201).json(secureOutputValues);
}
