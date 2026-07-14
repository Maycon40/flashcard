import { version as uuidVersion } from "uuid";
import setCookieParser from "set-cookie-parser";

import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("DELETE /api/v1/user", () => {
  describe("Anonymous user", () => {
    test("Retrieving endpoint without request body", async () => {
      const response = await fetch("http://localhost:3000/api/v1/user", {
        method: "DELETE",
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Credenciais insuficientes fornecidas para exclusão de conta.",
        action: "Informe o nome de usuário, e-mail e senha corretos.",
        status_code: 400,
      });
    });

    test("With invalid username", async () => {
      const createdUser = await orchestrator.createUser({
        username: "UniqueUser1",
        email: "unique1@delete.com",
        password: "password",
      });

      const response = await fetch("http://localhost:3000/api/v1/user", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "wrongusername",
          email: createdUser.email,
          password: "password",
        }),
      });

      expect(response.status).toBe(401);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message:
          "O nome de usuário não coincide com as credenciais informadas.",
        action: "Verifique as informações digitadas e tente novamente.",
        status_code: 401,
      });
    });

    test("With invalid email", async () => {
      const createdUser = await orchestrator.createUser({
        username: "UniqueUser2",
        email: "unique2@delete.com",
        password: "password",
      });

      const response = await fetch("http://localhost:3000/api/v1/user", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: createdUser.username,
          email: "wrong@email.com",
          password: "password",
        }),
      });

      expect(response.status).toBe(401);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Não foi possível realizar o login.",
        action:
          "Por favor, certifique-se de que o e-mail e a senha estão corretos.",
        status_code: 401,
      });
    });

    test("With invalid password", async () => {
      const createdUser = await orchestrator.createUser({
        username: "UniqueUser3",
        email: "unique3@delete.com",
        password: "password",
      });

      const response = await fetch("http://localhost:3000/api/v1/user", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: createdUser.username,
          email: createdUser.email,
          password: "wrongpassword",
        }),
      });

      expect(response.status).toBe(401);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Não foi possível realizar o login.",
        action:
          "Por favor, certifique-se de que o e-mail e a senha estão corretos.",
        status_code: 401,
      });
    });

    test("With valid credentials", async () => {
      const createdUser = await orchestrator.createUser({
        username: "AnonymousToDelete",
        email: "anonymous@delete.com",
        password: "password",
      });

      const activatedUser = await orchestrator.activateUser(createdUser.id);

      const response = await fetch("http://localhost:3000/api/v1/user", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: createdUser.username,
          email: createdUser.email,
          password: "password",
        }),
      });

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: createdUser.id,
        username: createdUser.username,
        email: createdUser.email,
        features: [
          "create:session",
          "read:session",
          "update:user",
          "delete:user",
          "create:recovery_token",
          "update:recovery_token",
          "read:card",
          "create:card",
          "update:card",
          "delete:card",
          "read:deck",
          "create:deck",
          "update:deck",
          "delete:deck",
          "read:library",
          "create:library",
        ],
        created_at: createdUser.created_at.toISOString(),
        updated_at: activatedUser.updated_at.toISOString(),
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      const responseLookup = await fetch(
        `http://localhost:3000/api/v1/users/${createdUser.username}`,
      );
      expect(responseLookup.status).toBe(404);
    });
  });

  describe("Default user", () => {
    test("Without request body", async () => {
      const createdUser = await orchestrator.createUser({
        username: "SessionNoBody",
      });
      const validSession = await orchestrator.createSession(createdUser.id);

      const response = await fetch("http://localhost:3000/api/v1/user", {
        method: "DELETE",
        headers: {
          Cookie: `session_id=${validSession.token}`,
        },
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Credenciais insuficientes fornecidas para exclusão de conta.",
        action: "Informe o nome de usuário, e-mail e senha corretos.",
        status_code: 400,
      });
    });

    test("With invalid credentials", async () => {
      const createdUser = await orchestrator.createUser({
        username: "SessionWrongCred",
        email: "sessionwrong@delete.com",
        password: "password",
      });
      const validSession = await orchestrator.createSession(createdUser.id);

      const response = await fetch("http://localhost:3000/api/v1/user", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session_id=${validSession.token}`,
        },
        body: JSON.stringify({
          username: createdUser.username,
          email: createdUser.email,
          password: "wrongpassword",
        }),
      });

      expect(response.status).toBe(401);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Não foi possível realizar o login.",
        action:
          "Por favor, certifique-se de que o e-mail e a senha estão corretos.",
        status_code: 401,
      });
    });

    test("With valid credentials", async () => {
      const createdUser = await orchestrator.createUser({
        username: "SessionWithCredentials",
        email: "session@withcredentials.com",
        password: "password",
      });
      const validSession = await orchestrator.createSession(createdUser.id);

      const response = await fetch("http://localhost:3000/api/v1/user", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session_id=${validSession.token}`,
        },
        body: JSON.stringify({
          username: createdUser.username,
          email: createdUser.email,
          password: "password",
        }),
      });

      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        id: createdUser.id,
        username: createdUser.username,
        email: createdUser.email,
        features: ["read:activation_token"],
        updated_at: createdUser.updated_at.toISOString(),
        created_at: createdUser.created_at.toISOString(),
      });

      const parsedSetCookie = setCookieParser(response, {
        map: true,
      });

      expect(parsedSetCookie.session_id).toEqual({
        name: "session_id",
        value: "invalid",
        maxAge: -1,
        path: "/",
        httpOnly: true,
        sameSite: "Lax",
      });
    });
  });
});
