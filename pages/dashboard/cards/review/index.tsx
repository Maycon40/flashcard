"use client";

import useSWR from "swr";
import { useState } from "react";
import Link from "next/link";

import LayoutDashboard from "@/components/layout/Dashboard";
import { Card } from "@/types/types";
import { fetcher } from "@/infra/fetcher";
import { useRouter } from "next/router";

export default function ReviewPage() {
  const { query } = useRouter();

  const { data: cards, isLoading } = useSWR<Card[]>(
    `/api/v1/cards/review?important=${query?.important || "false"}`,
    fetcher,
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReview = async (difficulty: string) => {
    if (!cards || isSubmitting) return;

    const card = cards[currentIndex];
    if (!card.deck_name || !card.name) {
      setIsFlipped(false);
      setCurrentIndex(currentIndex + 1);
      return;
    }

    setIsSubmitting(true);

    try {
      await fetch(`/api/v1/cards/id/${card.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ difficulty }),
      });
    } finally {
      setIsSubmitting(false);
      setIsFlipped(false);
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (isLoading || !query) {
    return (
      <LayoutDashboard>
        <h1 className="text-2xl font-semibold mb-2">Revisão</h1>
        <p className="text-sm text-zinc-500 mb-6">Revisando cartão</p>

        <div className="animate-pulse">
          <div className="h-24 rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </LayoutDashboard>
    );
  }

  if (!cards || cards.length === 0 || currentIndex >= cards.length) {
    return (
      <LayoutDashboard>
        <div className="text-center p-8">
          <h1 className="text-2xl font-semibold mb-4">Revisão Concluída!</h1>
          <p className="text-zinc-500 mb-6">
            {cards && cards.length > 0
              ? "Parabéns! Você revisou todos os seus cartões."
              : "Você não tem cartões para revisar no momento."}
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700"
          >
            Voltar para o Painel
          </Link>
        </div>
      </LayoutDashboard>
    );
  }

  const currentCard = cards[currentIndex];

  return (
    <LayoutDashboard>
      <h1 className="text-2xl font-semibold mb-2">Revisão</h1>
      <p className="text-sm text-zinc-500 mb-6">
        Revisando cartão {currentIndex + 1} de {cards.length} do baralho{" "}
        <strong>{currentCard.deck_name}</strong>
      </p>

      <div className="rounded-2xl bg-white dark:bg-zinc-900 p-8 shadow-lg min-h-80 flex flex-col justify-center items-center text-center">
        {!isFlipped ? (
          <div className="flex flex-col items-center gap-8">
            <h2 className="text-3xl font-bold">{currentCard.name}</h2>
            <button
              onClick={() => setIsFlipped(true)}
              className="inline-flex items-center px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Virar cartão
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 w-full">
            <h2 className="text-2xl font-semibold">{currentCard.name}</h2>
            <div className="w-full border-t border-zinc-200 dark:border-zinc-700 my-2"></div>
            <p className="text-xl text-justify text-zinc-600 dark:text-zinc-300 whitespace-pre-line">
              {currentCard.description}
            </p>

            <div className="mt-6 w-full">
              <p className="text-sm text-zinc-500 mb-4">Como você se saiu?</p>
              <div className="flex justify-center flex-wrap gap-4">
                <button
                  onClick={() => handleReview("wrong")}
                  disabled={isSubmitting}
                  className="px-5 py-3 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed"
                >
                  Errei
                </button>
                <button
                  onClick={() => handleReview("easy")}
                  disabled={isSubmitting}
                  className="px-5 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                  Fácil
                </button>
                <button
                  onClick={() => handleReview("very easy")}
                  disabled={isSubmitting}
                  className="px-5 py-3 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed"
                >
                  Muito fácil
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </LayoutDashboard>
  );
}
