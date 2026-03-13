import database from "@/infra/database";
import { NotFoundError } from "@/infra/errors";
import { Card, Deck } from "@/types/types";
import deck from "@/models/deck";

async function create(card: Card, deckId: string): Promise<Card> {
  const newCard = await runInsertQuery(card, deckId);

  return newCard;

  async function runInsertQuery(card: Card, deckId: string) {
    const { name, description } = card;

    const results = await database.query({
      text: `
        INSERT INTO
          cards (name, description, deck_id)
        VALUES
          ($1, $2, $3)
        RETURNING
          *
      ;`,
      values: [name, description, deckId],
    });

    return results.rows[0];
  }
}

async function findAll(decks: Deck[]): Promise<Card[]> {
  const deckIds: Deck["id"][] = [];

  for (const deck of decks) {
    deckIds.push(deck.id);
  }

  const cards = await runSelectQuery(deckIds);

  return cards;

  async function runSelectQuery(deckIds: Deck["id"][]) {
    const results = await database.query({
      text: `
        SELECT
          cards.*,
          decks.name as deck_name
        FROM
          cards
        JOIN decks ON cards.deck_id = decks.id
        WHERE
          deck_id = ANY($1)
        ;`,
      values: [deckIds],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "Nenhum cartão foi encontrado no sistema.",
        action: "Verifique se o usuário já criou algum cartão.",
      });
    }

    return results.rows;
  }
}

async function findAllToReview(decks: Deck[]) {
  const cards = await findAll(decks);

  const cardsToReview: Card[] = [];

  for (const card of cards) {
    if (
      card.date_to_review &&
      new Date(card.date_to_review) <= new Date(Date.now())
    ) {
      cardsToReview.push(card);
    }
  }

  if (cardsToReview.length === 0) {
    throw new NotFoundError({
      message: "Nenhum cartão para revisar foi encontrado no sistema.",
      action: "Espere até que existam novos cartões para revisar.",
    });
  }

  return cardsToReview;
}

async function findAllByDeckId(deckId: string): Promise<Card[]> {
  const cardsFound: Card[] = await runSelectQuery(deckId);

  return cardsFound;

  async function runSelectQuery(deckId: string) {
    const results = await database.query({
      text: `
        SELECT
          *
        FROM
          cards
        WHERE
          deck_id = $1
        ;`,
      values: [deckId],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "Nenhum cartão foi encontrado no sistema.",
        action: "Verifique se o usuário já criou algum cartão.",
      });
    }

    return results.rows;
  }
}

async function findOneByDeckIdAndName(deckId: string, cardName: string) {
  const cardFound = await runSelectQuery(deckId, cardName);

  return cardFound;

  async function runSelectQuery(deckId: string, cardName: string) {
    const results = await database.query({
      text: `
        SELECT
          *
        FROM
          cards
        WHERE
          deck_id = $1 AND
          name = $2
        ;`,
      values: [deckId, cardName],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "Nenhum cartão foi encontrado no sistema.",
        action: "Verifique se o usuário já criou algum cartão.",
      });
    }

    return results.rows[0];
  }
}

async function updateByDeckIdAndName(
  cardValues: Card,
  cardNewValues: Card & { difficulty: string },
  userId: string,
) {
  let newDateToReview: Date | undefined;
  let deckId: string | undefined;

  if (cardNewValues.difficulty) {
    newDateToReview = getNewDateToReview(cardNewValues.difficulty);
  }

  if (cardNewValues.deck_name) {
    const { id } = await deck.findOneByUserIdAndName(
      userId,
      cardNewValues.deck_name,
    );
    deckId = id;
  }

  const cardWithNewValues = {
    ...cardValues,
    name: cardNewValues.name || cardValues.name,
    description: cardNewValues.description || cardValues.description,
    date_to_review: newDateToReview || cardValues.date_to_review,
    deck_id: deckId || cardValues.deck_id,
  };

  const updatedUser = await runUpdateQuery(cardWithNewValues);

  return updatedUser;

  async function runUpdateQuery(cardValues: Card) {
    const result = await database.query({
      text: `
        UPDATE
          cards
        SET
          name = $2,
          description = $3,
          date_to_review = $4,
          deck_id = $5,
          updated_at = timezone('utc', now())
        WHERE
          id = $1
        RETURNING
          *
        ;
      `,
      values: [
        cardValues.id,
        cardValues.name,
        cardValues.description,
        cardValues.date_to_review,
        cardValues.deck_id,
      ],
    });

    return result.rows[0];
  }

  function getNewDateToReview(difficulty: string) {
    const day = 1000 * 60 * 60 * 24;

    if (difficulty == "wrong") {
      return new Date(Date.now() + day);
    } else if (difficulty == "easy") {
      return new Date(Date.now() + day * 2);
    } else if (difficulty == "very easy") {
      return new Date(Date.now() + day * 5);
    }
  }
}

async function deleteById(cardId: string) {
  const deletedUser = await runUpdateQuery(cardId);

  return deletedUser;

  async function runUpdateQuery(cardId: string) {
    const result = await database.query({
      text: `
        DELETE FROM
          cards
        WHERE
          id = $1
        RETURNING
          *
        ;
      `,
      values: [cardId],
    });

    return result.rows[0];
  }
}

const card = {
  create,
  findAll,
  findAllToReview,
  findAllByDeckId,
  findOneByDeckIdAndName,
  updateByDeckIdAndName,
  deleteById,
};

export default card;
