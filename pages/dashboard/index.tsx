import useSWR from "swr";
import { Layers, BookOpen } from "lucide-react";

import LayoutDashboard from "@/components/layout/Dashboard";
import { Card, Deck, User } from "@/types/types";
import { fetcher } from "@/infra/fetcher";
import CardsToReview from "@/components/cards/review";
import ReviewWeeklyGraph from "@/components/cards/review/weeklyGraph";

export default function DashboardPage() {
  const { data: user, isLoading: userLoading } = useSWR<User>(
    "/api/v1/user",
    fetcher,
  );

  const { data: cards, isLoading: cardLoading } = useSWR<Card[]>(
    "/api/v1/cards",
    fetcher,
  );

  const { data: decks, isLoading: deckLoading } = useSWR<Deck[]>(
    "/api/v1/decks",
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
            Bem-vindo(a) ao seu gerenciador de flashcards.
          </p>
        </div>
      </div>

      <section className="grid grid-cols-2 sm:grid-cols-3 items-center gap-6 mb-8">
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow dark:shadow-md shadow-gray-500 dark:shadow-black p-5 flex flex-col items-center">
          <span className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900 p-2">
              <Layers className="w-4 h-4 sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400" />
            </span>
            <span className="text-xl sm:text-3xl font-bold text-indigo-700 dark:text-indigo-400">
              {cardLoading ? (
                <div className="h-8 w-8 rounded-2xl bg-zinc-200 dark:bg-zinc-800"></div>
              ) : (
                cards?.length || 0
              )}
            </span>
          </span>
          <span className="text-sm sm:text-base text-zinc-500 dark:text-zinc-300 mt-2">
            Flashcards
          </span>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow dark:shadow-md shadow-gray-500 dark:shadow-black p-5 flex flex-col items-center">
          <span className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900 p-2">
              <BookOpen className="w-4 h-4 sm:w-6 sm:h-6 text-emerald-600 dark:text-emerald-400" />
            </span>
            <span className="text-xl sm:text-3xl font-bold text-emerald-700 dark:text-emerald-400">
              {deckLoading ? (
                <div className="h-8 w-8 rounded-2xl bg-zinc-200 dark:bg-zinc-800"></div>
              ) : (
                decks?.length || 0
              )}
            </span>
          </span>
          <span className="text-sm sm:text-base text-zinc-500 dark:text-zinc-300 mt-2">
            Baralhos
          </span>
        </div>
      </section>

      <CardsToReview />

      <ReviewWeeklyGraph cards={cards} />
    </LayoutDashboard>
  );
}

/*

        <div className="col-span-2 sm:col-span-1 bg-white dark:bg-zinc-900 rounded-lg shadow dark:shadow-md shadow-gray-500 dark:shadow-black p-5 flex flex-col items-center">
          <span className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900 p-2">
              <Flame className="w-4 h-4 sm:w-6 sm:h-6 text-orange-600 dark:text-orange-400" />
            </span>
            <span className="text-xl sm:text-3xl font-bold text-orange-700 dark:text-orange-400">
              {userLoading ? (
                <div className="h-8 w-8 rounded-2xl bg-zinc-200 dark:bg-zinc-800"></div>
              ) : (
                user?.offensive || 0
              )}
            </span>
          </span>
          <span className="text-sm sm:text-base text-zinc-500 dark:text-zinc-300 mt-2">
            Dias Seguidos
          </span>
        </div>
        */
