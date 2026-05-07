import { createRouter, NextHandler } from "next-connect";
import { NextApiRequest, NextApiResponse } from "next/types";

import controller from "infra/controller";
import user from "models/user";
import activation from "models/activation";
import authorization from "models/authorization";
import validator from "models/validator";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.use(controller.injectAnonymousOrUser);

router.post(
  postValidationHandler,
  controller.canRequest("create:user"),
  postHandler,
);

export default router.handler(controller.errorHandlers);

function postValidationHandler(
  request: NextApiRequest,
  response: NextApiResponse,
  next: NextHandler,
) {
  const cleanValues = validator.verify(request.body, {
    username: "required",
    email: "required",
    password: "required",
  });

  request.body = cleanValues;

  return next();
}

async function postHandler(request: NextApiRequest, response: NextApiResponse) {
  const userTryingToPost = request.context?.user;

  const protocol = request.headers["x-forwarded-proto"] ?? "https";
  const host = request.headers.host;
  const origin = `${protocol}://${host}`;

  const userInputValues = request.body;
  const newUser = await user.create(userInputValues);

  const activationToken = await activation.create(newUser.id);
  await activation.sendEmailToUser(newUser, activationToken, origin);

  const secureOutputValues = authorization.filterOutput(
    userTryingToPost,
    "read:user",
    newUser,
  );

  response.status(201).json(secureOutputValues);
}
