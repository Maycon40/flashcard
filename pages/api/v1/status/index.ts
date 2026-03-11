import { createRouter } from "next-connect";
import database from "@/infra/database";
import controller from "@/infra/controller";
import authorization from "@/models/authorization";
import type { NextApiRequest, NextApiResponse } from "next";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.use(controller.injectAnonymousOrUser);

router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request: NextApiRequest, response: NextApiResponse) {
  const userTryingToGet = request.context?.user;

  const updatedAt = new Date().toISOString();

  const databaseName = process.env.POSTGRES_DB;

  const maxConnectionsResult = await database.query(`SHOW max_connections;`);
  const usedConnectionsResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  const versionResult = await database.query("SHOW server_version;");

  const { server_version: version } = versionResult.rows[0];

  const { max_connections: maxConnections } = maxConnectionsResult.rows[0];

  const { count: usedConnections } = usedConnectionsResult.rows[0];

  const statusObject = {
    updated_at: updatedAt,
    dependencies: {
      database: {
        version,
        max_connections: Number(maxConnections),
        used_connections: usedConnections,
      },
    },
  };

  const secureOutputValues = authorization.filterOutput(
    userTryingToGet,
    "read:status",
    statusObject,
  );

  response.status(200).json(secureOutputValues);
}
