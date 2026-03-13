require("dotenv").config({ path: ".env.development" });

const emailHttpUrl = `http://${process.env.EMAIL_HTTP_HOST}:${process.env.EMAIL_HTTP_PORT}`;

async function createUser() {
  await fetch("http://localhost:3000/api/v1/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: "maycon",
      email: "mayconteste@gmail.com",
      password: "senha123",
    }),
  });
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

async function activateToken(activationTokenId) {
  await fetch(`http://localhost:3000/api/v1/activations/${activationTokenId}`, {
    method: "PATCH",
  });
}

(async () => {
  console.log("Criando usuário");

  await createUser();
  const lastEmail = await getLastEmail();
  const activationTokenId = extractUUID(lastEmail.text);

  activateToken(activationTokenId);

  console.log("\nFinalizando criação de usuário\n");
})();
