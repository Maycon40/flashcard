import database from "@/infra/database";
import { NotFoundError, ValidationError } from "@/infra/errors";
import { Card, Deck } from "@/types/types";
import deck from "@/models/deck";

async function create(card: Card, deckId: string): Promise<Card> {
  await validateUniqueCardNameAndDescription(
    String(card.name),
    String(card.description),
    deckId,
  );

  const newCard = await runInsertQuery(card, deckId);

  return newCard;

  async function runInsertQuery(card: Card, deckId: string) {
    const { name, description, important } = card;

    const results = await database.query({
      text: `
        INSERT INTO
          cards (name, description, important, deck_id)
        VALUES
          ($1, $2, $3, $4)
        RETURNING
          *
      ;`,
      values: [name, description, Boolean(important), deckId],
    });

    return results.rows[0];
  }
}

type DeckIds = { [key: string]: string };

async function importCards(cards: Card[] | Card, userId: string) {
  cards = ensureArray(cards);

  const deckIds = await createDecks(cards, userId);

  cards = await validateUniqueCard(cards, deckIds);

  const { values, placeholders } = createQuery(cards, deckIds);

  const newCards = await runInsertQuery(values, placeholders);

  return newCards;

  async function runInsertQuery(values: string[], placeholders: string) {
    if (values.length === 0) {
      throw new ValidationError({
        message: "Todos os cartões já foram importados.",
        action: "Tente importar outros cartões.",
      });
    }

    const results = await database.query({
      text: `
        INSERT INTO
          cards (name, description, deck_id)
        VALUES
          ${placeholders}
        RETURNING
          *
      ;`,
      values,
    });

    if (results.rowCount === 1) {
      return results.rows[0];
    }

    return results.rows;
  }

  function ensureArray(array: any[] | any): any[] {
    if (!Array.isArray(array)) {
      array = [array];
    }

    return array;
  }

  function createQuery(cards: Card[], deckIds: DeckIds) {
    const values: string[] = [];

    const placeholders = cards
      .map(
        (_, i) =>
          `($${Number(i * 3 + 1)}, $${Number(i * 3 + 2)}, $${Number(i * 3 + 3)})`,
      )
      .join(", ");

    for (const card of cards) {
      const deckId = deckIds[String(card.deck_name).toLowerCase()];

      values.push(String(card.name));
      values.push(String(card.description));
      values.push(deckId);
    }

    return { values, placeholders };
  }

  async function validateUniqueCard(cards: Card[], deckIds: DeckIds) {
    const validatedCards = [];

    for (const card of cards) {
      const deckId = deckIds[String(card.deck_name).toLowerCase()];

      try {
        await validateUniqueCardNameAndDescription(
          String(card.name),
          String(card.description),
          deckId,
        );

        validatedCards.push(card);
      } catch (error) {
        if (error instanceof ValidationError) {
          continue;
        } else {
          throw error;
        }
      }
    }

    return validatedCards;
  }

  async function createDecks(cards: Card[], userId: string) {
    const deckIds: DeckIds = {};

    const decks: Deck[] = await deck.findAllByUserId(userId).catch(() => []);

    getDeckIds(deckIds, decks);

    const decksToCreate = getDecksToCreate(cards, deckIds);

    let createdDecks = [];

    if (decksToCreate.length >= 1) {
      createdDecks = await deck.create(decksToCreate, userId);
    }

    getDeckIds(deckIds, createdDecks);

    return deckIds;
  }

  function getDecksToCreate(cards: Card[], deckIds: DeckIds) {
    const decksToCreate: Deck[] = [];
    const deckNames: string[] = [];

    for (const card of cards) {
      if (!card.name || !card.description || !card.deck_name) {
        throw new ValidationError({
          message:
            "Todos os cartões devem ter nome, descrição e nome do baralho.",
          action: "Corriga as informações enviadas.",
        });
      }

      if (
        !deckIds[card.deck_name.toLowerCase()] &&
        !deckNames.includes(card.deck_name.toLowerCase())
      ) {
        decksToCreate.push({ name: card.deck_name });
        deckNames.push(card.deck_name.toLowerCase());
      }
    }

    return decksToCreate;
  }

  function getDeckIds(deckIds: DeckIds, decks: Deck[] | Deck) {
    decks = ensureArray(decks);

    for (const item of decks) {
      deckIds[String(item.name).toLowerCase()] = String(item.id);
    }
  }
}

async function validateUniqueCardNameAndDescription(
  cardName: string,
  description: string,
  deckId: string,
) {
  await runSelectQuery(cardName, description, deckId);

  async function runSelectQuery(
    cardName: string,
    description: string,
    deckId: string,
  ) {
    const results = await database.query({
      text: `
        SELECT
          name,
          description
        FROM
          cards
        WHERE
          LOWER(name) = LOWER($1) AND
          LOWER(description) = LOWER($2) AND
          deck_id = $3
      ;`,
      values: [cardName, description, deckId],
    });

    if (results.rowCount && results.rowCount > 0) {
      throw new ValidationError({
        message: "O mesmo nome e descrição foi utilizado em outro cartão.",
        action: "Utilize outro nome ou descrição.",
      });
    }
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
        ORDER BY
          cards.important DESC,
          LOWER(cards.name) ASC
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

async function findAllToReview(decks: Deck[], important: boolean | null) {
  const cards = await findAll(decks);
  const cardIds: Card["id"][] = [];

  for (const card of cards) {
    cardIds.push(card.id);
  }

  const cardsToReview = await runSelectQuery(cardIds, important);

  return cardsToReview;

  async function runSelectQuery(
    cardIds: Card["id"][],
    important: boolean | null,
  ) {
    const results = await database.query({
      text: `
        SELECT
          cards.*,
          decks.name as deck_name
        FROM
          cards
        JOIN decks ON cards.deck_id = decks.id
        WHERE
          cards.id = ANY($1) AND
          cards.date_to_review <= CURRENT_DATE AND
          ($2::boolean IS NULL OR cards.important = $2)
        ORDER BY
          cards.date_to_review ASC
        ;`,
      values: [cardIds, important],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "Nenhum cartão para revisar foi encontrado no sistema.",
        action: "Espere até que existam novos cartões para revisar.",
      });
    }

    return results.rows;
  }
}

async function findAllByDeckId(deckId: string): Promise<Card[]> {
  const cardsFound: Card[] = await runSelectQuery(deckId);

  return cardsFound;

  async function runSelectQuery(deckId: string) {
    const results = await database.query({
      text: `
        SELECT
          cards.*,
          decks.name as deck_name
        FROM
          cards
        JOIN decks ON cards.deck_id = decks.id
        WHERE
          cards.deck_id = $1
        ORDER BY
          cards.important DESC,
          LOWER(cards.name) ASC
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

async function findOneById(cardId: string, userId: string) {
  const cardFound = await runSelectQuery(cardId, userId);

  return cardFound;

  async function runSelectQuery(cardId: string, userId: string) {
    const results = await database.query({
      text: `
        SELECT
          cards.*,
          decks.name as deck_name
        FROM
          cards
        JOIN decks ON cards.deck_id = decks.id
        WHERE
          cards.id = $1 AND
          decks.user_id = $2
        LIMIT
          1
        ;`,
      values: [cardId, userId],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "Esse cartão não foi encontrado no sistema.",
        action: "Verifique se o id do cartão está correto.",
      });
    }

    return results.rows[0];
  }
}

async function updateById(
  cardId: string,
  userId: string,
  cardNewValues: Card & { difficulty: string; public: boolean },
) {
  const cardValues: Card = await card.findOneById(cardId as string, userId);

  let deckId: string | undefined;

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
    deck_id: deckId || cardValues.deck_id,
  };

  if (cardNewValues.difficulty && cardValues.box) {
    const newBox = getNewBox(cardValues.box, cardNewValues.difficulty);
    const newDateToReview = getNewDateToReview(newBox as string);
    cardWithNewValues.box = newBox;
    cardWithNewValues.date_to_review = newDateToReview;
  }

  if (cardNewValues.important !== undefined) {
    cardWithNewValues.important = Boolean(cardNewValues.important);
  } else {
    cardWithNewValues.important = Boolean(cardValues.important);
  }

  if (cardNewValues.public) {
    cardWithNewValues.published_at = new Date();
  } else if (cardNewValues.public == false) {
    cardWithNewValues.published_at = null;
  }

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
          important = $5,
          box = $6,
          deck_id = $7,
          published_at = $8,
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
        cardValues.important,
        cardValues.box,
        cardValues.deck_id,
        cardValues.published_at,
      ],
    });

    return result.rows[0];
  }
}

function getNewBox(box: string, difficulty: string) {
  let newBox: string = box;

  if (difficulty == "wrong") {
    newBox = "new";
  } else if (difficulty == "easy") {
    if (box == "new") {
      newBox = "progress";
    } else if (box == "consolidated") {
      newBox = "advanced";
    }
  } else if (difficulty == "very easy") {
    if (box == "new") {
      newBox = "progress";
    } else if (box == "progress") {
      newBox = "secure";
    } else if (box == "secure") {
      newBox = "advanced";
    } else if (box == "advanced") {
      newBox = "consolidated";
    }
  }

  return newBox;
}

function getNewDateToReview(newBox: string) {
  const day = 1000 * 60 * 60 * 24;
  let newDate = new Date(Date.now());

  if (newBox == "new") {
    newDate = new Date(Date.now() + day);
  } else if (newBox == "progress") {
    newDate = new Date(Date.now() + day * 2);
  } else if (newBox == "secure") {
    newDate = new Date(Date.now() + day * 5);
  } else if (newBox == "advanced") {
    newDate = new Date(Date.now() + day * 14);
  } else if (newBox == "consolidated") {
    newDate = new Date(Date.now() + day * 30);
  }

  return newDate.toISOString().split("T")[0];
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
  importCards,
  findAll,
  findAllToReview,
  findAllByDeckId,
  findOneById,
  updateById,
  deleteById,
  getNewBox,
  getNewDateToReview,
};

export default card;
