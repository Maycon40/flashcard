import { useSWRConfig } from "swr";
import { useState, MouseEvent, ReactNode } from "react";

import { Card } from "@/types/types";
import ConfirmDelete from "@/components/delete";
import CardComponent from "@/components/cards/card";

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
              <CardComponent
                key={card.id}
                card={card}
                setCardToDelete={setCardToDelete}
                mutate={mutate}
              />
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
