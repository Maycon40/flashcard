import { createRouter } from "next-connect";
import { NextApiRequest, NextApiResponse } from "next/types";

import controller from "infra/controller";
import authorization from "models/authorization";
import deck from "@/models/deck";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.use(controller.injectAnonymousOrUser);

router.get(controller.canRequest("read:deck"), getHandler);
router.patch(controller.canRequest("update:deck"), patchHandler);
router.delete(controller.canRequest("delete:deck"), deleteHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request: NextApiRequest, response: NextApiResponse) {
  const deckName = request.query.deck_name;
  const userTryingToGet = request.context?.user;

  const deckData = await deck.findOneByUserIdAndName(
    userTryingToGet.id as string,
    deckName as string,
  );

  const secureOutputValues = authorization.filterOutput(
    userTryingToGet,
    "read:deck",
    deckData,
  );

  response.status(200).json(secureOutputValues);
}

async function patchHandler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const deckName = request.query.deck_name;
  const userTryingToPatch = request.context?.user;
  const deckNewValues = request.body;

  const deckValues = await deck.findOneByUserIdAndName(
    userTryingToPatch.id as string,
    deckName as string,
  );

  const updatedDeck = await deck.updateByUserIdAndName(
    deckValues,
    deckNewValues,
  );

  const secureOutputValues = authorization.filterOutput(
    userTryingToPatch,
    "read:deck",
    updatedDeck,
  );

  response.status(200).json(secureOutputValues);
}

async function deleteHandler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const deckName = request.query.deck_name;
  const userTryingToDelete = request.context?.user;

  const deckValues = await deck.findOneByUserIdAndName(
    userTryingToDelete.id as string,
    deckName as string,
  );

  const deletedDeck = await deck.deleteById(deckValues.id);

  const secureOutputValues = authorization.filterOutput(
    userTryingToDelete,
    "read:deck",
    deletedDeck,
  );

  response.status(200).json(secureOutputValues);
}
