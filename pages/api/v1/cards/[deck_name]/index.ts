import { createRouter } from "next-connect";
import { NextApiRequest, NextApiResponse } from "next/types";

import controller from "infra/controller";
import authorization from "models/authorization";
import card from "@/models/card";
import deck from "@/models/deck";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.use(controller.injectAnonymousOrUser);

router.get(controller.canRequest("read:card"), getHandler);
router.post(controller.canRequest("create:card"), postHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request: NextApiRequest, response: NextApiResponse) {
  const userTryingToGet = request.context?.user;
  const deckName = request.query.deck_name;

  const { id: deckId } = await deck.findOneByUserIdAndName(
    userTryingToGet.id,
    deckName as string,
  );

  const cardData = await card.findAllByDeckId(deckId as string);

  const secureOutputValues = authorization.filterOutput(
    userTryingToGet,
    "read:card:all",
    cardData,
  );

  response.status(200).json(secureOutputValues);
}

async function postHandler(request: NextApiRequest, response: NextApiResponse) {
  const userTryingToPost = request.context?.user;
  const deckName = request.query.deck_name;
  const cardInputValues = request.body;

  const { id: deckId } = await deck.findOneByUserIdAndName(
    userTryingToPost.id,
    deckName as string,
  );

  const newCard = await card.create(cardInputValues, deckId);

  const secureOutputValues = authorization.filterOutput(
    userTryingToPost,
    "read:card",
    newCard,
  );

  response.status(201).json(secureOutputValues);
}
