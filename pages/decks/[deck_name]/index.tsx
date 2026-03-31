"use client";

import Cards from "@/components/cards";
import LayoutDashboard from "@/components/layout/Dashboard";
import { withAuth } from "@/infra/auth";
import { Card, Deck } from "@/types/types";

export const getServerSideProps = withAuth(async (context) => {
  const { req, query } = context;
  const { deck_name } = query;

  const proto = (req.headers["x-forwarded-proto"] as string) || "http";
  const host = req.headers["host"];
  const origin = `${proto}://${host}`;

  const [resCards, resDeck] = await Promise.all([
    fetch(`${origin}/api/v1/cards/${encodeURIComponent(deck_name as string)}`, {
      headers: {
        cookie: req.headers.cookie || "",
      },
    }),
    fetch(`${origin}/api/v1/decks/${encodeURIComponent(deck_name as string)}`, {
      headers: {
        cookie: req.headers.cookie || "",
      },
    }),
  ]);

  console.log("resCards", resCards);
  console.log("resDeck", resDeck);

  const cards = await resCards.json();
  const deck = await resDeck.json();

  console.log("cards", cards);
  console.log("deck", deck);

  return {
    props: {
      cards,
      deck,
    },
  };
});

export default function DeckDetailsPage({
  cards,
  deck,
}: {
  cards: Card[];
  deck: Deck;
}) {
  return (
    <LayoutDashboard>
      <>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{deck?.name}</h1>
          <p className="text-zinc-500">
            {cards.length || 0} cart{cards.length > 1 ? "ões" : "ão"} neste
            baralho.
          </p>
        </div>

        <Cards cards={cards} />
      </>
    </LayoutDashboard>
  );
}
