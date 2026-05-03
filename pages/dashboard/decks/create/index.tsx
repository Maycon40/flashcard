"use client";

import { useState, SubmitEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import LayoutDashboard from "@/components/layout/Dashboard";
import ErrorComponent from "@/components/error";
import ButtonComponent from "@/components/button";

export default function DeckPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleCreate(e: SubmitEvent) {
    e.preventDefault();

    setCreateError(null);

    if (!name.trim()) return setCreateError("O nome do baralho é obrigatório.");

    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/v1/decks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
        }),
      });

      const body = await res.json().catch(() => ({}));

      if (res.status === 201) {
        router.push("/dashboard/decks");
      } else {
        setCreateError(body?.message || "Falha ao criar baralho.");
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setCreateError(err?.message || "Erro de rede");
      setIsSubmitting(false);
    }
  }

  return (
    <LayoutDashboard>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Baralhos</h1>
          <p className="text-sm text-zinc-500">Crie um novo</p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/decks"
            className="inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Cancelar
          </Link>
        </div>
      </div>

      {createError && (
        <div className="mb-4">
          <ErrorComponent>{createError}</ErrorComponent>
        </div>
      )}

      <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-zinc-900">
        <h3 className="text-lg font-semibold mb-3">Novo baralho</h3>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 px-3 py-2 bg-transparent text-sm"
              placeholder="Título do Baralho. Ex: Matemática, Português, Geografia."
            />
          </div>

          <div>
            <ButtonComponent isLoading={isSubmitting}>
              {isSubmitting ? "Criando" : "Criar cartão"}
            </ButtonComponent>
          </div>
        </form>
      </div>
    </LayoutDashboard>
  );
}
