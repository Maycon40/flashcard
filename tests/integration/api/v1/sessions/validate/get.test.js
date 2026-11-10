import setCookieParser from "set-cookie-parser";

import orchestrator from "tests/orchestrator";
import session from "models/session";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/sessions/validate", () => {
  test("With valid session", async () => {
    const createdUser = await orchestrator.createUser();
    const createdSession = await orchestrator.createSession(createdUser.id);

    const response = await fetch(
      "http://localhost:3000/api/v1/sessions/validate",
      {
        headers: {
          Cookie: `session_id=${createdSession.token}`,
        },
      },
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ valid: true });
    expect(response.headers.get("cache-control")).toBe(
      "no-store, no-cache, max-age=0, must-revalidate",
    );

    const sessionAfterValidation = await session.findOneValidByToken(
      createdSession.token,
    );

    expect(sessionAfterValidation.expires_at).toEqual(
      createdSession.expires_at,
    );
    expect(sessionAfterValidation.updated_at).toEqual(
      createdSession.updated_at,
    );
  });

  test("With revoked session", async () => {
    const createdUser = await orchestrator.createUser();
    const createdSession = await orchestrator.createSession(createdUser.id);

    await session.expireById(createdSession.id);

    const response = await fetch(
      "http://localhost:3000/api/v1/sessions/validate",
      {
        headers: {
          Cookie: `session_id=${createdSession.token}`,
        },
      },
    );

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({
      name: "UnauthorizedError",
      message: "Usuário não possui sessão ativa.",
      action: "Verifique se o usuário está logado e tente novamente.",
      status_code: 401,
    });

    const parsedSetCookie = setCookieParser(response, { map: true });

    expect(parsedSetCookie.session_id).toEqual({
      name: "session_id",
      value: "invalid",
      maxAge: -1,
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
    });
  });
});
