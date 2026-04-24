import useSWR from "swr";
import { MouseEvent, useMemo, useState } from "react";
import { useRouter } from "next/router";

import Layout from "@/components/layout";
import { fetcher } from "@/infra/fetcher";
import ErrorComponent from "@/components/error";
import { Card } from "@/types/types";
import { sliceText } from "@/components/cards/card";
import SuccessComponent from "@/components/success";
import SearchBar from "@/components/search/bar";

export default function LibraryPage() {
  const { query } = useRouter();
  const { deck_id: deckId } = query;

  const {
    data: cards,
    error,
    isLoading,
  } = useSWR<Card[]>(`/api/v1/library/decks/${deckId}`, fetcher);

  const [searchQuery, setSearchQuery] = useState("");
  const [libraryError, setLibraryError] = useState<string | null>(null);
  const [librarySuccess, setLibrarySuccess] = useState<string | null>(null);

  const filteredCards = useMemo(() => {
    if (!cards) return [];
    const query = searchQuery.toLowerCase();
    return cards.filter(
      (card) =>
        card.name?.toLowerCase().includes(query) ||
        card.description?.toLowerCase().includes(query),
    );
  }, [cards, searchQuery]);

  if (error) {
    return (
      <Layout
        title="Biblioteca de Flashcards | MyFlashcard"
        description="Encontre cartões prontos para acelerar seu aprendizado."
      >
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-center">
          <section className="flex flex-col items-center">
            <h2 className="text-4xl font-extrabold leading-tight mb-4">
              Biblioteca Comunitária
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-6">
              Encontre cartões prontos para acelerar seu aprendizado.
            </p>
            <ErrorComponent>{error.message}</ErrorComponent>
          </section>
        </div>
      </Layout>
    );
  }

  if (isLoading || !query) {
    return (
      <Layout
        title="Biblioteca de Flashcards | MyFlashcard"
        description="Encontre cartões prontos para acelerar seu aprendizado."
      >
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-center">
          <section className="flex flex-col items-center">
            <h2 className="text-4xl font-extrabold leading-tight mb-4">
              Biblioteca Comunitária
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-6">
              Encontre cartões prontos para acelerar seu aprendizado.
            </p>
            <div className="animate-pulse">
              <div className="w-200 h-24 rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
            </div>
          </section>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title="Biblioteca de Flashcards | MyFlashcard"
      description="Encontre cartões prontos para acelerar seu aprendizado."
    >
      <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-center">
        <section className="flex flex-col items-center">
          <h2 className="text-4xl font-extrabold leading-tight mb-4">
            Biblioteca Comunitária
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-6">
            Encontre cartões prontos para acelerar seu aprendizado.
          </p>

          <SearchBar
            className="mb-4"
            value={searchQuery}
            onChange={(e: any) => setSearchQuery(e.target.value)}
          />

          {libraryError && <ErrorComponent>{libraryError}</ErrorComponent>}

          {librarySuccess && (
            <SuccessComponent>{librarySuccess}</SuccessComponent>
          )}

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
            {(filteredCards || []).map((card) => (
              <CardComponent
                key={card.id}
                card={card}
                setLibraryError={setLibraryError}
                setLibrarySuccess={setLibrarySuccess}
              />
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}

function CardComponent({
  card,
  setLibraryError,
  setLibrarySuccess,
}: {
  card: Card;
  setLibraryError: any;
  setLibrarySuccess: any;
}) {
  const [isImporting, setIsImporting] = useState(false);

  async function importCard(e: MouseEvent<HTMLButtonElement>, card: Card) {
    e.preventDefault();

    setIsImporting(true);
    setLibraryError(null);
    setLibrarySuccess(null);

    try {
      const response = await fetch("/api/v1/user");

      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        setIsImporting(false);
        setLibraryError("Você precisa estar logado para realizar essa ação.");
        return;
      }

      if (body.username != card.username) {
        const res = await fetch(`/api/v1/cards/import`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: card.name,
            description: card.description,
            deck_name: card.deck_name,
          }),
        });

        if (!res.ok) {
          const resBody = await res.json().catch(() => ({}));

          if (resBody.message == "Todos os cartões já foram importados.") {
            resBody.message = "O cartão já foi importado!";
          }

          setLibraryError(resBody.message || "Ocorreu um erro ao importar.");
          setIsImporting(false);
          return;
        }
      }

      setLibrarySuccess("Cartão importado com sucesso!");
      setIsImporting(false);
      setTimeout(() => setLibrarySuccess(null), 2000);
    } catch (err: any) {
      setLibraryError(err?.message || "Erro de rede.");
      setIsImporting(false);
    }
  }

  return (
    <div
      key={card.id}
      className="rounded-lg border border-zinc-100 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900 flex flex-col justify-between"
    >
      <div>
        <div className="flex justify-between items-start">
          <div className="flex-1 mr-2">
            <h3 className="font-semibold">{card.name}</h3>
          </div>
        </div>
        <p className="text-sm text-zinc-500 mt-3">
          {sliceText(card.description as string)}
        </p>
        <p className="text-xs text-zinc-400 mt-2">
          {card.username && `Criado por: ${card.username}`}
        </p>
      </div>
      <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center">
        {isImporting && (
          <div className="flex justify-center items-center mx-2">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
          </div>
        )}
        <button
          type="button"
          onClick={(e) => importCard(e, card)}
          className="mr-5 text-sm font-medium text-indigo-600 hover:underline cursor-pointer"
          disabled={isImporting}
        >
          {isImporting ? "Importando" : "Importar"}
        </button>
      </div>
    </div>
  );
}
