"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import Link from "next/link";

import LayoutDashboard from "@/components/layout/Dashboard";
import Cards from "@/components/cards";
import { Card } from "@/types/types";
import { fetcher } from "@/infra/fetcher";
import ErrorComponent from "@/components/error";

export default function CardsPage() {
  const {
    data: cards,
    error,
    isLoading,
  } = useSWR<Card[]>(`/api/v1/cards`, fetcher);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredCards = useMemo(() => {
    if (!cards) return [];
    const query = searchQuery.toLowerCase();
    return cards.filter(
      (card) =>
        card.name?.toLowerCase().includes(query) ||
        card.description?.toLowerCase().includes(query),
    );
  }, [cards, searchQuery]);

  if (error && error.status_code != 404) {
    return (
      <LayoutDashboard>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Cartões</h1>
            <p className="text-sm text-zinc-500">Gerencie todos os cartões</p>
          </div>
        </div>
        <ErrorComponent>{error.message}</ErrorComponent>
      </LayoutDashboard>
    );
  }

  return (
    <LayoutDashboard>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Cartões</h1>
          <p className="text-sm text-zinc-500">Gerencie todos os cartões</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-zinc-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Pesquisar cartões..."
              className="block w-full pl-10 pr-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md leading-5 bg-white dark:bg-zinc-900 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Link
            href="/dashboard/cards/create"
            className="w-full sm:w-auto justify-center inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Criar
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="h-24 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800"></div>
      ) : (
        <Cards cards={filteredCards}></Cards>
      )}
    </LayoutDashboard>
  );
}
