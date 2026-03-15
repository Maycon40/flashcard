"use client";

import React, { useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import Link from "next/link";

import LayoutDashboard from "@/components/LayoutDashboard";
import { Deck } from "@/types/types";
import { withAuth } from "@/infra/auth";

type Card = {
  id: string;
  name: string;
  description?: string;
  deck_id?: string;
  deck_name?: string;
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export const getServerSideProps = withAuth();

export default function CardsPage() {
  const { mutate } = useSWRConfig();

  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);
  const [selectedDeck, setSelectedDeck] = useState<string | null>(null);

  const {
    data: cards = [],
    error,
    isLoading,
  } = useSWR<Card[]>("/api/v1/cards", fetcher);

  const { data: decks = [] } = useSWR<Deck[]>("/api/v1/decks", fetcher);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();

    setCreateError(null);
    if (!selectedDeck)
      return setCreateError("Selecione um baralho para associar o cartão.");
    if (!name.trim()) return setCreateError("O nome do cartão é obrigatório.");
    if (!description.trim())
      return setCreateError("A descrição do cartão é obrigatório.");

    setCreating(true);
    try {
      const res = await fetch(
        `/api/v1/cards/${encodeURIComponent(selectedDeck)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), description }),
        },
      );

      const body = await res.json().catch(() => ({}));

      if (res.status === 201) {
        setName("");
        setDescription("");
        setCreating(false);
        setSelectedDeck(null);
        await mutate("/api/v1/cards");
      } else {
        setCreateError(
          body?.action || body?.message || "Falha ao criar cartão.",
        );
        setCreating(false);
      }
    } catch (err: any) {
      setCreateError(err?.message || "Erro de rede");
      setCreating(false);
    }
  }

  async function deleteCard(
    e: React.MouseEvent,
    cardName: string,
    deckName: string,
  ) {
    e.preventDefault();

    await fetch(`/api/v1/cards/${deckName}/${cardName}`, {
      method: "DELETE",
    });
    await mutate("/api/v1/cards");
  }

  return (
    <LayoutDashboard>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Cartões</h1>
          <p className="text-sm text-zinc-500">
            Gerencie todos os cartões ou crie um novo
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCreating((c) => !c)}
            className="inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
          >
            {creating ? "Cancelar" : "Criar"}
          </button>
        </div>
      </div>

      {createError && (
        <div className="mb-4 text-sm text-red-600">{createError}</div>
      )}

      {creating ? (
        <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-zinc-900">
          <h3 className="text-lg font-semibold mb-3">Novo cartão</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Baralho</label>
              <select
                value={selectedDeck || ""}
                onChange={(e) => setSelectedDeck(e.target.value || null)}
                className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 px-3 py-2 bg-transparent text-sm"
              >
                <option className="bg-zinc-900" value="">
                  -- selecione um baralho --
                </option>
                {decks.length > 0 &&
                  decks.map((d) => (
                    <option
                      className="bg-zinc-900"
                      key={d.id || d.name}
                      value={d.name || d.id}
                    >
                      {d.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Nome</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 px-3 py-2 bg-transparent text-sm"
                placeholder="Título do cartão"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Descrição
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 px-3 py-2 bg-transparent text-sm min-h-30"
                placeholder="Descrição ou resposta do cartão"
              />
            </div>

            <div>
              <button
                type="submit"
                className={`inline-flex items-center px-4 py-2 rounded-md text-white ${"bg-indigo-600 hover:bg-indigo-700"}`}
              >
                Criar cartão
              </button>
            </div>
          </form>
        </div>
      ) : (
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
              Erro ao carregar cartões.
            </div>
          ) : cards && cards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className="rounded-lg border border-zinc-100 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900"
                >
                  <h3 className="font-semibold">{card.name}</h3>
                  <p className="text-sm text-zinc-500">{card.description}</p>
                  <p className="text-xs text-zinc-400 mt-2">
                    {card.deck_name
                      ? `Baralho: ${card.deck_name}`
                      : `Deck ID: ${card.deck_id || "-"}`}
                  </p>
                  <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-end">
                    <Link
                      href={`/cards/edit/${card.id}`}
                      className="mr-5 text-sm font-medium text-indigo-600 hover:underline"
                    >
                      Editar
                    </Link>
                    <button
                      type="button"
                      className="text-sm font-medium text-indigo-600 hover:underline cursor-pointer"
                      onClick={(e) =>
                        deleteCard(e, card.name, card.deck_name as string)
                      }
                    >
                      Deletar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-white p-8 text-center shadow-lg dark:bg-zinc-900">
              <p className="text-zinc-600 dark:text-zinc-400">
                Nenhum cartão encontrado.
              </p>
              <p className="mt-2 text-sm text-zinc-500">
                Clique em Criar para adicionar o primeiro cartão.
              </p>
            </div>
          )}
        </section>
      )}
    </LayoutDashboard>
  );
}
