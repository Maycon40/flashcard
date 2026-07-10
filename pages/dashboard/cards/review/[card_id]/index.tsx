"use client";

import useSWR from "swr";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import LayoutDashboard from "@/components/layout/Dashboard";
import { Card } from "@/types/types";
import { fetcher } from "@/infra/fetcher";
import CardsReviewLayout from "@/components/cards/review/layout";

export default function ReviewPage() {
  const { query } = useRouter();

  const { data: card, isLoading } = useSWR<Card>(
    `/api/v1/cards/identifier/${query?.card_id}`,
    fetcher,
  );

  const [currentCard, setCurrentCard] = useState<string | null>(
    String(card?.id),
  );
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReview = async (difficulty: string) => {
    setIsSubmitting(true);

    try {
      if (new Date(String(card?.date_to_review)) < new Date(Date.now())) {
        await fetch(`/api/v1/cards/identifier/${card?.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ difficulty }),
        });
      }
    } finally {
      setIsSubmitting(false);
      setIsFlipped(false);
      setCurrentCard(null);
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

  if (!currentCard) {
    return (
      <LayoutDashboard>
        <div className="text-center p-8">
          <h1 className="text-2xl font-semibold mb-4">Revisão Concluída!</h1>
          <p className="text-zinc-500 mb-6">
            Parabéns! Você revisou os seus cartões.
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

  return (
    <LayoutDashboard>
      <h1 className="text-2xl font-semibold mb-2">Revisão</h1>
      <p className="text-sm text-zinc-500 mb-6">
        Revisando cartão {card?.name} do baralho{" "}
        <strong>{card?.deck_name}</strong>
      </p>

      <CardsReviewLayout
        card={card}
        isSubmitting={isSubmitting}
        isFlipped={isFlipped}
        setIsFlipped={setIsFlipped}
        handleReview={handleReview}
      />
    </LayoutDashboard>
  );
}
