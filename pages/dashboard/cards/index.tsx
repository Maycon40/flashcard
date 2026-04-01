"use client";

import useSWR from "swr";
import Link from "next/link";

import LayoutDashboard from "@/components/layout/Dashboard";
import Cards from "@/components/cards";
import { Card } from "@/types/types";
import { fetcher } from "@/infra/fetcher";
import ErrorComponent from "@/components/error";

export default function CardsPage() {
  const { data: cards, error } = useSWR<Card[]>(`/api/v1/cards`, fetcher);

  if (error) {
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Cartões</h1>
          <p className="text-sm text-zinc-500">Gerencie todos os cartões</p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/cards/create"
            className="inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Criar
          </Link>
        </div>
      </div>

      {cards ? (
        <Cards cards={cards}></Cards>
      ) : (
        <div className="h-24 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800"></div>
      )}
    </LayoutDashboard>
  );
}
