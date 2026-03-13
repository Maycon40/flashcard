"use client";

import { useRouter } from "next/router";
import useSWR from "swr";

import LayoutDashboard from "@/components/LayoutDashboard";
import { withAuth } from "@/infra/auth";
import { Card, Deck } from "@/types/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export const getServerSideProps = withAuth();

export default function DeckDetailsPage() {
  const router = useRouter();
  const { deck_name } = router.query;

  const {
    data: deck,
    error: deckError,
    isLoading: deckLoading,
  } = useSWR<Deck>(deck_name ? `/api/v1/decks/${deck_name}` : null, fetcher);

  const {
    data: cards = [],
    error: cardsError,
    isLoading: cardsLoading,
  } = useSWR<Card[]>(deck_name ? `/api/v1/cards/${deck_name}` : null, fetcher);

  const isLoading = deckLoading || cardsLoading;
  const error = deckError || cardsError;

  return (
    <LayoutDashboard>
      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-8 w-1/3 rounded bg-zinc-200 dark:bg-zinc-800 mb-2" />
          <div className="h-4 w-1/2 rounded bg-zinc-200 dark:bg-zinc-800 mb-8" />
          <div className="space-y-4">
            <div className="h-24 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-24 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-24 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </div>
      ) : error ? (
        <div className="rounded-md bg-red-50 border border-red-200 p-4 text-red-700">
          Erro ao carregar os detalhes do baralho.
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold">{deck?.name}</h1>
            <p className="text-zinc-500">
              {cards.length || 0} cart{cards.length > 1 ? "ões" : "ão"} neste
              baralho.
            </p>
          </div>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Cartões</h2>
            {cards.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cards.map((card) => (
                  <div
                    key={card.id}
                    className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900 flex flex-col"
                  >
                    <h3 className="font-semibold text-lg">{card.name}</h3>
                    <p className="text-zinc-500 mt-2 grow">
                      {card.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl bg-zinc-100 dark:bg-zinc-800 p-8 text-center">
                <p className="text-zinc-600 dark:text-zinc-400">
                  Este baralho ainda não tem cartões.
                </p>
              </div>
            )}
          </section>
        </>
      )}
    </LayoutDashboard>
  );
}
