"use client";

import useSWR from "swr";
import { useState, SubmitEvent, MouseEvent } from "react";
import { useRouter } from "next/router";

import LayoutDashboard from "@/components/layout/Dashboard";
import { Card, Deck } from "@/types/types";
import ErrorComponent from "@/components/error";
import { fetcher } from "@/infra/fetcher";
import ButtonComponent from "@/components/button";

export default function EditCardPage() {
  const { query } = useRouter();

  const {
    data: card,
    error,
    isLoading,
    isValidating,
  } = useSWR<Card>(`/api/v1/cards/id/${query?.id}`, fetcher, {
    revalidateOnMount: true,
  });

  if (error) {
    return (
      <LayoutDashboard>
        <div className="mb-6">
          <h1 className="mb-5 text-2xl font-semibold">Editar Cartão</h1>
          <ErrorComponent>{error.message}</ErrorComponent>
        </div>
      </LayoutDashboard>
    );
  }

  return (
    <LayoutDashboard>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Editar Cartão</h1>
        {card && (
          <p className="text-sm text-zinc-500">
            Modifique os detalhes do seu cartão do baralho{" "}
            <strong>{card.deck_name}</strong>.
          </p>
        )}
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-zinc-900">
        {card && !isValidating && !isLoading && query ? (
          <EditCardForm card={card} />
        ) : (
          <div className="h-24 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800"></div>
        )}
      </div>
    </LayoutDashboard>
  );
}

function EditCardForm({ card }: { card: Card }) {
  const router = useRouter();

  const { data: decks } = useSWR<Deck[]>(`/api/v1/decks`, fetcher);

  const [name, setName] = useState(card.name || "");
  const [description, setDescription] = useState(card.description || "");
  const [selectedDeck, setSelectedDeck] = useState(card.deck_name || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isImportant, setIsImportant] = useState(card.important || false);

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    setSubmitError(null);

    if (!selectedDeck) {
      setSubmitError("A seleção de um baralho é obrigatória.");
      return;
    }

    if (!name.trim()) {
      setSubmitError("O nome do cartão é obrigatório.");
      return;
    }

    if (!description.trim())
      return setSubmitError("A descrição do cartão é obrigatório.");

    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/v1/cards/id/${card.id as string}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          important: isImportant,
          deck_name: selectedDeck,
        }),
      });

      if (res.ok) {
        router.back();
      } else {
        const body = await res.json().catch(() => ({}));
        setSubmitError(body?.message || "Falha ao atualizar o cartão.");
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setSubmitError(err?.message || "Erro de rede.");
      setIsSubmitting(false);
    }
  }

  function back(e: MouseEvent) {
    e.preventDefault();
    router.back();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {submitError && <ErrorComponent>{submitError}</ErrorComponent>}

      <div>
        <label htmlFor="deck" className="block text-sm font-medium mb-1">
          Baralho
        </label>
        <select
          id="deck"
          value={selectedDeck}
          onChange={(e) => setSelectedDeck(e.target.value)}
          className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 px-3 py-2 bg-transparent text-sm"
          disabled={isSubmitting}
        >
          <option className="bg-zinc-900" value="">
            -- selecione um baralho --
          </option>
          {decks?.map((d) => (
            <option
              key={d.id || d.name}
              className="bg-zinc-900"
              value={d.name || ""}
            >
              {d.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Nome (Frente)
        </label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 px-3 py-2 bg-transparent text-sm"
          placeholder="Título do cartão"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Descrição (Verso)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 px-3 py-2 bg-transparent text-sm min-h-30"
          placeholder="Descrição ou resposta do cartão"
          disabled={isSubmitting}
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

      <div className="flex items-center gap-4 pt-2">
        <ButtonComponent isLoading={isSubmitting}>
          {isSubmitting ? "Salvando" : "Salvar Alterações"}
        </ButtonComponent>
        <button
          type="button"
          onClick={(e) => back(e)}
          className="text-sm text-zinc-600 hover:underline cursor-pointer"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
