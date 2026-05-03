"use client";

import {
  useState,
  useMemo,
  useRef,
  useEffect,
  SetStateAction,
  Dispatch,
} from "react";

import { Deck } from "@/types/types";

interface SearchableSelectProps {
  decks: Deck[];
  selectedDeck: string;
  setSelectedDeck: Dispatch<SetStateAction<string>>;
  isSubmitting: boolean;
}

export default function SearchableSelect({
  decks,
  selectedDeck,
  setSelectedDeck,
  isSubmitting,
}: SearchableSelectProps) {
  const [searchTerm, setSearchTerm] = useState(selectedDeck || "");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredDecks = useMemo(() => {
    if (!searchTerm) return decks;
    return decks.filter((d) =>
      d.name?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm, decks]);

  const handleSelect = (name: string) => {
    setSelectedDeck(name);
    setSearchTerm(name);
    setIsOpen(false);
  };

  const handleClear = () => {
    setSelectedDeck("");
    setSearchTerm("");
    setIsOpen(true);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative">
        <input
          id="deck"
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Pesquisar baralho..."
          disabled={isSubmitting}
          className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 px-3 py-2 bg-transparent text-sm pr-10 outline-none focus:ring-2 focus:ring-blue-500"
        />

        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            ✕
          </button>
        )}
      </div>

      {isOpen && !isSubmitting && (
        <ul className="absolute z-10 mt-1 max-height-60 w-full overflow-auto rounded-md border border-zinc-200 bg-white dark:bg-zinc-900 dark:border-zinc-800 py-1 text-sm shadow-lg max-h-60">
          {filteredDecks.length > 0 ? (
            filteredDecks.map((d) => (
              <li
                key={d.id || d.name}
                onClick={() => handleSelect(d.name as string)}
                className="cursor-pointer px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              >
                {d.name}
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-zinc-500 italic">
              Nenhum resultado encontrado
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
