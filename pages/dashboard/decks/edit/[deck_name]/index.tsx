import useSWR from "swr";
import { useState, SubmitEvent } from "react";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

import LayoutDashboard from "@/components/layout/Dashboard";
import { Deck } from "@/types/types";
import Link from "next/link";
import ErrorComponent from "@/components/error";
import { fetcher } from "@/infra/fetcher";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      deckName: context.params?.deck_name,
    },
  };
}

export default function EditDeckPage({ deckName }: { deckName: string }) {
  const { data: deck, error } = useSWR<Deck>(
    `/api/v1/decks/${encodeURIComponent(deckName)}`,
    fetcher,
  );

  if (error) {
    return (
      <LayoutDashboard>
        <div className="mb-6">
          <h1 className="mb-5 text-2xl font-semibold">Editar Baralho</h1>
          <ErrorComponent>{error.message}</ErrorComponent>
        </div>
      </LayoutDashboard>
    );
  }

  return (
    <LayoutDashboard>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Editar Baralho</h1>
        {deck && (
          <p className="text-sm text-zinc-500">
            Modifique os detalhes do baralho <strong>{deck.name}</strong>.
          </p>
        )}
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-zinc-900">
        {deck ? (
          <EditForm deck={deck} />
        ) : (
          <div className="animate-pulse">
            <div className="h-20 rounded bg-zinc-200 dark:bg-zinc-800" />
          </div>
        )}
      </div>
    </LayoutDashboard>
  );
}

function EditForm({ deck }: { deck: Deck }) {
  const router = useRouter();

  const [name, setName] = useState(deck.name || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    setSubmitError(null);

    if (!name.trim()) {
      setSubmitError("O nome do baralho é obrigatório.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(
        `/api/v1/decks/${encodeURIComponent(deck?.name as string)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
          }),
        },
      );

      if (res.ok) {
        router.push("/dashboard/decks");
      } else {
        const body = await res.json().catch(() => ({}));
        setSubmitError(body?.message || "Falha ao atualizar o baralho.");
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setSubmitError(err?.message || "Erro de rede.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {submitError && <ErrorComponent>{submitError}</ErrorComponent>}

      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Nome (Frente)
        </label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 px-3 py-2 bg-transparent text-sm"
          placeholder="Nome do baralho"
          disabled={isSubmitting}
        />
      </div>

      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center px-4 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Salvando..." : "Salvar Alterações"}
        </button>
        <Link
          href="/dashboard/decks"
          className="text-sm text-zinc-600 hover:underline"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
