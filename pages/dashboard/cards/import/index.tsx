"use client";

import { useState, SubmitEvent, MouseEvent } from "react";
import { useRouter } from "next/router";

import LayoutDashboard from "@/components/layout/Dashboard";
import ErrorComponent from "@/components/error";
import { Deck } from "@/types/types";
import ButtonComponent from "@/components/button";

export default function ImportCardPage() {
  return (
    <LayoutDashboard>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Importar Cartão</h1>
      </div>

      <p>
        Para importar um cartão é necessário usar um arquivo com a extensão
        .json.
      </p>

      <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-zinc-900">
        <ImportCardForm />
      </div>
    </LayoutDashboard>
  );
}

function ImportCardForm() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    setSubmitError(null);

    if (!file) {
      setSubmitError("É necessário selecionar um arquivo.");
      return;
    }

    setIsSubmitting(true);

    const resDecks = await fetch(`/api/v1/decks`);

    if (resDecks.status != 200 && resDecks.status != 404) {
      setSubmitError(
        "Erro ao buscar os baralhos. Não foi possível importar o cartão.",
      );
      setIsSubmitting(false);
      return;
    }

    let decks: Deck[] = await resDecks.json();

    if (resDecks.status == 404) {
      decks = [];
    }

    const deckIds: { [key: string]: string } = {};

    for (const deck of decks) {
      deckIds[String(deck.name)] = String(deck.id);
    }

    try {
      const content = await file.text();
      const data = JSON.parse(content);

      const cardsToImport = Array.isArray(data) ? data : [data];

      for (const card of cardsToImport) {
        if (!card.name || !card.description || !card.deck_name) {
          setSubmitError("Formato do arquivo é inválido!");
          setIsSubmitting(false);
          return;
        }

        if (!deckIds[card.deck_name]) {
          const res = await fetch(`/api/v1/decks`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: card.deck_name,
            }),
          });

          const deck = await res.json();

          deckIds[card.deck_name] = String(deck.id);
        }

        const res = await fetch(
          `/api/v1/cards/${encodeURIComponent(card.deck_name)}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: card.name,
              description: card.description,
              important: card.important || false,
            }),
          },
        );

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          setSubmitError(
            body?.message || `Falha ao importar o cartão: ${card.name}`,
          );
          setIsSubmitting(false);
          return;
        }
      }

      router.back();
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
        <label htmlFor="file" className="block text-sm font-medium mb-1">
          Arquivo
        </label>
        <input
          id="file"
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 px-3 py-2 bg-transparent text-sm"
          placeholder="Arquivo .json"
          disabled={isSubmitting}
        />
      </div>

      <div className="flex items-center gap-4 pt-2">
        <ButtonComponent isLoading={isSubmitting}>
          {isSubmitting ? "Importando" : "Importar"}
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
