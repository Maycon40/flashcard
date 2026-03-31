"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import LayoutDashboard from "@/components/layout/Dashboard";
import { withAuth } from "@/infra/auth";
import { Card, Deck, TypeError } from "@/types/types";
import ErrorComponent from "@/components/error";

export const getServerSideProps = withAuth(async (context) => {
  const { req, query } = context;
  const { id } = query;

  const proto = (req.headers["x-forwarded-proto"] as string) || "http";
  const host = req.headers["host"];
  const origin = `${proto}://${host}`;

  const [resCard, resDecks] = await Promise.all([
    fetch(`${origin}/api/v1/cards/id/${id}`, {
      headers: {
        cookie: req.headers.cookie || "",
      },
    }),
    fetch(`${origin}/api/v1/decks`, {
      headers: {
        cookie: req.headers.cookie || "",
      },
    }),
  ]);

  const card = await resCard.json();
  const decks = await resDecks.json();

  let error = false;

  if (resCard.status >= 400) {
    error = card;
  }

  return {
    props: {
      card,
      decks,
      error,
    },
  };
});

export default function EditCardPage({
  card,
  decks,
  error,
}: {
  card: Card;
  decks: Deck[];
  error: TypeError;
}) {
  const router = useRouter();

  const [name, setName] = useState(card.name || "");
  const [description, setDescription] = useState(card.description || "");
  const [selectedDeck, setSelectedDeck] = useState(card.deck_name || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isImportant, setIsImportant] = useState(card.important || false);

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);

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
        setSubmitSuccess(true);

        setTimeout(() => {
          router.push("/cards");
        }, 500);
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

  if (error) {
    return (
      <LayoutDashboard>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Editar Cartão</h1>
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
