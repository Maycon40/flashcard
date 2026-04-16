import { createRouter } from "next-connect";
import { NextApiRequest, NextApiResponse } from "next/types";

import controller from "infra/controller";
import authorization from "models/authorization";
import card from "@/models/card";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.use(controller.injectAnonymousOrUser);

router.get(controller.canRequest("read:card"), getHandler);
router.patch(controller.canRequest("update:card"), patchHandler);
router.delete(controller.canRequest("delete:card"), deleteHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request: NextApiRequest, response: NextApiResponse) {
  const userTryingToGet = request.context?.user;
  const cardId = request.query.card_id;

  const cardValues = await card.findOneById(
    cardId as string,
    userTryingToGet.id,
  );

  const secureOutputValues = authorization.filterOutput(
    userTryingToGet,
    "read:card",
    cardValues,
  );

  response.status(200).json(secureOutputValues);
}

async function patchHandler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const userTryingToPatch = request.context?.user;
  const cardId = request.query.card_id;
  const cardNewValues = request.body;

  const updatedCard = await card.updateById(
    cardId as string,
    userTryingToPatch.id,
    cardNewValues,
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
  const cardId = request.query.card_id;

  await card.findOneById(cardId as string, userTryingToDelete.id);

  const deletedCard = await card.deleteById(cardId as string);

  const secureOutputValues = authorization.filterOutput(
    userTryingToDelete,
    "read:card",
    deletedCard,
  );

  response.status(200).json(secureOutputValues);
}
