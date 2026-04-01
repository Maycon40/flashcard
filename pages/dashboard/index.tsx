import useSWR from "swr";
import Link from "next/link";

import LayoutDashboard from "@/components/layout/Dashboard";
import { Card, User } from "@/types/types";
import { fetcher } from "@/infra/fetcher";

export default function DashboardPage() {
  const { data: user, isLoading: userLoading } = useSWR<User>(
    "/api/v1/user",
    fetcher,
  );

  const {
    data: importantCardsToReview = [],
    isLoading: reviewLoadingImportant,
  } = useSWR<Card[]>("/api/v1/cards/review?important=true", fetcher);

  const { data: cardsToReview = [], isLoading: reviewLoading } = useSWR<Card[]>(
    "/api/v1/cards/review?important=false",
    fetcher,
  );

  return (
    <LayoutDashboard>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="flex text-2xl font-semibold">
            Olá,{" "}
            {userLoading ? (
              <div className="h-8 w-24 rounded-2xl bg-zinc-200 dark:bg-zinc-800"></div>
            ) : (
              user?.username
            )}
            👋
          </h1>
          <p className="text-sm text-zinc-500">
            Aqui estão suas revisões pendentes.
          </p>
        </div>
      </div>

      <section className="mb-8">
        <h2>Cartão Importante para Revisar:</h2>
        {reviewLoadingImportant ? (
          <div className="animate-pulse">
            <div className="h-24 rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
          </div>
        ) : importantCardsToReview.length > 0 ? (
          <div className="rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-lg">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">Revisão pendente</h3>
                <p className="text-zinc-500">
                  Você tem {importantCardsToReview.length} flashcard
                  {importantCardsToReview.length > 1 ? "s" : ""} para revisar.
                </p>
              </div>
              <Link
                href="/dashboard/cards/review?important=true"
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

      <section className="mb-8">
        <h2>Cartão Não Importante para Revisar:</h2>
        {reviewLoading ? (
          <div className="animate-pulse">
            <div className="h-24 rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
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
                href="/dashboard/cards/review?important=false"
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
    </LayoutDashboard>
  );
}
