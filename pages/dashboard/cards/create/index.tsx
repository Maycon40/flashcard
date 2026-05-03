"use client";

import useSWR from "swr";
import { useState, SubmitEvent } from "react";
import { NextRouter, useRouter } from "next/router";

import LayoutDashboard from "@/components/layout/Dashboard";
import { Deck } from "@/types/types";
import ErrorComponent from "@/components/error";
import { fetcher } from "@/infra/fetcher";
import ButtonComponent from "@/components/button";
import SearchableSelect from "@/components/search/select";

export default function CreateCardPage() {
  const router = useRouter();

  function back(e: MouseEvent) {
    e.preventDefault();
    router.back();
  }

  return (
    <LayoutDashboard>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Cartões</h1>
          <p className="text-sm text-zinc-500">Crie um novo</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e: any) => back(e)}
            className="inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Cancelar
          </button>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-zinc-900">
        <h3 className="text-lg font-semibold mb-3">Novo cartão</h3>
        <CreateCardForm router={router} />
      </div>
    </LayoutDashboard>
  );
}

function CreateCardForm({ router }: { router: NextRouter }) {
  const deckName = router.query.deck_name;

  const { data: decks } = useSWR<Deck[]>(`/api/v1/decks`, fetcher);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);
  const [selectedDeck, setSelectedDeck] = useState<string>("");
  const [isImportant, setIsImportant] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleCreate(e: SubmitEvent) {
    e.preventDefault();

    setCreateError(null);

    if (!selectedDeck && !deckName)
      return setCreateError("Selecione um baralho para associar o cartão.");
    if (!name.trim()) return setCreateError("O nome do cartão é obrigatório.");
    if (!description.trim())
      return setCreateError("A descrição do cartão é obrigatório.");

    setIsSubmitting(true);

    try {
      const res = await fetch(
        `/api/v1/cards/${encodeURIComponent(String(selectedDeck || deckName))}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            description,
            important: isImportant,
          }),
        },
      );

      const body = await res.json().catch(() => ({}));

      if (res.status === 201) {
        router.back();
      } else {
        setCreateError(body?.message || "Falha ao criar cartão.");
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setCreateError(err?.message || "Erro de rede");
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {createError && (
        <div className="mb-4">
          <ErrorComponent>{createError}</ErrorComponent>
        </div>
      )}
      <form onSubmit={handleCreate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Baralho</label>
          <SearchableSelect
            decks={decks || []}
            selectedDeck={selectedDeck || (deckName as string) || ""}
            setSelectedDeck={setSelectedDeck}
            isSubmitting={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Nome (Frente)
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 px-3 py-2 bg-transparent text-sm"
            placeholder="Título do cartão"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Descrição (Verso)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 px-3 py-2 bg-transparent text-sm min-h-30"
            placeholder="Descrição ou resposta do cartão"
          />
        </div>

        <div className="flex items-center">
          <input
            id="important"
            name="important"
            type="checkbox"
            checked={isImportant}
            onChange={(e) => setIsImportant(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label
            htmlFor="important"
            className="ml-2 block text-sm text-zinc-700 dark:text-zinc-300"
          >
            É um cartão importante?
          </label>
        </div>

        <div>
          <ButtonComponent isLoading={isSubmitting}>
            {isSubmitting ? "Criando" : "Criar cartão"}
          </ButtonComponent>
        </div>
      </form>
    </>
  );
}
