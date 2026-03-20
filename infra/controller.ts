import * as cookie from "cookie";

import {
  ForbiddenError,
  InternalServerError,
  MethodNotAllowedError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "@/infra/errors";
import session from "@/models/session";
import user from "@/models/user";
import authorization from "@/models/authorization";
import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";

function onNoMatchHandler(request: NextApiRequest, response: NextApiResponse) {
  const publicErrorObject = new MethodNotAllowedError();
  response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

function onErrorHandler(
  error: unknown,
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (
    error instanceof ValidationError ||
    error instanceof NotFoundError ||
    error instanceof ForbiddenError
  ) {
    return response.status(error.statusCode).json(error);
  }

  if (error instanceof UnauthorizedError) {
    clearSessionCookie(response);
    return response.status(error.statusCode).json(error);
  }

  const publicErrorObject = new InternalServerError({
    cause: error as Error,
  });

  console.log(publicErrorObject);

  return response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

function canRequest(requiredFeature: string) {
  return canRequestMiddleware;

  async function canRequestMiddleware(
    request: NextApiRequest,
    response: NextApiResponse,
    next: NextHandler,
  ) {
    const userTryingToRequest = request.context?.user;

    if (!authorization.can(userTryingToRequest, requiredFeature)) {
      throw new ForbiddenError({
        message: "Você não tem permissão para realizar esta ação.",
        action:
          "Verifique se o seu usuário possui a permissão necessária para realizar esta ação.",
      });
    }

    await next();
  }
}

async function injectAnonymousOrUser(
  request: NextApiRequest,
  response: NextApiResponse,
  next: NextHandler,
) {
  const sessionToken = request.cookies?.session_id;

  if (sessionToken) {
    await injectAuthenticatedUser(request);
  } else {
    await injectAnonymousUser(request);
  }

  await next();
}

async function injectAuthenticatedUser(request: NextApiRequest) {
  const sessionToken = request.cookies?.session_id;

  const sessionObject = await session.findOneValidByToken(
    sessionToken as string,
  );

  const userFound = await user.findOneById(sessionObject.user_id);

  request.context = {
    ...request.context,
    user: userFound,
  };
}

async function injectAnonymousUser(request: NextApiRequest) {
  request.context = {
    ...request.context,
    user: {
      features: [
        "read:activation_token",
        "create:session",
        "create:user",
        "create:recovery_token",
        "update:recovery_token",
      ],
    },
  };
}

function setSessionCookie(sessionToken: string, response: NextApiResponse) {
  const setCookie = cookie.serialize("session_id", sessionToken, {
    path: "/",
    maxAge: session.EXPIRATION_IN_MILLISECONDS / 1000,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });

  response.setHeader("Set-Cookie", setCookie);
}

function clearSessionCookie(response: NextApiResponse) {
  const setCookie = cookie.serialize("session_id", "invalid", {
    path: "/",
    maxAge: -1,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });

  response.setHeader("Set-Cookie", setCookie);
}

const controller = {
  errorHandlers: {
    onNoMatch: onNoMatchHandler,
    onError: onErrorHandler,
  },
  injectAnonymousOrUser,
  setSessionCookie,
  clearSessionCookie,
  canRequest,
};

export default controller;
