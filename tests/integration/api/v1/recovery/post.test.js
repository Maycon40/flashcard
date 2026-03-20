import recovery from "@/models/recovery";
import orchestrator from "@/tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

beforeEach(async () => {
  await orchestrator.deleteAllEmails();
});

describe("POST /api/v1/recovery", () => {
  describe("Anonymous user", () => {
    test('With "email" valid and "user" found', async () => {
      const defaultUser = await orchestrator.createUser();

      const response = await fetch(`http://localhost:3000/api/v1/recovery`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: defaultUser.email,
        }),
      });

      expect(response.status).toBe(201);

      const responseBody = await response.json();

      const tokenInDatabase = await recovery.findOneTokenByUserId(
        defaultUser.id,
      );

      expect(responseBody).toEqual({
        used_at: null,
        expires_at: tokenInDatabase.expires_at.toISOString(),
        created_at: tokenInDatabase.created_at.toISOString(),
        updated_at: tokenInDatabase.updated_at.toISOString(),
      });

      expect(Date.parse(responseBody.expires_at)).not.toBeNaN();
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      expect(responseBody.expires_at > responseBody.created_at).toBe(true);

      const lastEmail = await orchestrator.getLastEmail();
      expect(lastEmail.recipients[0].includes(defaultUser.email)).toBe(true);
      expect(lastEmail.subject).toBe("Recuperação de Senha");
      expect(lastEmail.text).toContain(defaultUser.username);
      expect(lastEmail.text).toContain(tokenInDatabase.id);
    });

    test('With "username" valid', async () => {
      const response = await fetch(`http://localhost:3000/api/v1/recovery`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          username: "userNotFound",
        }),
      });

      const responseBody = await response.json();

      expect(response.status).toBe(403);

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message:
          "Você não possui permissão para criar um token de recuperação com username.",
        action: `Verifique se o usuário tem permissão para realizar essa ação.`,
        status_code: 403,
      });

      expect(await orchestrator.hasEmailsAfterDelay()).toBe(false);
    });

    test('With "email" valid, but user not found', async () => {
      const response = await fetch(`http://localhost:3000/api/v1/recovery`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email: "email@notfound.com",
        }),
      });

      const responseBody = await response.json();

      expect(response.status).toBe(404);

      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "O email não foi encontrado no sistema.",
        action: "Verifique se o email está digitado corretamente.",
        status_code: 404,
      });
    });

    test("With 2 pre-existing valid tokens, should skip email delivery", async () => {
      const defaultUser = await orchestrator.createUser();
      await orchestrator.createRecoveryToken(defaultUser);
      await orchestrator.createRecoveryToken(defaultUser);

      const response = await fetch(`http://localhost:3000/api/v1/recovery`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email: defaultUser.email,
        }),
      });

      expect(response.status).toBe(201);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        used_at: null,
        expires_at: responseBody.expires_at,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(Date.parse(responseBody.expires_at)).not.toBeNaN();
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      expect(responseBody.expires_at > responseBody.created_at).toBe(true);

      expect(await orchestrator.hasEmailsAfterDelay()).toBe(false);
    });

    test("With expired tokens, should create new token and send email", async () => {
      const defaultUser = await orchestrator.createUser();

      const expiredToken = await orchestrator.createRecoveryToken(defaultUser);
      await recovery.update(expiredToken.id, {
        expires_at: new Date(Date.now() - 1000 * 60 * 3),
      });

      const usedToken = await orchestrator.createRecoveryToken(defaultUser);
      await recovery.update(usedToken.id, {
        used_at: new Date(Date.now()),
        expires_at: new Date(Date.now() - 1000 * 60 * 2),
      });

      await orchestrator.createRecoveryToken(defaultUser);
      await recovery.update(usedToken.id, {
        created_at: new Date(Date.now() - 1000 * 60),
      });

      // Now user has only one valid token (previous ones were expired/used),
      // so a new token can be created.

      const response = await fetch(`http://localhost:3000/api/v1/recovery`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: defaultUser.email,
        }),
      });

      expect(response.status).toBe(201);

      const tokenInDatabase = await recovery.findOneTokenByUserId(
        defaultUser.id,
      );
      const responseBody = await response.json();

      expect(responseBody).toEqual({
        used_at: null,
        expires_at: tokenInDatabase.expires_at.toISOString(),
        created_at: tokenInDatabase.created_at.toISOString(),
        updated_at: tokenInDatabase.updated_at.toISOString(),
      });

      expect(Date.parse(responseBody.expires_at)).not.toBeNaN();
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      expect(responseBody.expires_at > responseBody.created_at).toBe(true);

      const lastEmail = await orchestrator.getLastEmail();
      expect(lastEmail.recipients[0].includes(defaultUser.email)).toBe(true);
      expect(lastEmail.subject).toBe("Recuperação de Senha");
      expect(lastEmail.text).toContain(defaultUser.username);
      expect(lastEmail.text).toContain(tokenInDatabase.id);
    });

    test('With key other than "username" or "email"', async () => {
      const response = await fetch(`http://localhost:3000/api/v1/recovery`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          password: "validpassword",
        }),
      });

      const responseBody = await response.json();

      expect(response.status).toBe(400);

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Objeto enviado deve ter no mínimo uma chave.",
        action: "Ajuste os dados enviados e tente novamente.",
        status_code: 400,
      });
    });

    test("With blank Body", async () => {
      const response = await fetch(`http://localhost:3000/api/v1/recovery`, {
        method: "POST",
      });

      const responseBody = await response.json();

      expect(response.status).toBe(400);

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Objeto enviado deve ter no mínimo uma chave.",
        action: "Ajuste os dados enviados e tente novamente.",
        status_code: 400,
      });
    });

    test("With blank Object", async () => {
      const response = await fetch(`http://localhost:3000/api/v1/recovery`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({}),
      });

      const responseBody = await response.json();

      expect(response.status).toBe(400);

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Objeto enviado deve ter no mínimo uma chave.",
        action: "Ajuste os dados enviados e tente novamente.",
        status_code: 400,
      });
    });
  });

  describe('User with "create:recovery_token:username" feature', () => {
    let sessionObject;

    beforeAll(async () => {
      const userWithPermission = await orchestrator.createUser();
      await orchestrator.activateUser(userWithPermission.id);
      await orchestrator.addFeaturesToUser(userWithPermission.id, [
        "create:recovery_token:username",
      ]);
      sessionObject = await orchestrator.createSession(userWithPermission.id);
    });

    test('With "username" valid and "user" found', async () => {
      const defaultUser = await orchestrator.createUser();

      const response = await fetch(`http://localhost:3000/api/v1/recovery`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          cookie: `session_id=${sessionObject.token}`,
        },

        body: JSON.stringify({
          username: defaultUser.username,
        }),
      });

      const responseBody = await response.json();

      const tokenInDatabase = await recovery.findOneTokenByUserId(
        defaultUser.id,
      );

      expect(response.status).toBe(201);

      expect(responseBody).toEqual({
        used_at: null,
        expires_at: tokenInDatabase.expires_at.toISOString(),
        created_at: tokenInDatabase.created_at.toISOString(),
        updated_at: tokenInDatabase.updated_at.toISOString(),
      });

      expect(Date.parse(responseBody.expires_at)).not.toBeNaN();
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      expect(responseBody.expires_at > responseBody.created_at).toBe(true);

      const lastEmail = await orchestrator.getLastEmail();
      expect(lastEmail.recipients[0].includes(defaultUser.email)).toBe(true);
      expect(lastEmail.subject).toBe("Recuperação de Senha");
      expect(lastEmail.text).toContain(defaultUser.username);
      expect(lastEmail.text).toContain(tokenInDatabase.id);
    });

    test('With "username" valid, but user not found', async () => {
      const response = await fetch(`http://localhost:3000/api/v1/recovery`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          cookie: `session_id=${sessionObject.token}`,
        },
        body: JSON.stringify({
          username: "userNotFound",
        }),
      });
      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "O nome de usuário não foi encontrado no sistema.",
        action: "Verifique se o nome de usuário está digitado corretamente.",
        status_code: 404,
      });

      expect(await orchestrator.hasEmailsAfterDelay()).toBe(false);
    });
  });
});
