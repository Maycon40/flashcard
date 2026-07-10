import orchestrator from "@/tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("Invalid Session", () => {
  describe("Anonymous user", () => {
    test("Creating new session, sending an invalid session", async () => {
      const createdUser = await orchestrator.createUser({
        email: "invalidSession@gmail.com",
        password: "invalidSession",
      });

      await orchestrator.activateUser(createdUser.id);

      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: "session_id=cf5a330c-5fdf-4a06-9cff-5ebdf85be465",
        },
        body: JSON.stringify({
          email: "invalidSession@gmail.com",
          password: "invalidSession",
        }),
      });

      expect(response.status).toBe(201);
    });

    test("Getting user data with invalid session", async () => {
      const createdUser = await orchestrator.createUser();

      await orchestrator.activateUser(createdUser.id);

      const response = await fetch("http://localhost:3000/api/v1/user", {
        headers: {
          "Content-Type": "application/json",
          Cookie: "session_id=cf5a330c-5fdf-4a06-9cff-5ebdf85be465",
        },
      });

      expect(response.status).toBe(401);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Usuário não possui sessão ativa.",
        action: "Verifique se o usuário está logado e tente novamente.",
        status_code: 401,
      });
    });

    test("Getting library data", async () => {
      const createdUser = await orchestrator.createUser();

      await orchestrator.activateUser(createdUser.id);

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
        "http://localhost:3000/api/v1/library/decks",
        {
          headers: {
            "Content-Type": "application/json",
            Cookie: "session_id=cf5a330c-5fdf-4a06-9cff-5ebdf85be465",
          },
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual([
        {
          id: createdDeck.id,
          name: createdDeck.name,
          username: createdUser.username,
        },
      ]);
    });
  });
});
