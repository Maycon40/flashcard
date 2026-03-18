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
    fetch(`${origin}/api/v1/cards/${deck_name}`, {
      headers: {
        cookie: req.headers.cookie || "",
      },
    }),
    fetch(`${origin}/api/v1/decks/${deck_name}`, {
      headers: {
        cookie: req.headers.cookie || "",
      },
    }),
  ]);

  const cards = await resCards.json();
  const deck = await resDeck.json();

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
