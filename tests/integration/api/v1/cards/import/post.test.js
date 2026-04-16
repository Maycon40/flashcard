import { version as uuidVersion } from "uuid";

import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/cards/import", () => {
  describe("Anonymous user", () => {
    test("Without permission", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/cards/import",
        {
          method: "POST",
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
    test("With one valid card and created deck", async () => {
      const createdUser = await orchestrator.createUser();

      await orchestrator.activateUser(createdUser.id);

      const newSession = await orchestrator.createSession(createdUser.id);

      const createdDeck = await orchestrator.createDeck(
        "Baralho sem cartões",
        createdUser.id,
      );

      const response = await fetch(
        `http://localhost:3000/api/v1/cards/import`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${newSession.token}`,
          },
          body: JSON.stringify({
            name: "Nome do Cartão",
            description: "Descrição do Cartão",
            deck_name: createdDeck.name,
          }),
        },
      );

      expect(response.status).toBe(201);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        name: "Nome do Cartão",
        description: "Descrição do Cartão",
        box: "new",
        important: false,
        deck_id: createdDeck.id,
        date_to_review: responseBody.date_to_review,
        published_at: null,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.date_to_review)).not.toBeNaN();
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });

    test("With one valid card and not created deck", async () => {
      const createdUser = await orchestrator.createUser();

      await orchestrator.activateUser(createdUser.id);

      const newSession = await orchestrator.createSession(createdUser.id);

      const response = await fetch(
        `http://localhost:3000/api/v1/cards/import`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${newSession.token}`,
          },
          body: JSON.stringify({
            name: "Nome do Cartão",
            description: "Descrição do Cartão",
            deck_name: "Baralho não criado",
          }),
        },
      );

      const responseBody = await response.json();

      expect(response.status).toBe(201);

      expect(responseBody).toEqual({
        id: responseBody.id,
        name: "Nome do Cartão",
        description: "Descrição do Cartão",
        box: "new",
        important: false,
        deck_id: responseBody.deck_id,
        date_to_review: responseBody.date_to_review,
        published_at: null,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.date_to_review)).not.toBeNaN();
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });

    test("With many valid card and created deck", async () => {
      const createdUser = await orchestrator.createUser();

      await orchestrator.activateUser(createdUser.id);

      const newSession = await orchestrator.createSession(createdUser.id);

      const createdDeck = await orchestrator.createDeck(
        "Baralho sem cartões",
        createdUser.id,
      );

      const response = await fetch(
        `http://localhost:3000/api/v1/cards/import`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${newSession.token}`,
          },
          body: JSON.stringify([
            {
              name: "Nome do Cartão 1",
              description: "Descrição do Cartão 1",
              deck_name: createdDeck.name,
            },
            {
              name: "Nome do Cartão 2",
              description: "Descrição do Cartão 2",
              deck_name: createdDeck.name,
            },
          ]),
        },
      );

      expect(response.status).toBe(201);

      const responseBody = await response.json();

      expect(responseBody).toEqual([
        {
          id: responseBody[0].id,
          name: "Nome do Cartão 1",
          description: "Descrição do Cartão 1",
          box: "new",
          important: false,
          deck_id: createdDeck.id,
          date_to_review: responseBody[0].date_to_review,
          published_at: null,
          created_at: responseBody[0].created_at,
          updated_at: responseBody[0].updated_at,
        },
        {
          id: responseBody[1].id,
          name: "Nome do Cartão 2",
          description: "Descrição do Cartão 2",
          box: "new",
          important: false,
          deck_id: createdDeck.id,
          date_to_review: responseBody[1].date_to_review,
          published_at: null,
          created_at: responseBody[1].created_at,
          updated_at: responseBody[1].updated_at,
        },
      ]);

      expect(uuidVersion(responseBody[0].id)).toBe(4);
      expect(Date.parse(responseBody[0].date_to_review)).not.toBeNaN();
      expect(Date.parse(responseBody[0].created_at)).not.toBeNaN();
      expect(Date.parse(responseBody[0].updated_at)).not.toBeNaN();

      expect(uuidVersion(responseBody[1].id)).toBe(4);
      expect(Date.parse(responseBody[1].date_to_review)).not.toBeNaN();
      expect(Date.parse(responseBody[1].created_at)).not.toBeNaN();
      expect(Date.parse(responseBody[1].updated_at)).not.toBeNaN();
    });

    test("With many valid card and not created deck", async () => {
      const createdUser = await orchestrator.createUser();

      await orchestrator.activateUser(createdUser.id);

      const newSession = await orchestrator.createSession(createdUser.id);

      const response = await fetch(
        `http://localhost:3000/api/v1/cards/import`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${newSession.token}`,
          },
          body: JSON.stringify([
            {
              name: "Nome do Cartão 1",
              description: "Descrição do Cartão 1",
              deck_name: "Baralho não criado",
            },
            {
              name: "Nome do Cartão 2",
              description: "Descrição do Cartão 2",
              deck_name: "Baralho não criado",
            },
          ]),
        },
      );

      expect(response.status).toBe(201);

      const responseBody = await response.json();

      expect(responseBody).toEqual([
        {
          id: responseBody[0].id,
          name: "Nome do Cartão 1",
          description: "Descrição do Cartão 1",
          box: "new",
          important: false,
          deck_id: responseBody[0].deck_id,
          date_to_review: responseBody[0].date_to_review,
          published_at: null,
          created_at: responseBody[0].created_at,
          updated_at: responseBody[0].updated_at,
        },
        {
          id: responseBody[1].id,
          name: "Nome do Cartão 2",
          description: "Descrição do Cartão 2",
          box: "new",
          important: false,
          deck_id: responseBody[1].deck_id,
          date_to_review: responseBody[1].date_to_review,
          published_at: null,
          created_at: responseBody[1].created_at,
          updated_at: responseBody[1].updated_at,
        },
      ]);

      expect(uuidVersion(responseBody[0].id)).toBe(4);
      expect(Date.parse(responseBody[0].date_to_review)).not.toBeNaN();
      expect(Date.parse(responseBody[0].created_at)).not.toBeNaN();
      expect(Date.parse(responseBody[0].updated_at)).not.toBeNaN();

      expect(uuidVersion(responseBody[1].id)).toBe(4);
      expect(Date.parse(responseBody[1].date_to_review)).not.toBeNaN();
      expect(Date.parse(responseBody[1].created_at)).not.toBeNaN();
      expect(Date.parse(responseBody[1].updated_at)).not.toBeNaN();

      const responseDeck = await fetch(`http://localhost:3000/api/v1/decks`, {
        headers: {
          Cookie: `session_id=${newSession.token}`,
        },
      });

      expect(responseDeck.status).toBe(200);

      const responseDeckBody = await responseDeck.json();

      expect(responseDeckBody.length).toBe(1);
    });

    test("With card already imported", async () => {
      const createdUser = await orchestrator.createUser();

      await orchestrator.activateUser(createdUser.id);

      const newSession = await orchestrator.createSession(createdUser.id);

      const createdDeck = await orchestrator.createDeck(
        "Baralho criado",
        createdUser.id,
      );

      await orchestrator.createCard(
        "Cartão criado",
        "Descrição do cartão",
        createdDeck.id,
      );

      const response = await fetch(
        `http://localhost:3000/api/v1/cards/import`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${newSession.token}`,
          },
          body: JSON.stringify({
            name: "Cartão criado",
            description: "Descrição do cartão",
            deck_name: "Baralho criado",
          }),
        },
      );

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Todos os cartões já foram importados.",
        action: "Tente importar outros cartões.",
        status_code: 400,
      });
    });

    test("Without deck name", async () => {
      const createdUser = await orchestrator.createUser();

      await orchestrator.activateUser(createdUser.id);

      const newSession = await orchestrator.createSession(createdUser.id);

      const response = await fetch(
        `http://localhost:3000/api/v1/cards/import`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${newSession.token}`,
          },
          body: JSON.stringify({
            name: "Nome do Cartão",
            description: "Descrição do Cartão",
          }),
        },
      );

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message:
          "Todos os cartões devem ter nome, descrição e nome do baralho.",
        action: "Corriga as informações enviadas.",
        status_code: 400,
      });
    });
  });
});
