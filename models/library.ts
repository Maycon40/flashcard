import database from "@/infra/database";
import { NotFoundError } from "@/infra/errors";

async function findOneById(deckId: string, cardId: string) {
  const card = await runSelectQuery(deckId, cardId);

  return card;

  async function runSelectQuery(deckId: string, cardId: string) {
    const results = await database.query({
      text: `
        SELECT
          cards.*,
          decks.name as deck_name,
          decks.id as deck_id,
          decks.user_id as user_id,
          users.username as username
        FROM
          cards
        JOIN
          decks ON cards.deck_id = decks.id
        JOIN
          users ON users.id = decks.user_id
        WHERE
          cards.published_at IS NOT NULL AND
          decks.id = $1 AND
          cards.id = $2
      ;`,
      values: [deckId, cardId],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "O cartão não foi encontrado.",
        action: "Verifique se o cartão procurado foi publicado.",
      });
    }

    return results.rows[0];
  }
}

async function findManyByDeckId(deckId: string) {
  const cards = await runSelectQuery(deckId);

  return cards;

  async function runSelectQuery(deckId: string) {
    const results = await database.query({
      text: `
        SELECT
          cards.*,
          decks.name as deck_name,
          decks.id as deck_id,
          decks.user_id as user_id,
          users.username as username
        FROM
          cards
        JOIN
          decks ON cards.deck_id = decks.id
        JOIN
          users ON users.id = decks.user_id
        WHERE
          cards.published_at IS NOT NULL AND
          decks.id = $1
        ORDER BY
          LOWER(cards.name)
      ;`,
      values: [deckId],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "O baralho não foi encontrado.",
        action: "Verifique se o baralho procurado foi publicado.",
      });
    }

    return results.rows;
  }
}

async function findAllDecks() {
  const cards = await runSelectQuery();

  return cards;

  async function runSelectQuery() {
    const results = await database.query({
      text: `
        SELECT
          decks.id as id,
          decks.name as name,
          users.username as username
        FROM
          cards
        JOIN
          decks ON cards.deck_id = decks.id
        JOIN
          users ON users.id = decks.user_id
        WHERE
          cards.published_at IS NOT NULL
        GROUP BY
          decks.id,
          decks.name, 
          users.username
        ORDER BY
          LOWER(decks.name)
      ;`,
      values: [],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "Nenhum baralho foi publicado.",
        action: "Publique o primeiro baralho da Biblioteca.",
      });
    }

    return results.rows;
  }
}

const library = {
  findOneById,
  findManyByDeckId,
  findAllDecks,
};

export default library;
