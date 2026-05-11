import useSWR from "swr";
import { MouseEvent, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import Layout from "@/components/layout";
import { fetcher } from "@/infra/fetcher";
import ErrorComponent from "@/components/error";
import { Card } from "@/types/types";
import SuccessComponent from "@/components/success";

import { User, CalendarDays, Layers } from "lucide-react";
import CardsReviewLayout from "@/components/cards/review/layout";

export default function LibraryCardPage() {
  const { query } = useRouter();
  const { deck_id: deckId, card_id: cardId } = query;

  const {
    data: card,
    error,
    isLoading: CardLoading,
  } = useSWR<Card>(`/api/v1/library/decks/${deckId}/card/${cardId}`, fetcher);

  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [libraryError, setLibraryError] = useState<string | null>(null);
  const [librarySuccess, setLibrarySuccess] = useState<string | null>(null);

  async function importCard(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    setIsLoading(true);
    setLibraryError(null);
    setLibrarySuccess(null);

    try {
      const response = await fetch("/api/v1/user");

      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        setIsLoading(false);
        setLibraryError("Você precisa estar logado para realizar essa ação.");
        return;
      }

      if (body.username != card?.username) {
        const res = await fetch(`/api/v1/cards/import`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: card?.name,
            description: card?.description,
            deck_name: card?.deck_name,
          }),
        });

        if (!res.ok) {
          const resBody = await res.json().catch(() => ({}));

          if (resBody.message == "Todos os cartões já foram importados.") {
            resBody.message = "O cartão já foi importado!";
          }

          setLibraryError(resBody.message || "Ocorreu um erro ao importar.");
          setIsLoading(false);
          return;
        }
      }

      setLibrarySuccess("Cartão importado com sucesso!");
      setIsLoading(false);
      setTimeout(() => setLibrarySuccess(null), 2000);
    } catch (err: any) {
      setLibraryError(err?.message || "Erro de rede.");
      setIsLoading(false);
    }
  }

  if (error) {
    return (
      <Layout
        title="Biblioteca de Flashcards | MyFlashcard"
        description="Encontre cartões prontos para acelerar seu aprendizado."
      >
        <div className="mx-auto max-w-5xl px-6 py-8 flex items-center justify-center">
          <section className="flex flex-col items-center">
            <h1 className="text-4xl font-extrabold leading-tight mb-4 text-indigo-700 dark:text-indigo-400">
              Biblioteca Comunitária
            </h1>
            <ErrorComponent>{error.message}</ErrorComponent>
          </section>
        </div>
      </Layout>
    );
  }

  if (CardLoading || !query) {
    return (
      <Layout
        title="Biblioteca de Flashcards | MyFlashcard"
        description="Encontre cartões prontos para acelerar seu aprendizado."
      >
        <div className="mx-auto max-w-5xl px-6 py-8 flex items-center justify-center">
          <section className="flex flex-col items-center">
            <h1 className="text-4xl font-extrabold leading-tight mb-4 text-indigo-700 dark:text-indigo-400">
              Biblioteca Comunitária
            </h1>
            <div className="animate-pulse">
              <div className="w-[80vw] sm:w-[50vw] h-24 rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
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
      <div className="mx-auto max-w-3xl px-6 py-8 flex items-center justify-center">
        <section className="flex flex-col items-center w-full">
          <h1 className="text-4xl font-extrabold leading-tight mb-4 text-indigo-700 dark:text-indigo-400">
            Biblioteca Comunitária
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
            Veja detalhes do cartão compartilhado pela comunidade.
          </p>

          <div className="mb-6 text-center">
            <ErrorComponent>{libraryError}</ErrorComponent>
            <SuccessComponent>{librarySuccess}</SuccessComponent>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-x-4 mb-8 w-full">
            <div className="w-full bg-emerald-50 dark:bg-emerald-950 rounded-xl shadow border border-emerald-100 dark:border-emerald-900 p-4 mb-4 flex items-center gap-3">
              <Layers className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              <span className="text-zinc-700 dark:text-zinc-200">
                <span className="font-semibold">Baralho:</span>{" "}
                {card?.deck_name}
              </span>
            </div>
            <div className="w-full bg-orange-50 dark:bg-orange-950 rounded-xl shadow border border-orange-100 dark:border-orange-900 p-4 mb-4 flex items-center gap-3">
              <User className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              <span className="text-zinc-700 dark:text-zinc-200">
                <span className="font-semibold">Autor:</span> {card?.username}
              </span>
            </div>
            <div className="w-full bg-blue-50 dark:bg-blue-950 rounded-xl shadow border border-blue-100 dark:border-blue-900 p-4 mb-4 flex items-center gap-3">
              <CalendarDays className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <span className="text-zinc-700 dark:text-zinc-200">
                <span className="font-semibold">Publicado em:</span>{" "}
                {card?.published_at
                  ? new Date(card.published_at).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "--"}
              </span>
            </div>
          </div>

          <CardsReviewLayout
            card={card}
            isSubmitting={false}
            isFlipped={isFlipped}
            setIsFlipped={setIsFlipped}
            // eslint-disable-next-line no-unused-vars
            handleReview={async (difficulty: string) => setIsFlipped(false)}
            className="shadow-xl"
          />

          <div className="w-full flex justify-end mt-8">
            <button
              type="submit"
              disabled={isLoading}
              className={`inline-flex items-center px-4 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed cursor-pointer transition-colors`}
              onClick={(e) => importCard(e)}
            >
              {isLoading && (
                <div className="flex justify-center items-center mr-4">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                </div>
              )}
              {isLoading ? "Importando" : "Importar"}
            </button>
          </div>

          <Link
            href={`/library/decks/${deckId}`}
            className="inline-block mt-8 text-indigo-600 hover:underline font-medium"
          >
            ← Ver baralho
          </Link>
        </section>
      </div>
    </Layout>
  );
}
