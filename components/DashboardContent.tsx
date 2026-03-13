"use client";

import useSWR from "swr";
import Link from "next/link";
import { useMemo } from "react";
import LayoutDashboard from "@/components/LayoutDashboard";
import { Card, Deck, User } from "@/types/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function DashboardContent() {
  const {
    data: decks = [],
    error: decksError,
    isLoading: decksLoading,
  } = useSWR<Deck[]>("/api/v1/decks", fetcher);

  const { data: user, isLoading: userLoading } = useSWR<User>(
    "/api/v1/user",
    fetcher,
  );

  const {
    data: cardsToReview = [],
    error: reviewError,
    isLoading: reviewLoading,
  } = useSWR<Card[]>("/api/v1/cards/review", fetcher);

  const username = useMemo(() => user?.username || "", [user]);

  return (
    <LayoutDashboard>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="flex text-2xl font-semibold">
            Olá,{" "}
            {reviewLoading ? (
              <div className="h-8 w-24 rounded-2xl bg-zinc-200 dark:bg-zinc-800"></div>
            ) : (
              username
            )}
            👋
          </h1>
          <p className="text-sm text-zinc-500">
            Aqui estão seus baralhos e revisões pendentes.
          </p>
        </div>
      </div>

      <section className="mb-8">
        {reviewLoading ? (
          <div className="animate-pulse">
            <div className="h-24 rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
          </div>
        ) : reviewError ? (
          <div className="rounded-md bg-red-50 border border-red-200 p-4 text-red-700">
            Erro ao carregar os flashcards para revisão.
          </div>
        ) : cardsToReview.length > 0 ? (
          <div className="rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-lg">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">Revisão pendente</h3>
                <p className="text-zinc-500">
                  Você tem {cardsToReview.length} flashcard
                  {cardsToReview.length > 1 ? "s" : ""} para revisar.
                </p>
              </div>
              <Link
                href="/cards/review"
                className="inline-flex items-center px-5 py-3 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 whitespace-nowrap"
              >
                Revisar agora
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-lg text-center">
            <h3 className="text-lg font-semibold">Tudo em dia! 🎉</h3>
            <p className="text-zinc-500 mt-2">
              Parabéns! Você não tem nenhum flashcard para revisar no momento.
            </p>
          </div>
        )}
      </section>

      <section className="space-y-6">
        {decksLoading || userLoading ? (
          <div className="animate-pulse">
            <div className="h-6 w-40 rounded bg-zinc-200 dark:bg-zinc-800 mb-4" />
            <div className="space-y-3">
              <div className="h-20 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-20 rounded bg-zinc-200 dark:bg-zinc-800" />
            </div>
          </div>
        ) : decksError ? (
          <div className="rounded-md bg-red-50 border border-red-200 p-4 text-red-700">
            Erro ao carregar seus baralhos.
          </div>
        ) : decks && decks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {decks.map((deck) => (
              <div
                key={deck.id || deck.name}
                className="rounded-lg border border-zinc-100 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900"
              >
                <h3 className="font-semibold">{deck.name}</h3>
                <p className="text-sm text-zinc-500">Baralho criado por você</p>
                <div className="mt-3">
                  <Link
                    href={`/decks/${encodeURIComponent(String(deck.name))}`}
                    className="text-indigo-600 hover:underline"
                  >
                    Ver baralho
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-8 text-center shadow-lg dark:bg-zinc-900">
            <p className="text-zinc-600 dark:text-zinc-400">
              Nenhum baralho encontrado.
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              Crie seu primeiro baralho clicando em Criar baralho.
            </p>
            <div className="mt-4">
              <Link
                href="/decks"
                className="inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Criar baralho
              </Link>
            </div>
          </div>
        )}
      </section>
    </LayoutDashboard>
  );
}
