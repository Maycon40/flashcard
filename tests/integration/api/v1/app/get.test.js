import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/app", () => {
  describe("Anonymous user", () => {
    test("Retrieving the endpoint", async () => {
      const response = await fetch("http://localhost:3000/api/v1/app");

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        minVersionRequired: "1.1.1",
        latestVersion: "1.1.2",
        updateUrl:
          "https://play.google.com/store/apps/details?id=com.maycon.myflashcard",
        updated_at: responseBody.updated_at,
      });

      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });
  });

  describe("Default user", () => {
    test("With valid session", async () => {
      const createdUser = await orchestrator.createUser({
        username: "UserAppTest",
      });

      await orchestrator.activateUser(createdUser.id);

      const validSession = await orchestrator.createSession(createdUser.id);

      const response = await fetch("http://localhost:3000/api/v1/app", {
        headers: {
          Cookie: `session_id=${validSession.token}`,
        },
      });

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        minVersionRequired: "1.1.1",
        latestVersion: "1.1.2",
        updateUrl:
          "https://play.google.com/store/apps/details?id=com.maycon.myflashcard",
        updated_at: responseBody.updated_at,
      });

      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });
  });
});
