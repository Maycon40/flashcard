import { createRouter } from "next-connect";
import { NextApiRequest, NextApiResponse } from "next/types";

import controller from "infra/controller";
import authorization from "models/authorization";
import card from "@/models/card";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.use(controller.injectAnonymousOrUser);

router.post(controller.canRequest("create:card"), postHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request: NextApiRequest, response: NextApiResponse) {
  const userTryingToPost = request.context?.user;
  const cardInputValues = request.body;

  const newCard = await card.importCards(cardInputValues, userTryingToPost.id);

  const secureOutputValues = authorization.filterOutput(
    userTryingToPost,
    "read:card",
    newCard,
  );

  response.status(201).json(secureOutputValues);
}
