"use client";

import { useState, useMemo, MouseEvent, Dispatch, SetStateAction } from "react";
import useSWR, { useSWRConfig } from "swr";
import Link from "next/link";

import { Deck } from "@/types/types";
import LayoutDashboard from "@/components/layout/Dashboard";
import ConfirmDelete from "@/components/delete";
import ErrorComponent from "@/components/error";
import { fetcher } from "@/infra/fetcher";

export default function DecksPage() {
  const {
    data: decks = [],
    error,
    isLoading,
  } = useSWR<Deck[]>("/api/v1/decks", fetcher);
  const { mutate } = useSWRConfig();

  const [handleError, setHandleError] = useState<string | null>(null);
  const [deckToDelete, setDeckToDelete] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredDecks = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return decks.filter((deck) => deck.name?.toLowerCase().includes(query));
  }, [decks, searchQuery]);

  async function deleteDeck(e: MouseEvent, deckName: string) {
    e.preventDefault();

    const res = await fetch(`/api/v1/decks/${encodeURIComponent(deckName)}`, {
      method: "DELETE",
    });

    const body = await res.json().catch(() => ({}));
    const updatedDecks = decks.filter((d) => d.name !== deckName);

    if (res.status == 200) {
      await mutate("/api/v1/decks", updatedDecks);
    } else {
      setHandleError(
        body?.action || body?.message || "Falha ao deletar o baralho.",
      );
    }

    setDeckToDelete(null);
  }

  return (
    <LayoutDashboard>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Meus baralhos</h1>
          <p className="text-sm text-zinc-500">Gerencie os baralhos</p>
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
              placeholder="Pesquisar baralhos..."
              className="block w-full pl-10 pr-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md leading-5 bg-white dark:bg-zinc-900 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Link
            href="/dashboard/decks/create"
            className="w-full sm:w-auto justify-center inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Criar
          </Link>
        </div>
      </div>

      {handleError && (
        <div className="mb-4">
          <ErrorComponent>{handleError}</ErrorComponent>
        </div>
      )}

      <ConfirmDelete
        deleteState={deckToDelete}
        setDeleteState={setDeckToDelete}
        callback={(e: any) => deleteDeck(e, deckToDelete as string)}
      >
        Você tem certeza que deseja excluir o baralho{" "}
        <strong>{deckToDelete}</strong>? Esta ação não pode ser desfeita.
      </ConfirmDelete>

      <section className="space-y-6">
        <DecksData
          decks={filteredDecks}
          error={error}
          isLoading={isLoading}
          setDeckToDelete={setDeckToDelete}
        />
      </section>
    </LayoutDashboard>
  );
}

function DecksData({
  decks,
  error,
  isLoading,
  setDeckToDelete,
}: {
  decks: Deck[];
  error: any;
  isLoading: boolean;
  setDeckToDelete: Dispatch<SetStateAction<string | null>>;
}) {
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 space-y-3">
          <div className="h-20 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-20 rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </div>
    );
  }

  if (error && error.status_code != 404) {
    return <ErrorComponent>Erro ao carregar seus baralhos.</ErrorComponent>;
  }

  if (!decks || decks.length == 0) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-lg dark:bg-zinc-900">
        <p className="text-zinc-600 dark:text-zinc-400">
          Você ainda não tem baralhos.
        </p>
        <p className="mt-2 text-sm text-zinc-500">
          Crie o seu primeiro baralho.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {decks.map((deck) => (
        <div
          key={deck.id || deck.name}
          className="rounded-lg border border-zinc-100 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900"
        >
          <h3 className="font-semibold">{deck.name}</h3>
          <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div>
              <Link
                href={`/dashboard/decks/${encodeURIComponent(String(deck.name))}`}
                className="text-indigo-600 hover:underline"
              >
                Ver baralho
              </Link>
            </div>
            <div>
              <Link
                href={`/dashboard/decks/edit/${encodeURIComponent(String(deck.name))}`}
                className="mr-5 text-sm font-medium text-indigo-600 hover:underline"
              >
                Editar
              </Link>
              <button
                type="button"
                className="text-sm font-medium text-indigo-600 hover:underline cursor-pointer"
                onClick={() => setDeckToDelete(deck.name as string)}
              >
                Deletar
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
