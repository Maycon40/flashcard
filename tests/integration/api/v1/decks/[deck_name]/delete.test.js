import { version as uuidVersion } from "uuid";

import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("DELETE /api/v1/decks/[deck_name]", () => {
  describe("Anonymous user", () => {
    test("Without permission", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/decks/deckname",
        {
          method: "DELETE",
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
          method: "DELETE",
          headers: {
            Cookie: `session_id=${newSession.token}`,
          },
        },
      );

      expect(response.status).toBe(200);

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

      const response2 = await fetch(
        `http://localhost:3000/api/v1/decks/${createdDeck.name}`,
        {
          method: "DELETE",
          headers: {
            Cookie: `session_id=${newSession.token}`,
          },
        },
      );

      expect(response2.status).toBe(404);
    });

    test("With not created deck", async () => {
      const createdUser = await orchestrator.createUser();

      await orchestrator.activateUser(createdUser.id);

      const newSession = await orchestrator.createSession(createdUser.id);

      const response = await fetch(
        "http://localhost:3000/api/v1/decks/invalid_deck",
        {
          method: "DELETE",
          headers: {
            Cookie: `session_id=${newSession.token}`,
          },
        },
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "Esse baralho foi encontrado no sistema.",
        action: "Verifique se o nome do baralho foi digitado corretamente.",
        status_code: 404,
      });
    });
  });
});
