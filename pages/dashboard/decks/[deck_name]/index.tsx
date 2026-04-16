import useSWR from "swr";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import Cards from "@/components/cards";
import LayoutDashboard from "@/components/layout/Dashboard";
import { fetcher } from "@/infra/fetcher";
import { Card } from "@/types/types";
import ErrorComponent from "@/components/error";
import SearchBar from "@/components/search/bar";

export default function DeckDetailsPage() {
  const { query } = useRouter();
  const deckName = query?.deck_name;

  const {
    data: cards,
    error,
    isLoading,
  } = useSWR<Card[]>(
    `/api/v1/cards/${encodeURIComponent(String(query?.deck_name))}`,
    fetcher,
  );

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

  if (
    error &&
    (error.status_code !== 404 ||
      error.message !== "Nenhum cartão foi encontrado no sistema.")
  ) {
    return (
      <LayoutDashboard>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{deckName}</h1>
        </div>

        <ErrorComponent>{error.message}</ErrorComponent>
      </LayoutDashboard>
    );
  }

  return (
    <LayoutDashboard>
      <div className="flex flex-wrap items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{deckName}</h1>
          {isLoading || !query ? (
            <div className="animate-pulse h-8 w-24 rounded-2xl bg-zinc-200 dark:bg-zinc-800"></div>
          ) : (
            <p className="text-zinc-500">
              {cards?.length || 0} cart{(cards || []).length > 1 ? "ões" : "ão"}{" "}
              neste baralho.
            </p>
          )}
        </div>

        <div className="mt-5 md:mt-0 flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <SearchBar
            value={searchQuery}
            onChange={(e: any) => setSearchQuery(e.target.value)}
          />

          <div className="w-full md:w-auto flex items-center gap-2">
            <Link
              href={`/dashboard/cards/create?deck_name=${deckName}`}
              className="w-full sm:w-auto justify-center inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Criar cartão
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
                    onClick={(e: any) => exportCards(e)}
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

      {isLoading || !query ? (
        <div className="h-24 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800"></div>
      ) : (
        <Cards cards={filteredCards || []} />
      )}
    </LayoutDashboard>
  );
}
