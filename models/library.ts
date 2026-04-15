import database from "@/infra/database";
import { NotFoundError } from "@/infra/errors";

async function findAll() {
  const cards = await runSelectQuery();

  return cards;

  async function runSelectQuery() {
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
          cards.published_at IS NOT NULL
        ORDER BY
          LOWER(cards.name)
      ;`,
      values: [],
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

const library = {
  findAll,
};

export default library;
