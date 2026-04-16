import { createRouter } from "next-connect";
import { NextApiRequest, NextApiResponse } from "next/types";

import controller from "infra/controller";
import authorization from "models/authorization";
import card from "@/models/card";
import deck from "@/models/deck";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.use(controller.injectAnonymousOrUser);

router.get(controller.canRequest("read:card"), getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request: NextApiRequest, response: NextApiResponse) {
  const userTryingToGet = request.context?.user;
  const { important } = request.query;

  const decks = await deck.findAllByUserId(userTryingToGet.id);

  const cardData = await card.findAllToReview(decks, important === "true");

  const secureOutputValues = authorization.filterOutput(
    userTryingToGet,
    "read:card",
    cardData,
  );

  response.status(200).json(secureOutputValues);
}
