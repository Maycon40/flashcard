import { version as uuidVersion } from "uuid";

import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("PATCH /api/v1/decks/[deck_name]", () => {
  describe("Anonymous user", () => {
    test("Without permission", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/decks/deckname",
        {
          method: "PATCH",
        },
      );

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

      const createdDeck = await orchestrator.createDeck(
        "Nome do Baralho",
        createdUser.id,
      );

      const response = await fetch(
        `http://localhost:3000/api/v1/decks/${createdDeck.name}`,
        {
          method: "PATCH",
          headers: {
            Cookie: `session_id=${newSession.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "Novo nome do Baralho",
          }),
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        name: "Novo nome do Baralho",
        user_id: createdUser.id,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      expect(responseBody.updated_at > responseBody.created_at).toBe(true);
    });

    test("With not created deck", async () => {
      const createdUser = await orchestrator.createUser();

      await orchestrator.activateUser(createdUser.id);

      const newSession = await orchestrator.createSession(createdUser.id);

      const response = await fetch(
        "http://localhost:3000/api/v1/decks/invalid_deck",
        {
          method: "PATCH",
          headers: {
            Cookie: `session_id=${newSession.token}`,
          },
        },
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "Esse baralho não foi encontrado no sistema.",
        action: "Verifique se o nome do baralho foi digitado corretamente.",
        status_code: 404,
      });
    });
  });

  describe("Another user", () => {
    test("With other user's data", async () => {
      const createdUser = await orchestrator.createUser();

      await orchestrator.activateUser(createdUser.id);

      const createdDeck = await orchestrator.createDeck(
        "Nome do Baralho",
        createdUser.id,
      );

      const createdUser2 = await orchestrator.createUser();

      await orchestrator.activateUser(createdUser2.id);

      const newSessionUser2 = await orchestrator.createSession(createdUser2.id);

      const response = await fetch(
        `http://localhost:3000/api/v1/decks/${createdDeck.name}`,
        {
          method: "PATCH",
          headers: {
            Cookie: `session_id=${newSessionUser2.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "Novo nome do Baralho",
          }),
        },
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "Esse baralho não foi encontrado no sistema.",
        action: "Verifique se o nome do baralho foi digitado corretamente.",
        status_code: 404,
      });
    });
  });
});
