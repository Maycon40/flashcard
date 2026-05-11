"use client";

import useSWR from "swr";
import { useMemo, useState } from "react";
import Link from "next/link";

import LayoutDashboard from "@/components/layout/Dashboard";
import { Card } from "@/types/types";
import { fetcher } from "@/infra/fetcher";
import { useRouter } from "next/router";
import CardsReviewLayout from "@/components/cards/review/layout";

export default function ReviewPage() {
  const { query } = useRouter();

  const urlCardApi =
    query?.important == undefined
      ? `/api/v1/cards/review`
      : `/api/v1/cards/review?important=${query?.important || "false"}`;

  const { data: responseCards, isLoading } = useSWR<Card[]>(
    urlCardApi,
    fetcher,
  );

  const cards: Card[] = useMemo(() => {
    if (!responseCards) return [];
    return responseCards?.filter(
      (card) => !query.subject || card.deck_id == query.subject,
    );
  }, [responseCards, query.subject]);

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

      <CardsReviewLayout
        card={currentCard}
        isSubmitting={isSubmitting}
        isFlipped={isFlipped}
        setIsFlipped={setIsFlipped}
        handleReview={handleReview}
      />
    </LayoutDashboard>
  );
}
