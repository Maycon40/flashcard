import CopyButton from "@/components/button/copy";
import { Article } from "@/types/types";

export default function Citation({ article }: { article: Article }) {
  const formatAuthor = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length <= 1) return name.toUpperCase();
    const lastName = parts.pop()?.toUpperCase();
    return `${lastName}, ${parts.join(" ")}`;
  };

  const rawDate = new Date(article.date);
  const formatedDate = rawDate.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

  const citation = `${formatAuthor(article.author)}. ${article.title}. MyFlashcard, ${rawDate.getFullYear()}. Disponível em: ${article.url}. Acesso em: ${formatedDate}.`;

  return (
    <section className="mt-12 border-t pt-6 border-zinc-200 dark:border-zinc-800">
      <div
        className="bg-zinc-200 dark:bg-zinc-900 rounded-lg p-4 text-sm text-zinc-600 dark:text-zinc-400 
                  flex items-center justify-between gap-4"
      >
        <div className="min-w-0 flex-1">
          <span className="block mb-2 font-semibold text-zinc-700 dark:text-zinc-200">
            Como citar este artigo:
          </span>
          <code className="block bg-zinc-100 dark:bg-zinc-800 rounded px-2 py-1 text-xs break-all whitespace-pre-wrap">
            {citation}
          </code>
        </div>

        <div className="flex justify-end">
          <CopyButton>{citation}</CopyButton>
        </div>
      </div>
    </section>
  );
}
