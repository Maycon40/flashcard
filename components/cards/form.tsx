import useSWR from "swr";
import { Dispatch, SetStateAction } from "react";

import { fetcher } from "@/infra/fetcher";
import { Deck } from "@/types/types";
import SearchableSelect from "@/components/search/select";

interface CardFormProps {
  deckName?: string;
  isSubmitting: boolean;
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  isImportant: boolean;
  setIsImportant: Dispatch<SetStateAction<boolean>>;
  description: string;
  setDescription: Dispatch<SetStateAction<string>>;
  selectedDeck: string;
  setSelectedDeck: Dispatch<SetStateAction<string>>;
}

export default function CardForm({
  deckName = "",
  isSubmitting,
  name,
  setName,
  isImportant,
  setIsImportant,
  description,
  setDescription,
  selectedDeck,
  setSelectedDeck,
}: CardFormProps) {
  const { data: decks } = useSWR<Deck[]>(`/api/v1/decks`, fetcher);

  return (
    <>
      <div>
        <label className="block text-sm font-medium mb-1">Baralho</label>
        <SearchableSelect
          decks={decks || []}
          selectedDeck={selectedDeck || (deckName as string) || ""}
          setSelectedDeck={setSelectedDeck}
          isSubmitting={isSubmitting}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Nome (Frente)</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 px-3 py-2 bg-transparent text-sm"
          placeholder="Título do cartão"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Descrição (Verso)
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 px-3 py-2 bg-transparent text-sm min-h-30"
          placeholder="Descrição ou resposta do cartão"
        />
      </div>

      <div className="flex items-center">
        <input
          id="important"
          name="important"
          type="checkbox"
          checked={isImportant}
          onChange={(e) => setIsImportant(e.target.checked)}
          className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label
          htmlFor="important"
          className="ml-2 block text-sm text-zinc-700 dark:text-zinc-300"
        >
          É um cartão importante?
        </label>
      </div>
    </>
  );
}
