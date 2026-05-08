import useSWR, { useSWRConfig } from "swr";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, Filter, Star } from "lucide-react";

import { Card } from "@/types/types";
import { fetcher } from "@/infra/fetcher";

export default function CardsToReview() {
  const { mutate } = useSWRConfig();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [important, setImportant] = useState<boolean | null>(null);

  const {
    data: cardsToReview = [],
    isLoading: reviewLoading,
    isValidating: reviewValidating,
  } = useSWR<Card[]>("/api/v1/cards/review", fetcher, {
    revalidateOnMount: true,
  });

  useEffect(() => {
    mutate(
      (key) => typeof key === "string" && key.includes("/api/v1/cards/review"),
      undefined,
      {
        revalidate: true,
      },
    );
  }, [mutate]);

  const filteredCardsToReview = useMemo(() => {
    if (!cardsToReview) return [];

    return cardsToReview.filter(
      (card) =>
        (card.important == important || important == null) &&
        (card.deck_id == subject || !subject),
    );
  }, [cardsToReview, subject, important]);

  const filteredDecksToReview = useMemo(() => {
    if (!cardsToReview) return [];

    const addedDecks: string[] = [];

    const decksToReview = cardsToReview.flatMap((card) => {
      if (
        card.deck_id &&
        !addedDecks.includes(card.deck_id) &&
        (card.important == important || important == null)
      ) {
        addedDecks.push(card.deck_id);
        return [
          {
            id: card.deck_id,
            name: card.deck_name,
          },
        ];
      }

      return [];
    });

    return decksToReview;
  }, [cardsToReview, important]);

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2>Cartões para Revisar:</h2>
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-sm font-medium"
        >
          <Filter size={16} />
          Filtros
          {isFilterOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {isFilterOpen && (
        <div className="mb-6 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
          <div>
            <label className="block text-xs font-semibold uppercase text-zinc-500 mb-2">
              Matéria
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-2 rounded-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Todas</option>
              {filteredDecksToReview.map((d) => (
                <option
                  className="bg-zinc-50 dark:bg-zinc-900"
                  key={d.id}
                  value={d.id}
                >
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col justify-end">
            <button
              onClick={() => setImportant(important === true ? null : true)}
              className={`flex items-center justify-center gap-2 p-2 rounded-md border transition-all ${
                important === true
                  ? "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400"
                  : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-500"
              }`}
            >
              <Star
                size={16}
                fill={important === true ? "currentColor" : "none"}
              />
              Apenas Importantes
            </button>
          </div>
        </div>
      )}
      {reviewLoading || reviewValidating ? (
        <div className="animate-pulse">
          <div className="h-24 rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
        </div>
      ) : filteredCardsToReview.length > 0 ? (
        <div className="rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-lg">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">Revisão pendente</h3>
              <p className="text-zinc-500">
                Você tem {filteredCardsToReview.length} flashcard
                {filteredCardsToReview.length > 1 ? "s" : ""} para revisar.
              </p>
            </div>
            <Link
              href={`/dashboard/cards/review/${important ? (subject ? `?important=true&subject=${subject}` : "?important=true") : subject ? `?subject=${subject}` : ""}`}
              className="inline-flex items-center px-5 py-3 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 whitespace-nowrap"
            >
              Revisar
            </Link>
          </div>
        </div>
      ) : cardsToReview.length > 0 ? (
        <div className="rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-lg text-center">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Nenhum cartão encontrado
          </h3>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">
            Não há cartões que correspondam aos filtros aplicados. Tente ajustar
            suas opções de busca para ver os resultados.
          </p>
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
  );
}
