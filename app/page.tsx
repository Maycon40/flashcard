"use client";

import { useState } from "react";
import useSWR from "swr";

type Flashcard = {
  id: number;
  front: string;
  back: string;
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function Home() {
  const {
    data: cards = [],
    error,
    isLoading,
  } = useSWR<Flashcard[]>("/flashcards.json", fetcher);
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const current = cards && cards.length > 0 ? cards[index] : undefined;

  function nextCard() {
    setIsFlipped(false);
    setIndex((i) => (cards.length === 0 ? 0 : (i + 1) % cards.length));
  }

  function handleEvaluation() {
    // Sem lógica de scheduling por enquanto — apenas avança para o próximo cartão
    nextCard();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black p-8">
      <main className="w-full max-w-3xl">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Flashcards
          </h1>

          <div className="flex items-center gap-4">
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              {cards.length > 0 ? `${index + 1} / ${cards.length}` : "—"}
            </div>
          </div>
        </header>

        <section className="flex flex-col items-center gap-6">
          {isLoading ? (
            <div className="w-full">
              <div className="relative mx-auto w-full max-w-3xl rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 dark:bg-zinc-900">
                <div className="flex flex-col gap-4">
                  <div className="h-4 w-24 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />

                  <div className="max-h-[60vh] overflow-hidden rounded-md bg-zinc-100 p-4 text-lg font-medium text-zinc-900 dark:bg-zinc-800">
                    <div className="h-22 w-full rounded bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-10 w-36 rounded-full bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
                    <div className="ml-auto h-4 w-48 rounded bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="rounded-2xl bg-white p-6 text-center shadow-sm dark:bg-zinc-900">
              <p className="text-red-600">Erro ao carregar flashcards.</p>
            </div>
          ) : current ? (
            <div className="w-full">
              <div className="relative mx-auto w-full max-w-3xl rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 dark:bg-zinc-900">
                <div className="flex flex-col gap-4">
                  <div className="text-zinc-400 text-sm">Cartão</div>

                  <div className="max-h-[60vh] overflow-auto rounded-md bg-transparent p-4 text-lg font-medium text-zinc-900 dark:text-zinc-50">
                    {!isFlipped ? (
                      <div className="whitespace-pre-wrap">{current.front}</div>
                    ) : (
                      <div className="whitespace-pre-wrap">{current.back}</div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsFlipped((f) => !f)}
                      className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-800 shadow-sm hover:bg-zinc-200 cursor-pointer"
                    >
                      {isFlipped ? "Mostrar frente" : "Virar cartão"}
                    </button>

                    <div className="ml-auto text-sm text-zinc-500">
                      Clique no botão de avaliação para avançar
                    </div>
                  </div>
                </div>
              </div>

              {/* Evaluation controls: aparecem quando o cartão está virado */}
              {isFlipped && (
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <button
                    onClick={handleEvaluation}
                    className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700 transition-colors hover:bg-red-100 cursor-pointer"
                  >
                    Errou
                  </button>
                  <button
                    onClick={handleEvaluation}
                    className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-yellow-700 transition-colors hover:bg-yellow-100 cursor-pointer"
                  >
                    Fácil
                  </button>
                  <button
                    onClick={handleEvaluation}
                    className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700 transition-colors hover:bg-green-100 cursor-pointer"
                  >
                    Muito fácil
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl bg-white p-8 text-center shadow-lg dark:bg-zinc-900">
              <p className="text-zinc-600 dark:text-zinc-400">
                Nenhum flashcard encontrado.
              </p>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-500">
                Adicione flashcards em <code>/public/flashcards.json</code>
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
