import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /sitemap.xml", () => {
  describe("Anonymous user", () => {
    test("Retrieving the endpoint", async () => {
      const response = await fetch("http://localhost:3000/sitemap.xml");

      expect(response.status).toBe(200);

      const responseContent = await response.text();

      expect(responseContent.includes("sitemap")).toBe(true);
    });
  });
});
