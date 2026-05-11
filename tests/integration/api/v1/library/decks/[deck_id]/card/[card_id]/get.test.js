import { version as uuidVersion } from "uuid";

import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/library/decks/[deck_id]/card/[card_id]", () => {
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
        `http://localhost:3000/api/v1/library/decks/${createdDeck.id}/card/${createdCard.id}`,
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        name: "Nome do Cartão",
        username: createdUser.username,
        description: "Descrição do Cartão",
        deck_id: responseBody.deck_id,
        deck_name: "Baralho publico",
        published_at: responseBody.published_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(uuidVersion(responseBody.deck_id)).toBe(4);
      expect(Date.parse(responseBody.published_at)).not.toBeNaN();
    });

    test("With deck not created", async () => {
      await orchestrator.clearDatabase();
      await orchestrator.runPendingMigrations();

      const createdUser = await orchestrator.createUser();

      await orchestrator.activateUser(createdUser.id);

      const response = await fetch(
        `http://localhost:3000/api/v1/library/decks/cf5a330c-5fdf-4a06-9cff-5ebdf85be465/card/cf5a330c-5fdf-4a06-9cff-5ebdf85be465`,
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "O cartão não foi encontrado.",
        action: "Verifique se o cartão procurado foi publicado.",
        status_code: 404,
      });
    });

    test("With deck created and card not created", async () => {
      await orchestrator.clearDatabase();
      await orchestrator.runPendingMigrations();

      const createdUser = await orchestrator.createUser();

      await orchestrator.activateUser(createdUser.id);

      const createdDeck = await orchestrator.createDeck(
        "Nome do Baralho",
        createdUser.id,
      );

      const response = await fetch(
        `http://localhost:3000/api/v1/library/decks/${createdDeck.id}/card/cf5a330c-5fdf-4a06-9cff-5ebdf85be465`,
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "O cartão não foi encontrado.",
        action: "Verifique se o cartão procurado foi publicado.",
        status_code: 404,
      });
    });

    test("With deck created and card not published", async () => {
      await orchestrator.clearDatabase();
      await orchestrator.runPendingMigrations();

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

      const response = await fetch(
        `http://localhost:3000/api/v1/library/decks/${createdDeck.id}/card/${createdCard.id}`,
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "O cartão não foi encontrado.",
        action: "Verifique se o cartão procurado foi publicado.",
        status_code: 404,
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

      await orchestrator.updateCard(createdCard.id, createdUser.id, {
        public: true,
      });

      const response = await fetch(
        `http://localhost:3000/api/v1/library/decks/${createdDeck.id}/card/${createdCard.id}`,
        {
          headers: {
            Cookie: `session_id=${newSession.token}`,
          },
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        name: "Nome do Cartão",
        username: createdUser.username,
        description: "Descrição do Cartão",
        deck_id: responseBody.deck_id,
        deck_name: "Nome do Baralho",
        published_at: responseBody.published_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(uuidVersion(responseBody.deck_id)).toBe(4);
      expect(Date.parse(responseBody.published_at)).not.toBeNaN();
    });

    test("With deck not created", async () => {
      await orchestrator.clearDatabase();
      await orchestrator.runPendingMigrations();

      const createdUser = await orchestrator.createUser();

      await orchestrator.activateUser(createdUser.id);

      const newSession = await orchestrator.createSession(createdUser.id);

      const response = await fetch(
        `http://localhost:3000/api/v1/library/decks/cf5a330c-5fdf-4a06-9cff-5ebdf85be465/card/cf5a330c-5fdf-4a06-9cff-5ebdf85be465`,
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
        message: "O cartão não foi encontrado.",
        action: "Verifique se o cartão procurado foi publicado.",
        status_code: 404,
      });
    });

    test("With deck created and card not created", async () => {
      await orchestrator.clearDatabase();
      await orchestrator.runPendingMigrations();

      const createdUser = await orchestrator.createUser();

      await orchestrator.activateUser(createdUser.id);

      const createdDeck = await orchestrator.createDeck(
        "Nome do Baralho",
        createdUser.id,
      );

      const newSession = await orchestrator.createSession(createdUser.id);

      const response = await fetch(
        `http://localhost:3000/api/v1/library/decks/${createdDeck.id}/card/cf5a330c-5fdf-4a06-9cff-5ebdf85be465`,
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
        message: "O cartão não foi encontrado.",
        action: "Verifique se o cartão procurado foi publicado.",
        status_code: 404,
      });
    });

    test("With deck created and card not published", async () => {
      await orchestrator.clearDatabase();
      await orchestrator.runPendingMigrations();

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

      const newSession = await orchestrator.createSession(createdUser.id);

      const response = await fetch(
        `http://localhost:3000/api/v1/library/decks/${createdDeck.id}/card/${createdCard.id}`,
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
        message: "O cartão não foi encontrado.",
        action: "Verifique se o cartão procurado foi publicado.",
        status_code: 404,
      });
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

      const createdCard = await orchestrator.createCard(
        "Nome do Cartão",
        "Descrição do Cartão",
        createdDeck.id,
      );

      const createdUser2 = await orchestrator.createUser();

      await orchestrator.activateUser(createdUser2.id);

      const newSessionUser2 = await orchestrator.createSession(createdUser2.id);

      const response = await fetch(
        `http://localhost:3000/api/v1/library/decks/${createdDeck.id}/card/${createdCard.id}`,
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
        message: "O cartão não foi encontrado.",
        action: "Verifique se o cartão procurado foi publicado.",
        status_code: 404,
      });
    });
  });
});
