"use client";

import { useRouter } from "next/router";
import useSWR, { useSWRConfig } from "swr";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";

import LayoutDashboard from "@/components/LayoutDashboard";
import { withAuth } from "@/infra/auth";
import { Card, Deck } from "@/types/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export const getServerSideProps = withAuth();

export default function EditCardPage() {
  const router = useRouter();
  const { id } = router.query;
  const { mutate } = useSWRConfig();

  const { data: cards, error: cardsError } = useSWR<Card[]>(
    "/api/v1/cards",
    fetcher,
  );

  const { data: decks = [] } = useSWR<Deck[]>("/api/v1/decks", fetcher);

  const card = useMemo(() => cards?.find((c) => c.id === id), [cards, id]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDeck, setSelectedDeck] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (card) {
      setName(card.name as string);
      setDescription(card.description || "");
      setSelectedDeck(card.deck_name || "");
    }
  }, [card]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);

    if (!name.trim()) {
      setSubmitError("O nome do cartão é obrigatório.");
      return;
    }

    if (!selectedDeck) {
      setSubmitError("A seleção de um baralho é obrigatória.");
      return;
    }

    if (!card) {
      setSubmitError("Cartão não encontrado para atualização.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(
        `/api/v1/cards/${encodeURIComponent(
          card.deck_name!,
        )}/${encodeURIComponent(card.name as string)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            description: description.trim(),
            deck_name: selectedDeck,
          }),
        },
      );

      if (res.ok) {
        setSubmitSuccess(true);
        await mutate("/api/v1/cards");
        if (card.deck_name) {
          await mutate(`/api/v1/cards/${encodeURIComponent(card.deck_name)}`);
        }
        if (selectedDeck && selectedDeck !== card.deck_name) {
          await mutate(`/api/v1/cards/${encodeURIComponent(selectedDeck)}`);
        }

        setTimeout(() => {
          router.push("/cards");
        }, 1000);
      } else {
        const body = await res.json().catch(() => ({}));
        setSubmitError(body?.message || "Falha ao atualizar o cartão.");
      }
    } catch (err: any) {
      setSubmitError(err?.message || "Erro de rede.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const isLoading = (!cards && !cardsError) || !decks;

  if (isLoading) {
    return (
      <LayoutDashboard>
        <div className="animate-pulse">
          <div className="h-8 w-1/3 rounded bg-zinc-200 dark:bg-zinc-800 mb-8" />
          <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-zinc-900 space-y-4">
            <div className="h-4 w-1/4 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-10 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-1/4 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-24 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-10 w-32 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </div>
      </LayoutDashboard>
    );
  }

  if (cardsError || (cards && !card)) {
    return (
      <LayoutDashboard>
        <div className="rounded-md bg-red-50 border border-red-200 p-4 text-red-700">
          {cardsError ? "Erro ao carregar o cartão." : "Cartão não encontrado."}
        </div>
        <div className="mt-4">
          <Link href="/cards" className="text-indigo-600 hover:underline">
            Voltar para a lista de cartões
          </Link>
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
        <form onSubmit={handleSubmit} className="space-y-4">
          {submitError && (
            <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              {submitError}
            </div>
          )}

          {submitSuccess && (
            <div className="rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-700">
              Cartão atualizado com sucesso!
            </div>
          )}

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
              {decks.map((d) => (
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
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-1"
            >
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

          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={isSubmitting || submitSuccess}
              className="inline-flex items-center px-4 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </button>
            <Link
              href="/cards"
              className="text-sm text-zinc-600 hover:underline"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </LayoutDashboard>
  );
}
