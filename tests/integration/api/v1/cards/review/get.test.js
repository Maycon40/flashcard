import { version as uuidVersion } from "uuid";

import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/cards/review", () => {
  describe("Anonymous user", () => {
    test("Without permission", async () => {
      const response = await fetch(`http://localhost:3000/api/v1/cards/review`);

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

      const createCard = await orchestrator.createCard(
        "Nome do Cartão",
        "Descrição do Cartão",
        createdDeck.id,
      );

      const response = await fetch(
        `http://localhost:3000/api/v1/cards/review`,
        {
          headers: {
            Cookie: `session_id=${newSession.token}`,
          },
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual([
        {
          id: responseBody[0].id,
          name: "Nome do Cartão",
          description: "Descrição do Cartão",
          box: "new",
          important: false,
          deck_id: createdDeck.id,
          deck_name: "Nome do Baralho",
          date_to_review: responseBody[0].date_to_review,
          published_at: null,
          created_at: responseBody[0].created_at,
          updated_at: responseBody[0].updated_at,
        },
      ]);

      expect(uuidVersion(responseBody[0].id)).toBe(4);
      expect(Date.parse(responseBody[0].date_to_review)).not.toBeNaN();
      expect(Date.parse(responseBody[0].created_at)).not.toBeNaN();
      expect(Date.parse(responseBody[0].updated_at)).not.toBeNaN();

      const response2 = await fetch(
        `http://localhost:3000/api/v1/cards/identifier/${createCard.name}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${newSession.token}`,
          },
          body: JSON.stringify({ difficulty: "easy" }),
        },
      );

      expect(response2.status).toBe(200);

      const response3 = await fetch(
        `http://localhost:3000/api/v1/cards/review`,
        {
          headers: {
            Cookie: `session_id=${newSession.token}`,
          },
        },
      );

      expect(response3.status).toBe(404);

      const response3Body = await response3.json();

      expect(response3Body).toEqual({
        name: "NotFoundError",
        message: "Nenhum cartão para revisar foi encontrado no sistema.",
        action: "Espere até que existam novos cartões para revisar.",
        status_code: 404,
      });
    });

    test("With not created card", async () => {
      const createdUser = await orchestrator.createUser();

      await orchestrator.activateUser(createdUser.id);

      const newSession = await orchestrator.createSession(createdUser.id);

      await orchestrator.createDeck("Baralho sem cartões", createdUser.id);

      const response = await fetch(
        `http://localhost:3000/api/v1/cards/review`,
        {
          headers: {
            Cookie: `session_id=${newSession.token}`,
          },
        },
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        action: "Verifique se o usuário já criou algum cartão.",
        message: "Nenhum cartão foi encontrado no sistema.",
        status_code: 404,
      });
    });

    test("With not created deck", async () => {
      const createdUser = await orchestrator.createUser();

      await orchestrator.activateUser(createdUser.id);

      const newSession = await orchestrator.createSession(createdUser.id);

      const response = await fetch(
        `http://localhost:3000/api/v1/cards/review`,
        {
          headers: {
            Cookie: `session_id=${newSession.token}`,
          },
        },
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        action: "Verifique se o usuário já criou algum baralho.",
        message: "Nenhum baralho foi encontrado no sistema.",
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

      await orchestrator.createCard(
        "Nome do Cartão",
        "Descrição do Cartão",
        createdDeck.id,
      );

      const createdUser2 = await orchestrator.createUser();

      await orchestrator.activateUser(createdUser2.id);

      const newSessionUser2 = await orchestrator.createSession(createdUser2.id);

      const response = await fetch(
        `http://localhost:3000/api/v1/cards/review`,
        {
          headers: {
            Cookie: `session_id=${newSessionUser2.token}`,
          },
        },
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "Nenhum baralho foi encontrado no sistema.",
        action: "Verifique se o usuário já criou algum baralho.",
        status_code: 404,
      });
    });
  });
});
