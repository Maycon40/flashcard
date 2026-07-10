import retry from "async-retry";
import { faker } from "@faker-js/faker";

import database from "infra/database";
import migrator from "models/migrator";
import session from "models/session";
import user from "models/user";
import recovery from "models/recovery";
import activation from "models/activation";
import deck from "models/deck";
import card from "models/card";

const emailHttpUrl = `http://${process.env.EMAIL_HTTP_HOST}:${process.env.EMAIL_HTTP_PORT}`;

async function waitForAllServices() {
  await waitForWebServer();
  await waitForEmailServer();

  async function waitForWebServer() {
    return retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 1000,
    });

    async function fetchStatusPage() {
      const response = await fetch("http://localhost:3000/api/v1/status");

      if (!response.ok) {
        throw Error();
      }
    }
  }

  async function waitForEmailServer() {
    return retry(fetchEmailPage, {
      retries: 100,
      maxTimeout: 1000,
    });

    async function fetchEmailPage() {
      const response = await fetch(emailHttpUrl);

      if (!response.ok) {
        throw Error();
      }
    }
  }
}

async function clearDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

async function runPendingMigrations() {
  await migrator.runPendingMigrations();
}

async function createUser(userObject = {}) {
  return await user.create({
    username:
      userObject.username || faker.internet.username().replace(/[._-]/g, ""),
    email: userObject.email || faker.internet.email(),
    password: userObject.password || "senha123",
  });
}

async function createRecoveryToken(userObject) {
  return await recovery.create(userObject);
}

async function createDeck(name, userId) {
  return await deck.create(
    {
      name: name || faker.person.firstName(),
    },
    userId,
  );
}

async function createCard(name, description, deckId) {
  return await card.create(
    {
      name: name || faker.person.firstName(),
      description: description || faker.person.firstName(),
    },
    deckId,
  );
}

async function updateCard(cardId, userId, cardObject) {
  return await card.update(cardId, userId, cardObject);
}

async function createActivation(userObject) {
  const activationToken = await activation.create(userObject.id);

  return activationToken;
}

async function activateUser(userId) {
  const activationToken = await activation.create(userId);

  await activation.markTokenAsUsed(activationToken.id);

  return await user.findOneById(userId);
}

async function createSession(userId) {
  const newSession = await session.create(userId);

  return newSession;
}

async function deleteAllEmails() {
  await fetch(`${emailHttpUrl}/messages`, {
    method: "DELETE",
  });
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function hasEmailsAfterDelay(delayMs = 10) {
  await delay(delayMs);

  const response = await fetch(`${emailHttpUrl}/messages`);
  const emailList = await response.json();

  return emailList.length > 0;
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

function verifyDateIsSimilar(date1, date2) {
  return (
    (date1 - date2 < 1000 && date1 - date2 >= 0) ||
    (date2 - date1 < 1000 && date2 - date1 >= 0)
  );
}

async function addFeaturesToUser(userId, features) {
  const updatedUser = await user.addFeatures(userId, features);

  return updatedUser;
}

const orchestrator = {
  waitForAllServices,
  clearDatabase,
  runPendingMigrations,
  createUser,
  createRecoveryToken,
  createDeck,
  createCard,
  updateCard,
  createActivation,
  activateUser,
  createSession,
  deleteAllEmails,
  hasEmailsAfterDelay,
  getLastEmail,
  extractUUID,
  verifyDateIsSimilar,
  addFeaturesToUser,
};

export default orchestrator;
