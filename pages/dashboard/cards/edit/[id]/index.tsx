"use client";

import useSWR from "swr";
import { useState, SubmitEvent, MouseEvent } from "react";
import { NextRouter, useRouter } from "next/router";

import LayoutDashboard from "@/components/layout/Dashboard";
import { Card } from "@/types/types";
import ErrorComponent from "@/components/error";
import { fetcher } from "@/infra/fetcher";
import ButtonComponent from "@/components/button";
import CardForm from "@/components/cards/form";

export default function EditCardPage() {
  const router = useRouter();

  const {
    data: card,
    error,
    isLoading,
    isValidating,
  } = useSWR<Card>(`/api/v1/cards/id/${router.query?.id}`, fetcher, {
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
        {card && !isValidating && !isLoading && router.query ? (
          <EditCardForm card={card} router={router} />
        ) : (
          <div className="h-24 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800"></div>
        )}
      </div>
    </LayoutDashboard>
  );
}

function EditCardForm({ card, router }: { card: Card; router: NextRouter }) {
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
      <CardForm
        isSubmitting={isSubmitting}
        name={name}
        setName={setName}
        isImportant={isImportant}
        setIsImportant={setIsImportant}
        description={description}
        setDescription={setDescription}
        selectedDeck={selectedDeck}
        setSelectedDeck={setSelectedDeck}
      />

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
