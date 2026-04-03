import { useSWRConfig } from "swr";
import { useState, MouseEvent, ReactNode, useEffect, useRef } from "react";

import { Card } from "@/types/types";
import Link from "next/link";
import ConfirmDelete from "../delete";

function sliceText(text: string) {
  if (text.length > 300) {
    return text.slice(0, 300) + "...";
  }

  return text;
}

export default function Cards({ cards }: { cards: Card[] }): ReactNode {
  const { mutate } = useSWRConfig();

  const [cardToDelete, setCardToDelete] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    }

    if (openMenuId) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuId]);

  async function deleteCard(e: MouseEvent, cardId: string) {
    e.preventDefault();

    await fetch(`/api/v1/cards/id/${cardId}`, {
      method: "DELETE",
    });

    await mutate(
      (key: any) => typeof key === "string" && key.includes("/api/v1/cards"),
      undefined,
      { revalidate: true },
    );

    setCardToDelete(null);
  }

  async function exportCard(e: MouseEvent) {
    e.preventDefault();

    const card = cards.filter((card) => card.id === openMenuId);

    const jsonString = JSON.stringify(
      {
        name: card[0].name,
        description: card[0].description,
        important: card[0].important,
        deck_name: card[0].deck_name,
      },
      null,
      2,
    );

    setOpenMenuId(null);

    const blob = new Blob([jsonString], { type: "application/json" });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `cartão-${card[0].name}.json`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  return (
    <>
      <ConfirmDelete
        deleteState={cardToDelete}
        setDeleteState={setCardToDelete}
        callback={(e: any) => deleteCard(e, cardToDelete as string)}
      >
        Você tem certeza que deseja excluir esse cartão? Esta ação não pode ser
        desfeita.
      </ConfirmDelete>

      <section className="space-y-6">
        {cards && cards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cards.map((card) => (
              <div
                key={card.id}
                className="rounded-lg border border-zinc-100 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 mr-2">
                    <h3 className="font-semibold">{card.name}</h3>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <CardImportant important={card.important} />
                    <div
                      className="relative"
                      ref={openMenuId === String(card.id) ? menuRef : null}
                    >
                      <button
                        type="button"
                        className="p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId === String(card.id)
                              ? null
                              : String(card.id),
                          )
                        }
                        aria-label="Opções do cartão"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>

                      {openMenuId === String(card.id) && (
                        <div className="absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 z-20 overflow-hidden">
                          <Link
                            href={`/dashboard/cards/review/${card.id}`}
                            className="w-full block px-4 py-2 text-left text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                            onClick={() => setOpenMenuId(null)}
                          >
                            Revisar
                          </Link>
                          <button
                            type="button"
                            onClick={(e) => exportCard(e)}
                            className="w-full block px-4 py-2 text-left text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                          >
                            Exportar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-zinc-500 mt-1">
                  {sliceText(card.description as string)}
                </p>
                <p className="text-xs text-zinc-400 mt-2">
                  {card.deck_name && `Baralho: ${card.deck_name}`}
                </p>
                <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-end">
                  <Link
                    href={`/dashboard/cards/edit/${card.id}`}
                    className="mr-5 text-sm font-medium text-indigo-600 hover:underline"
                  >
                    Editar
                  </Link>
                  <button
                    type="button"
                    className="text-sm font-medium text-indigo-600 hover:underline cursor-pointer"
                    onClick={() => setCardToDelete(card.id as string)}
                  >
                    Deletar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-8 text-center shadow-lg dark:bg-zinc-900">
            <p className="text-zinc-600 dark:text-zinc-400">
              Nenhum cartão encontrado.
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              Clique em <strong>Criar</strong> para adicionar o primeiro cartão.
            </p>
          </div>
        )}
      </section>
    </>
  );
}

function CardImportant({ important }: { important: boolean | undefined }) {
  return (
    <>
      {important && (
        <span className="text-xs font-bold text-yellow-500 bg-yellow-100 dark:bg-yellow-900/50 dark:text-yellow-400 px-2 py-1 rounded-full">
          Importante
        </span>
      )}
    </>
  );
}
