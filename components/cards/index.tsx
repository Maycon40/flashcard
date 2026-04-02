import { useSWRConfig } from "swr";
import { useState, MouseEvent, ReactNode } from "react";

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
                  <h3 className="font-semibold">{card.name}</h3>
                  <CardImportant important={card.important} />
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
