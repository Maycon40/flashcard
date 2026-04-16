import { version as uuidVersion } from "uuid";

import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/library/decks/[deck_id]", () => {
  describe("Anonymous user", () => {
    test("With valid data", async () => {
      const createdUser = await orchestrator.createUser();

      await orchestrator.activateUser(createdUser.id);

      await orchestrator.createSession(createdUser.id);

      const createdDeck = await orchestrator.createDeck(
        "Baralho publico",
        createdUser.id,
      );

      const createdCard = await orchestrator.createCard(
        "Nome do Cartão",
        "Descrição do Cartão",
        createdDeck.id,
      );

      await orchestrator.updateCard(createdCard.id, createdUser.id, {
        public: true,
      });

      const response = await fetch(
        `http://localhost:3000/api/v1/library/decks/${createdDeck.id}`,
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual([
        {
          id: responseBody[0].id,
          name: "Nome do Cartão",
          username: createdUser.username,
          description: "Descrição do Cartão",
          deck_name: "Baralho publico",
          published_at: responseBody[0].published_at,
        },
      ]);

      expect(Date.parse(responseBody[0].published_at)).not.toBeNaN();
    });
  });

  describe("Default user", () => {
    test("With card not created", async () => {
      await orchestrator.clearDatabase();
      await orchestrator.runPendingMigrations();

      const createdUser = await orchestrator.createUser();

      await orchestrator.activateUser(createdUser.id);

      const newSession = await orchestrator.createSession(createdUser.id);

      const response = await fetch(
        `http://localhost:3000/api/v1/library/decks/cf5a330c-5fdf-4a06-9cff-5ebdf85be465`,
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
        message: "Nenhum cartão foi publicado.",
        action: "Verifique se algum usuário publicou algum cartão.",
        status_code: 404,
      });
    });

    test("With card not published", async () => {
      await orchestrator.clearDatabase();
      await orchestrator.runPendingMigrations();

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

      const newSession = await orchestrator.createSession(createdUser.id);

      const response = await fetch(
        `http://localhost:3000/api/v1/library/decks/cf5a330c-5fdf-4a06-9cff-5ebdf85be465`,
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
        message: "Nenhum cartão foi publicado.",
        action: "Verifique se algum usuário publicou algum cartão.",
        status_code: 404,
      });
    });

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

      await orchestrator.updateCard(createdCard.id, createdUser.id, {
        public: true,
      });

      const response = await fetch(
        `http://localhost:3000/api/v1/library/decks/${createdDeck.id}`,
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
          username: createdUser.username,
          description: "Descrição do Cartão",
          deck_name: "Nome do Baralho",
          published_at: responseBody[0].published_at,
        },
      ]);

      expect(uuidVersion(responseBody[0].id)).toBe(4);
      expect(Date.parse(responseBody[0].published_at)).not.toBeNaN();
    });
  });

  describe("Another user", () => {
    test("With other user's data", async () => {
      await orchestrator.clearDatabase();
      await orchestrator.runPendingMigrations();

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
        `http://localhost:3000/api/v1/library/decks/${createdDeck.id}`,
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
        message: "Nenhum cartão foi publicado.",
        action: "Verifique se algum usuário publicou algum cartão.",
        status_code: 404,
      });
    });
  });
});
