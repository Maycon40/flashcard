import { useState, MouseEvent, useEffect, useRef } from "react";
import Link from "next/link";

import { Card } from "@/types/types";
import TagComponent from "@/components/cards/tag";

export function sliceText(text: string) {
  if (text.length > 300) {
    return text.slice(0, 300) + "...";
  }

  return text;
}

export default function CardComponent({
  card,
  setCardToDelete,
  mutate,
}: {
  card: Card;
  setCardToDelete: any;
  mutate: any;
}) {
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

  async function exportCard(e: MouseEvent) {
    e.preventDefault();

    const jsonString = JSON.stringify(
      {
        name: card.name,
        description: card.description,
        deck_name: card.deck_name,
      },
      null,
      2,
    );

    setOpenMenuId(null);

    const blob = new Blob([jsonString], { type: "application/json" });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `cartão-${card.name}.json`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  async function publish(e: MouseEvent) {
    e.preventDefault();

    await fetch(`/api/v1/cards/id/${card.id as string}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        public: card.published_at ? false : true,
      }),
    });

    await mutate(
      (key: any) => typeof key === "string" && key.includes("/api/v1/cards"),
      undefined,
      { revalidate: true },
    );
  }

  return (
    <div className="rounded-lg border border-zinc-100 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start">
          <div className="flex-1 mr-2">
            <h3 className="font-semibold">{card.name}</h3>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <TagComponent
              active={card.published_at ? true : false}
              className="bg-green-200 text-green-600 dark:bg-green-900/50 dark:text-green-400"
            >
              <span>P</span>
              <span className="hidden lg:inline">ublicado</span>
            </TagComponent>
            <TagComponent
              active={card.important}
              className="bg-yellow-200 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-400"
            >
              <span>I</span>
              <span className="hidden lg:inline">mportante</span>
            </TagComponent>
            <div
              className="relative"
              ref={openMenuId === String(card.id) ? menuRef : null}
            >
              <button
                type="button"
                className="p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
                onClick={() =>
                  setOpenMenuId(
                    openMenuId === String(card.id) ? null : String(card.id),
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
        <p className="text-sm text-zinc-500 mt-3">
          {sliceText(card.description as string)}
        </p>
        <p className="text-xs text-zinc-400 mt-2">
          {card.deck_name && `Baralho: ${card.deck_name}`}
        </p>
      </div>
      <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <button
          type="button"
          className="mr-5 text-sm font-medium text-indigo-600 hover:underline cursor-pointer"
          onClick={(e) => publish(e)}
        >
          {card.published_at ? "Privar" : "Publicar"}
        </button>
        <div>
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
    </div>
  );
}
