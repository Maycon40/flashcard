import { Dispatch, SetStateAction } from "react";

import { MarkdownViewer } from "@/components/markdown";
import { Card } from "@/types/types";

interface CardsReviewLayoutProps {
  card: Card | undefined;
  isSubmitting: boolean;
  isFlipped: boolean;
  setIsFlipped: Dispatch<SetStateAction<boolean>>;
  // eslint-disable-next-line no-unused-vars
  handleReview: (difficulty: string) => Promise<void>;
  className?: string;
}

export default function CardsReviewLayout({
  card,
  isSubmitting,
  isFlipped,
  setIsFlipped,
  handleReview,
  className,
}: CardsReviewLayoutProps) {
  return (
    <div
      className={`${className} rounded-2xl dark:bg-zinc-900 p-8 min-h-80 flex flex-col justify-center items-center text-center w-full`}
    >
      {!isFlipped ? (
        <div className="flex flex-col items-center gap-8">
          <h2 className="text-3xl font-bold">{card?.name}</h2>
          <button
            onClick={() => setIsFlipped(true)}
            className="inline-flex items-center px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Virar cartão
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6">
          <h2 className="text-2xl font-semibold">{card?.name}</h2>
          <div className="w-full border-t border-zinc-200 dark:border-zinc-700 my-2"></div>
          <MarkdownViewer
            value={card?.description || ""}
            clobberPrefix={`card-content`}
          />

          <div className="mt-6 w-full">
            <p className="text-sm text-zinc-500 mb-4">Como você se saiu?</p>
            <div className="flex justify-center flex-wrap gap-4">
              <button
                onClick={() => handleReview("wrong")}
                disabled={isSubmitting}
                className="px-5 py-3 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed"
              >
                Errei
              </button>
              <button
                onClick={() => handleReview("easy")}
                disabled={isSubmitting}
                className="px-5 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                Fácil
              </button>
              <button
                onClick={() => handleReview("very easy")}
                disabled={isSubmitting}
                className="px-5 py-3 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed"
              >
                Muito fácil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
