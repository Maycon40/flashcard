"use client";

import { useState, SubmitEvent, MouseEvent } from "react";
import useSWR, { useSWRConfig } from "swr";
import Link from "next/link";

import { Deck } from "@/types/types";
import LayoutDashboard from "@/components/layout/Dashboard";
import { withAuth } from "@/infra/auth";
import ConfirmDelete from "@/components/delete";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export const getServerSideProps = withAuth();

export default function DecksPage() {
  const {
    data: decks = [],
    error,
    isLoading,
  } = useSWR<Deck[]>("/api/v1/decks", fetcher);
  const { mutate } = useSWRConfig();

  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [handleError, setHandleError] = useState<string | null>(null);
  const [deckToDelete, setDeckToDelete] = useState<string | null>(null);

  async function handleCreate(e: SubmitEvent) {
    e.preventDefault();
    setHandleError(null);
    if (!name.trim()) return setHandleError("O nome do baralho é obrigatório.");
    setCreating(true);

    try {
      const res = await fetch("/api/v1/decks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      const body = await res.json().catch(() => ({}));

      if (res.status === 201) {
        setName("");
        await mutate("/api/v1/decks");
      } else {
        setHandleError(
          body?.action || body?.message || "Falha ao criar o baralho.",
        );
      }
    } catch (err: any) {
      setHandleError(err?.message || "Erro de rede");
    } finally {
      setCreating(false);
    }
  }

  async function deleteDeck(e: MouseEvent, deckName: string) {
    e.preventDefault();

    const res = await fetch(`/api/v1/decks/${deckName}`, {
      method: "DELETE",
    });

    const body = await res.json().catch(() => ({}));

    if (res.status == 200) {
      await mutate("/api/v1/decks");
    } else {
      setHandleError(
        body?.action || body?.message || "Falha ao criar o baralho.",
      );
    }

    setDeckToDelete(null);
  }

  return (
    <LayoutDashboard>
      <div className="flex flex-wrap items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Meus baralhos</h1>
          <p className="text-sm text-zinc-500">
            Gerencie seus baralhos ou crie um novo
          </p>
        </div>

        <form
          onSubmit={handleCreate}
          className="flex flex-wrap items-center gap-2"
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="my-5 lg:my-0 rounded-md border border-zinc-200 dark:border-zinc-800 px-3 py-2 bg-white dark:bg-zinc-900 text-sm"
            placeholder="Nome do novo baralho"
            aria-label="Nome do novo baralho"
          />
          <button
            type="submit"
            disabled={creating}
            className={`inline-flex items-center px-4 py-2 rounded-md text-white ${creating ? "bg-indigo-300" : "bg-indigo-600 hover:bg-indigo-700"}`}
          >
            {creating ? "Criando..." : "Criar"}
          </button>
        </form>
      </div>

      {handleError && (
        <div className="mb-4 text-sm text-red-600">{handleError}</div>
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
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-6 w-40 rounded bg-zinc-200 dark:bg-zinc-800 mb-4" />
            <div className="space-y-3">
              <div className="h-20 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-20 rounded bg-zinc-200 dark:bg-zinc-800" />
            </div>
          </div>
        ) : error ? (
          <div className="rounded-md bg-red-50 border border-red-200 p-4 text-red-700">
            Erro ao carregar seus baralhos.
          </div>
        ) : decks && decks.length > 0 ? (
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
                      href={`/decks/${encodeURIComponent(String(deck.name))}`}
                      className="text-indigo-600 hover:underline"
                    >
                      Ver baralho
                    </Link>
                  </div>
                  <div>
                    <Link
                      href={`/decks/edit/${deck.name}`}
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
        ) : (
          <div className="rounded-2xl bg-white p-8 text-center shadow-lg dark:bg-zinc-900">
            <p className="text-zinc-600 dark:text-zinc-400">
              Você ainda não tem baralhos.
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              Crie o seu primeiro baralho usando o campo acima.
            </p>
          </div>
        )}
      </section>
    </LayoutDashboard>
  );
}
