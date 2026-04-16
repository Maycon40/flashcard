import database from "@/infra/database";
import { NotFoundError } from "@/infra/errors";

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
        message: "Nenhum cartão foi publicado.",
        action: "Verifique se algum usuário publicou algum cartão.",
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
        action: "Verifique se algum usuário publicou algum baralho.",
      });
    }

    return results.rows;
  }
}

const library = {
  findManyByDeckId,
  findAllDecks,
};

export default library;
