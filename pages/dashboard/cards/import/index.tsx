"use client";

import { useState, SubmitEvent, MouseEvent } from "react";
import { useRouter } from "next/router";

import LayoutDashboard from "@/components/layout/Dashboard";
import ErrorComponent from "@/components/error";
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

    try {
      const content = await file.text();
      const data = JSON.parse(content);

      const cardsToImport = Array.isArray(data) ? data : [data];

      const res = await fetch(`/api/v1/cards/import`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cardsToImport),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setSubmitError(body?.message || `Falha ao importar os cartãos`);
        setIsSubmitting(false);
        return;
      }

      router.back();
    } catch (err: any) {
      setSubmitError(err?.message || "Erro de rede.");
      setIsSubmitting(false);
    }
  }

  const handleFileChange = (e: any) => {
    setSubmitError(null);
    const selectedFile = e.target.files?.[0];
    const maxSize = 5 * 1024 * 1024; // 5MB em bytes

    if (selectedFile && selectedFile.size > maxSize) {
      setSubmitError("O arquivo é muito grande! O limite é de 5MB.");
      e.target.value = ""; // Limpa o input
      setFile(null);
      return;
    }

    setFile(selectedFile || null);
  };

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
          onChange={(e) => handleFileChange(e)}
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
