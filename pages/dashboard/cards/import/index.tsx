"use client";

import { useState, SubmitEvent, MouseEvent, useRef } from "react";
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
        Caso queira importar um arquivo do Anki, certifique-se de que no momento
        da exportação foi marcado a opção &quot;Incluir nome do baralho&quot; e
        foi exportado no formato txt.
      </p>

      <div className="rounded-2xl bg-white py-6 shadow-lg dark:bg-zinc-900">
        <ImportCardForm />
      </div>
    </LayoutDashboard>
  );
}

function parseAnkiFile(content: string) {
  const lines = content.trim().split("\n");
  const result: any[] = [];

  const config = {
    deckColumn: -1,
    separator: "\t",
  };

  const dataLines = lines.filter((line) => {
    if (line.startsWith("#")) {
      if (line.includes("deck column:")) {
        config.deckColumn = parseInt(line.split(":")[1]) - 1;
      }
      return false;
    }
    return true;
  });

  dataLines.forEach((line) => {
    const columns = line.split(config.separator);

    let deckName = "Padrão";
    let cardName = "";
    let cardDescription = "";

    if (config.deckColumn !== -1) {
      deckName = columns[config.deckColumn] || "Padrão";

      if (columns.length > 4) {
        cardName = columns[3];
        cardDescription = columns[4];
      } else {
        cardName = columns[1];
        cardDescription = columns[2];
      }
    } else {
      cardName = columns[0];
      cardDescription = columns[1];
    }

    if (cardName && cardDescription) {
      result.push({
        deck_name: deckName.trim(),
        name: cardName.trim(),
        description: cardDescription.trim(),
      });
    }
  });

  return result;
}

function ImportCardForm() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState(
    "Selecionar Arquivo (.txt) ou (.json)",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const fileInputRef = useRef<any>(null);

  const validateAndReadFile = async (file: File | null) => {
    if (!file) throw new Error("É necessário selecionar um arquivo!");

    const extension = file.name.split(".").pop();
    if (!["json", "txt"].includes(extension as string)) {
      throw new Error("É necessário selecionar um arquivo *.json ou *.txt!");
    }

    const content = await file.text();

    if (extension === "json") {
      return JSON.parse(content);
    }

    return parseAnkiFile(content);
  };

  const sanitizeContent = (text: string) => {
    if (!text) return "";
    return text
      .replace(/<br\s*\/?>/gi, "\n") // Converte <br> em \n[cite: 3]
      .replace(/<[^>]*>?/gm, ""); // Remove outras tags HTML
  };

  const prepareCardsForImport = (rawData: any) => {
    const cardsArray = Array.isArray(rawData) ? rawData : [rawData];

    return cardsArray.map((card) => ({
      name: sanitizeContent(card.name || card.cardName),
      description: sanitizeContent(card.description || card.cardDescription),
      deck_name: card.deck_name || card.deckName || "Padrão",
    }));
  };

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const rawData = await validateAndReadFile(file);

      const cardsToImport = prepareCardsForImport(rawData);

      const res = await fetch(`/api/v1/cards/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cardsToImport),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message || "Falha ao importar os cartões");
      }

      router.back();
    } catch (err: any) {
      setSubmitError(err.message || "Erro inesperado.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleFileChange = (e: any) => {
    setSubmitError(null);
    const selectedFile = e.target.files?.[0];
    const maxSize = 5 * 1024 * 1024; // 5MB em bytes

    if (selectedFile && selectedFile.size > maxSize) {
      setSubmitError("O arquivo é muito grande! O limite é de 5MB.");
      e.target.value = "";
      setFile(null);
      return;
    }

    setFile(selectedFile || null);
    setFileName(selectedFile.name);
  };

  function back(e: MouseEvent) {
    e.preventDefault();
    router.back();
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

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
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".txt,.json"
          className="hidden"
          disabled={isSubmitting}
        />

        <button
          type="button"
          onClick={handleButtonClick}
          disabled={isSubmitting}
          className="w-full text-left cursor-pointer rounded-md border border-zinc-200 dark:border-zinc-800 px-4 py-2 bg-zinc-100 dark:bg-zinc-900 text-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
        >
          {fileName}
        </button>
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
