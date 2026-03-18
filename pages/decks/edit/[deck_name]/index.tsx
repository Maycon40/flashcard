import { useState, SubmitEvent } from "react";
import { useRouter } from "next/router";

import LayoutDashboard from "@/components/layout/Dashboard";
import { withAuth } from "@/infra/auth";
import { Deck, TypeError } from "@/types/types";
import Link from "next/link";
import ErrorComponent from "@/components/error";

export const getServerSideProps = withAuth(async (context) => {
  const { req, query } = context;
  const { deck_name } = query;

  const proto = (req.headers["x-forwarded-proto"] as string) || "http";
  const host = req.headers["host"];
  const origin = `${proto}://${host}`;

  const resDeck = await fetch(`${origin}/api/v1/decks/${deck_name}`, {
    headers: { cookie: req.headers.cookie || "" },
  });

  const deck = await resDeck.json();

  let error = false;

  if (resDeck.status >= 400) {
    error = deck;
  }

  return {
    props: {
      deck,
      error,
    },
  };
});

export default function EditDeckPage({
  deck,
  error,
}: {
  deck: Deck;
  error: TypeError;
}) {
  const router = useRouter();

  const [name, setName] = useState(deck.name || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);

    if (!name.trim()) {
      setSubmitError("O nome do baralho é obrigatório.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/v1/decks/${deck.name}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
        }),
      });

      if (res.ok) {
        setSubmitSuccess(true);

        setTimeout(() => {
          router.push("/decks");
        }, 500);
      } else {
        const body = await res.json().catch(() => ({}));
        setSubmitError(body?.message || "Falha ao atualizar o baralho.");
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
          <h1 className="text-2xl font-semibold">Editar Baralho</h1>
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
        <form onSubmit={handleSubmit} className="space-y-4">
          {submitError && (
            <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              {submitError}
            </div>
          )}

          {submitSuccess && (
            <div className="rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-700">
              Baralho atualizado com sucesso!
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
              placeholder="Nome do baralho"
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
              href="/decks"
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
