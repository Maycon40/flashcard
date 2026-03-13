import { createRouter } from "next-connect";
import { NextApiRequest, NextApiResponse } from "next/types";

import controller from "infra/controller";
import authorization from "models/authorization";
import card from "@/models/card";
import deck from "@/models/deck";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.use(controller.injectAnonymousOrUser);

router.get(controller.canRequest("read:card"), getHandler);
router.patch(controller.canRequest("update:card"), patchHandler);
router.delete(controller.canRequest("delete:card"), deleteHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request: NextApiRequest, response: NextApiResponse) {
  const userTryingToGet = request.context?.user;
  const deckName = request.query.deck_name;
  const cardName = request.query.card_name;

  const { id: deckId } = await deck.findOneByUserIdAndName(
    userTryingToGet.id,
    deckName as string,
  );

  const cardData = await card.findOneByDeckIdAndName(
    deckId as string,
    cardName as string,
  );

  const secureOutputValues = authorization.filterOutput(
    userTryingToGet,
    "read:card",
    cardData,
  );

  response.status(200).json(secureOutputValues);
}

async function patchHandler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const userTryingToPatch = request.context?.user;
  const deckName = request.query.deck_name;
  const cardName = request.query.card_name;
  const cardNewValues = request.body;

  const { id: deckId } = await deck.findOneByUserIdAndName(
    userTryingToPatch.id,
    deckName as string,
  );

  const cardValues = await card.findOneByDeckIdAndName(
    deckId as string,
    cardName as string,
  );

  const updatedCard = await card.updateByDeckIdAndName(
    cardValues,
    cardNewValues,
    userTryingToPatch.id,
  );

  const secureOutputValues = authorization.filterOutput(
    userTryingToPatch,
    "read:card",
    updatedCard,
  );

  response.status(200).json(secureOutputValues);
}

async function deleteHandler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const userTryingToDelete = request.context?.user;
  const deckName = request.query.deck_name;
  const cardName = request.query.card_name;

  const { id: deckId } = await deck.findOneByUserIdAndName(
    userTryingToDelete.id,
    deckName as string,
  );

  const cardValues = await card.findOneByDeckIdAndName(
    deckId as string,
    cardName as string,
  );

  const deletedCard = await card.deleteById(cardValues.id);

  const secureOutputValues = authorization.filterOutput(
    userTryingToDelete,
    "read:card",
    deletedCard,
  );

  response.status(200).json(secureOutputValues);
}
