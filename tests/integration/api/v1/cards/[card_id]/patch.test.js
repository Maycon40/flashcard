import { version as uuidVersion } from "uuid";

import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("PATCH /api/v1/cards/id/[card_id]", () => {
  describe("Anonymous user", () => {
    test("Without permission", async () => {
      const response = await fetch(
        `http://localhost:3000/api/v1/cards/id/cf5a330c-5fdf-4a06-9cff-5ebdf85be465`,
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
    test("With valid data", async () => {
      const createdUser = await orchestrator.createUser();

      await orchestrator.activateUser(createdUser.id);

      const newSession = await orchestrator.createSession(createdUser.id);

      const createdDeck = await orchestrator.createDeck(
        "Nome do Baralho",
        createdUser.id,
      );

      const createdCard = await orchestrator.createCard(
        "Nome do Cartão",
        "Descrição do Cartão",
        createdDeck.id,
      );

      const response = await fetch(
        `http://localhost:3000/api/v1/cards/id/${createdCard.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${newSession.token}`,
          },
          body: JSON.stringify({
            name: "Novo nome",
            description: "Nova descrição",
            important: true,
            difficulty: "easy",
          }),
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        name: "Novo nome",
        description: "Nova descrição",
        deck_id: createdDeck.id,
        important: true,
        date_to_review: responseBody.date_to_review,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.date_to_review)).not.toBeNaN();
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      expect(responseBody.updated_at > responseBody.created_at).toBe(true);
      expect(responseBody.date_to_review > responseBody.updated_at).toBe(true);
    });

    test("With not created card", async () => {
      const createdUser = await orchestrator.createUser();

      await orchestrator.activateUser(createdUser.id);

      const newSession = await orchestrator.createSession(createdUser.id);

      const response = await fetch(
        `http://localhost:3000/api/v1/cards/id/cf5a330c-5fdf-4a06-9cff-5ebdf85be465`,
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
        message: "Esse cartão não foi encontrado no sistema.",
        action: "Verifique se o id do cartão está correto.",
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

      const createdCard = await orchestrator.createCard(
        "Nome do Cartão",
        "Descrição do Cartão",
        createdDeck.id,
      );

      const createdUser2 = await orchestrator.createUser();

      await orchestrator.activateUser(createdUser2.id);

      const newSessionUser2 = await orchestrator.createSession(createdUser2.id);

      const response = await fetch(
        `http://localhost:3000/api/v1/cards/id/${createdCard.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${newSessionUser2.token}`,
          },
          body: JSON.stringify({
            name: "Novo nome",
            description: "Nova descrição",
            important: true,
            difficulty: "easy",
          }),
        },
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "Esse cartão não foi encontrado no sistema.",
        action: "Verifique se o id do cartão está correto.",
        status_code: 404,
      });
    });
  });
});
