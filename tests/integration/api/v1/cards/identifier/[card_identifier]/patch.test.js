import { version as uuidVersion } from "uuid";

import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("PATCH /api/v1/cards/identifier/[card_identifier]", () => {
  describe("Anonymous user", () => {
    test("Without permission", async () => {
      const response = await fetch(
        `http://localhost:3000/api/v1/cards/identifier/cf5a330c-5fdf-4a06-9cff-5ebdf85be465`,
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
        `http://localhost:3000/api/v1/cards/identifier/${createdCard.name}`,
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

      expect(createdCard.box).toBe("new");
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        name: "Novo nome",
        description: "Nova descrição",
        deck_id: createdDeck.id,
        box: "progress",
        important: true,
        date_to_review: responseBody.date_to_review,
        published_at: null,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.date_to_review)).not.toBeNaN();
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      expect(responseBody.updated_at > responseBody.created_at).toBe(true);
      expect(responseBody.date_to_review > responseBody.updated_at).toBe(true);

      const day = 1000 * 60 * 60 * 24;

      const dateIsSimilar = orchestrator.verifyDateIsSimilar(
        new Date(Date.now() + day * 2).setHours(0, 0, 0, 0),
        new Date(responseBody.date_to_review),
      );

      expect(dateIsSimilar).toBe(true);

      const response2 = await fetch(
        `http://localhost:3000/api/v1/cards/identifier/${responseBody.name}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${newSession.token}`,
          },
          body: JSON.stringify({
            name: "Novo nome",
            description: "Nova descrição",
            important: false,
          }),
        },
      );

      expect(response2.status).toBe(200);

      const response2Body = await response2.json();

      expect(response2Body).toEqual({
        id: response2Body.id,
        name: "Novo nome",
        description: "Nova descrição",
        deck_id: createdDeck.id,
        box: "progress",
        important: false,
        date_to_review: response2Body.date_to_review,
        published_at: null,
        created_at: response2Body.created_at,
        updated_at: response2Body.updated_at,
      });
    });

    test("With valid data, changing box", async () => {
      const createdUser = await orchestrator.createUser();

      await orchestrator.activateUser(createdUser.id);

      const newSession = await orchestrator.createSession(createdUser.id);

      const createdDeck = await orchestrator.createDeck(
        "Baralho altera box",
        createdUser.id,
      );

      const createdCard = await orchestrator.createCard(
        "Cartão altera box",
        "Descrição do Cartão",
        createdDeck.id,
      );

      const response = await fetch(
        `http://localhost:3000/api/v1/cards/identifier/${createdCard.name}`,
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

      expect(createdCard.box).toBe("new");
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody.box).toBe("progress");

      const response2 = await fetch(
        `http://localhost:3000/api/v1/cards/identifier/${responseBody.name}`,
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
            difficulty: "very easy",
          }),
        },
      );

      const response2Body = await response2.json();

      expect(response2Body.box).toBe("secure");

      const response3 = await fetch(
        `http://localhost:3000/api/v1/cards/identifier/${response2Body.name}`,
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
            difficulty: "very easy",
          }),
        },
      );

      const response3Body = await response3.json();

      expect(response3Body.box).toBe("advanced");

      const response4 = await fetch(
        `http://localhost:3000/api/v1/cards/identifier/${response3Body.name}`,
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
            difficulty: "very easy",
          }),
        },
      );

      const response4Body = await response4.json();

      expect(response4Body.box).toBe("consolidated");

      const response5 = await fetch(
        `http://localhost:3000/api/v1/cards/identifier/${response4Body.name}`,
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
            difficulty: "wrong",
          }),
        },
      );

      const response5Body = await response5.json();

      expect(response5Body.box).toBe("new");
    });

    test("With valid data and public card", async () => {
      const createdUser = await orchestrator.createUser();

      await orchestrator.activateUser(createdUser.id);

      const newSession = await orchestrator.createSession(createdUser.id);

      const createdDeck = await orchestrator.createDeck(
        "Baralho altera box",
        createdUser.id,
      );

      const createdCard = await orchestrator.createCard(
        "Cartão publico",
        "Descrição do Cartão",
        createdDeck.id,
      );

      const response = await fetch(
        `http://localhost:3000/api/v1/cards/identifier/${createdCard.name}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${newSession.token}`,
          },
          body: JSON.stringify({
            public: true,
          }),
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        name: "Cartão publico",
        description: "Descrição do Cartão",
        deck_id: createdDeck.id,
        box: "new",
        important: false,
        date_to_review: responseBody.date_to_review,
        published_at: responseBody.published_at,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(Date.parse(responseBody.published_at)).not.toBeNaN();

      const response2 = await fetch(
        `http://localhost:3000/api/v1/library/decks`,
      );

      expect(response2.status).toBe(200);

      await fetch(
        `http://localhost:3000/api/v1/cards/identifier/${createdCard.name}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${newSession.token}`,
          },
          body: JSON.stringify({
            name: "Outro nome",
          }),
        },
      );

      const response3 = await fetch(
        `http://localhost:3000/api/v1/library/decks`,
      );

      expect(response3.status).toBe(200);

      await fetch(
        `http://localhost:3000/api/v1/cards/identifier/${createdCard.name}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${newSession.token}`,
          },
          body: JSON.stringify({
            public: false,
          }),
        },
      );

      const response4 = await fetch(`http://localhost:3000/api/v1/library`);

      expect(response4.status).toBe(404);
    });

    test("With not created card", async () => {
      const createdUser = await orchestrator.createUser();

      await orchestrator.activateUser(createdUser.id);

      const newSession = await orchestrator.createSession(createdUser.id);

      const response = await fetch(
        `http://localhost:3000/api/v1/cards/identifier/cf5a330c-5fdf-4a06-9cff-5ebdf85be465`,
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
        `http://localhost:3000/api/v1/cards/identifier/${createdCard.name}`,
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
        action: "Verifique se o nome do cartão está correto.",
        status_code: 404,
      });
    });
  });
});
