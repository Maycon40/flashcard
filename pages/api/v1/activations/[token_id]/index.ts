import { createRouter } from "next-connect";
import controller from "infra/controller";
import activation from "models/activation";
import authorization from "models/authorization";
import { NextApiRequest, NextApiResponse } from "next/types";
import card from "@/models/card";
import deck from "@/models/deck";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.use(controller.injectAnonymousOrUser);

router.patch(controller.canRequest("read:activation_token"), patchHandler);

export default router.handler(controller.errorHandlers);

async function patchHandler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const userTryingToPatch = request.context?.user;
  const activationTokenId = request.query.token_id;

  await activation.findOneValidById(activationTokenId as string);

  const activatedToken = await activation.markTokenAsUsed(
    activationTokenId as string,
  );

  const createdDeck = await deck.create(
    {
      name: "Baralho de Exemplo",
    },
    activatedToken.user_id,
  );

  await card.create(
    {
      name: "Aqui fica o conteúdo a ser memorizado",
      description: "Aqui fica a explicação ou resposta do cartão",
    },
    createdDeck.id,
  );

  const secureOutputValues = authorization.filterOutput(
    userTryingToPatch,
    "read:activation_token",
    activatedToken,
  );

  response.status(200).json(secureOutputValues);
}
