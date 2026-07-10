const { join } = require("node:path");
const { Client } = require("pg");
const migrationRunner = require("node-pg-migrate").runner;

require("dotenv").config({ path: ".env.development" });

const emailHttpUrl = `http://${process.env.EMAIL_HTTP_HOST}:${process.env.EMAIL_HTTP_PORT}`;

async function createUser(userObject = {}) {
  const response = await fetch("http://localhost:3000/api/v1/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: userObject.username,
      email: userObject.email,
      password: userObject.password,
    }),
  });

  return await response.json();
}

async function createSession(userObject = {}) {
  const response = await fetch("http://localhost:3000/api/v1/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: userObject.email,
      password: userObject.password,
    }),
  });

  return await response.json();
}

async function getLastEmail() {
  const emailListResponse = await fetch(`${emailHttpUrl}/messages`);

  const emailListBody = await emailListResponse.json();

  const lastEmail = emailListBody.pop();

  if (!lastEmail) {
    return null;
  }

  const emailTextResponse = await fetch(
    `${emailHttpUrl}/messages/${lastEmail.id}.plain`,
  );

  const emailTextBody = await emailTextResponse.text();

  lastEmail["text"] = emailTextBody;

  return lastEmail;
}

function extractUUID(text) {
  const match = text.match(/[a-fA-F0-9-]{36}/);

  return match ? match[0] : null;
}

async function activateLastToken() {
  const lastEmail = await getLastEmail();
  const activationTokenId = extractUUID(lastEmail.text);
  await fetch(`http://localhost:3000/api/v1/activations/${activationTokenId}`, {
    method: "PATCH",
  });
}

function getValueSSL() {
  if (process.env.POSTGRES_CA) {
    return {
      ca: process.env.POSTGRES_CA,
    };
  }

  return process.env.NODE_ENV == "production" ? true : false;
}

async function getNewClient() {
  const config = {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getValueSSL(),
  };

  const client = new Client(config);

  await client.connect();

  return client;
}

async function query(queryObject) {
  let client;

  try {
    client = await getNewClient();
    const result = await client.query(queryObject);
    return result;
  } finally {
    await client?.end();
  }
}

async function clearDatabase() {
  await query("drop schema public cascade; create schema public;");
}

async function runPendingMigrations() {
  const defaultMigrationOptions = {
    dryRun: true,
    dir: join("infra", "migrations"),
    direction: "up",
    log: () => {},
    migrationsTable: "pgmigrations",
  };

  const dbClient = await getNewClient();

  const pendingMigrations = await migrationRunner({
    ...defaultMigrationOptions,
    dbClient,
    dryRun: false,
  });

  return pendingMigrations;
}

(async () => {
  console.log("Criando dados de teste");

  await clearDatabase();
  await runPendingMigrations();

  // Default User

  const createdDefaultUser = await createUser({
    username: "test",
    email: "test@gmail.com",
    password: "senha123",
  });
  await activateLastToken();
  const defaultSession = await createSession({
    email: "test@gmail.com",
    password: "senha123",
  });

  console.log("\nFinalizando criação de dados\n");
})();
