"use client";

import { useState, MouseEvent, Dispatch, SetStateAction } from "react";
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
      <div className="flex flex-wrap items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Meus baralhos</h1>
          <p className="text-sm text-zinc-500">Gerencie os baralhos</p>
        </div>

        <Link
          href="/dashboard/decks/create"
          className="inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
        >
          Criar
        </Link>
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
          decks={decks}
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
  console.log("decks", decks);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {decks.map((deck) => (
        <div
          key={deck.id || deck.name}
          className="rounded-lg border border-zinc-100 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900"
        >
          <h3 className="font-semibold">{deck.name}</h3>
          <p className="text-sm text-zinc-500">Baralho criado por você</p>
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
