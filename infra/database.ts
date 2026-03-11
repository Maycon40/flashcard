import { Client, QueryConfig, ClientConfig } from "pg";

import { ServiceError } from "@/infra/errors";

async function query(queryObject: QueryConfig | string) {
  let client;

  try {
    client = await getNewClient();
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    console.log("\n Erro dentro do catch do database.js:");
    console.error(error);
    const serviceErrorObject = new ServiceError({
      message: "Erro na conexão com o Banco ou na Query.",
      cause: error as Error,
    });
    throw serviceErrorObject;
  } finally {
    await client?.end();
  }
}

async function getNewClient() {
  const config: ClientConfig = {
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getValueSSL(),
  };

  const client = new Client(config);

  await client.connect();

  return client;
}

const database = {
  getNewClient,
  query,
};

export default database;

function getValueSSL() {
  if (process.env.POSTGRES_CA) {
    return {
      ca: process.env.POSTGRES_CA,
    };
  }

  return process.env.NODE_ENV == "production" ? true : false;
}
