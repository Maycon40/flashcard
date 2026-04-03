"use client";

import useSWR from "swr";
import { useState } from "react";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";

import LayoutDashboard from "@/components/layout/Dashboard";
import { Card } from "@/types/types";
import { fetcher } from "@/infra/fetcher";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      cardId: context.params?.card_id,
    },
  };
}

export default function ReviewPage({ cardId }: { cardId: string }) {
  const { data: card } = useSWR<Card>(`/api/v1/cards/id/${cardId}`, fetcher);

  const [currentCard, setCurrentCard] = useState<string | null>(cardId);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReview = async (difficulty: string) => {
    setIsSubmitting(true);

    try {
      if (new Date(String(card?.date_to_review)) < new Date(Date.now())) {
        await fetch(`/api/v1/cards/id/${cardId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ difficulty }),
        });
      }
    } catch (err) {
      console.error("Falha ao enviar a revisão:", err);
    } finally {
      setIsSubmitting(false);
      setIsFlipped(false);
      setCurrentCard(null);
    }
  };

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

      <div className="rounded-2xl bg-white dark:bg-zinc-900 p-8 shadow-lg min-h-80 flex flex-col justify-center items-center text-center">
        {!isFlipped ? (
          <div className="flex flex-col items-center gap-8">
            <h2 className="text-3xl font-bold">{card?.name}</h2>
            <button
              onClick={() => setIsFlipped(true)}
              className="inline-flex items-center px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Virar cartão
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 w-full">
            <h2 className="text-2xl font-semibold">{card?.name}</h2>
            <div className="w-full border-t border-zinc-200 dark:border-zinc-700 my-2"></div>
            <p className="text-xl text-justify text-zinc-600 dark:text-zinc-300 whitespace-pre-line">
              {card?.description}
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
