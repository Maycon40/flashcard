import { version as uuidVersion } from "uuid";

import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/decks", () => {
  describe("Anonymous user", () => {
    test("Without permission", async () => {
      const response = await fetch("http://localhost:3000/api/v1/decks", {
        method: "POST",
      });

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "Você não tem permissão para realizar esta ação.",
        action:
          "Verifique se o seu usuário possui a permissão necessária para realizar esta ação.",
        status_code: 403,
      });
    });
  });

  describe("Default user", () => {
    test("With valid deck", async () => {
      const createdUser = await orchestrator.createUser();

      await orchestrator.activateUser(createdUser.id);

      const newSession = await orchestrator.createSession(createdUser.id);

      const response = await fetch("http://localhost:3000/api/v1/decks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session_id=${newSession.token}`,
        },
        body: JSON.stringify({
          name: "Nome do Baralho",
        }),
      });

      expect(response.status).toBe(201);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        name: "Nome do Baralho",
        user_id: createdUser.id,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });

    test("With created deck", async () => {
      const createdUser = await orchestrator.createUser();

      await orchestrator.activateUser(createdUser.id);

      const newSession = await orchestrator.createSession(createdUser.id);

      const response1 = await fetch("http://localhost:3000/api/v1/decks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session_id=${newSession.token}`,
        },
        body: JSON.stringify({
          name: "Nome do Baralho",
        }),
      });

      expect(response1.status).toBe(201);

      const response2 = await fetch("http://localhost:3000/api/v1/decks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session_id=${newSession.token}`,
        },
        body: JSON.stringify({
          name: "Nome do Baralho",
        }),
      });

      expect(response2.status).toBe(400);

      const response2Body = await response2.json();

      expect(response2Body).toEqual({
        name: "ValidationError",
        message: "O nome do baralho já está sendo utilizado.",
        action: "Utilize outro nome.",
        status_code: 400,
      });
    });
  });
});
