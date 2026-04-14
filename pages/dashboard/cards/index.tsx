"use client";

import { useState, useMemo, useRef, useEffect, MouseEvent } from "react";
import useSWR from "swr";
import Link from "next/link";

import LayoutDashboard from "@/components/layout/Dashboard";
import Cards from "@/components/cards";
import { Card } from "@/types/types";
import { fetcher } from "@/infra/fetcher";
import ErrorComponent from "@/components/error";
import SearchBar from "@/components/search/bar";

export default function CardsPage() {
  const {
    data: cards,
    error,
    isLoading,
  } = useSWR<Card[]>(`/api/v1/cards`, fetcher);

  const [searchQuery, setSearchQuery] = useState("");
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    }

    if (openMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenu]);

  const filteredCards = useMemo(() => {
    if (!cards) return [];
    const query = searchQuery.toLowerCase();
    return cards.filter(
      (card) =>
        card.name?.toLowerCase().includes(query) ||
        card.description?.toLowerCase().includes(query),
    );
  }, [cards, searchQuery]);

  async function exportCards(e: MouseEvent) {
    e.preventDefault();
    setOpenMenu(false);

    const cardsJson = [];

    for (const card of filteredCards) {
      cardsJson.push({
        name: card.name,
        description: card.description,
        important: card.important,
        deck_name: card.deck_name,
      });
    }

    const jsonString = JSON.stringify(cardsJson, null, 2);

    const blob = new Blob([jsonString], { type: "application/json" });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `cartões.json`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

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
          <p className="text-sm text-zinc-500">
            Gerencie todos os {(cards || []).length} cartões
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <SearchBar
            value={searchQuery}
            onChange={(e: any) => setSearchQuery(e.target.value)}
          />

          <div className="w-full md:w-auto flex items-center gap-2">
            <Link
              href="/dashboard/cards/create"
              className="w-full sm:w-auto justify-center inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Criar
            </Link>

            <div className="relative" ref={openMenu ? menuRef : null}>
              <button
                type="button"
                className="p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
                onClick={() => setOpenMenu(openMenu ? false : true)}
                aria-label="Opções do cartão"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>

              {openMenu && (
                <div className="absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 z-20 overflow-hidden">
                  <Link
                    href={`/dashboard/cards/import`}
                    className="w-full block px-4 py-2 text-left text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                    onClick={() => setOpenMenu(false)}
                  >
                    Importar
                  </Link>
                  <button
                    type="button"
                    onClick={(e) => exportCards(e)}
                    className="w-full block px-4 py-2 text-left text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                  >
                    Exportar
                  </button>
                </div>
              )}
            </div>
          </div>
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
