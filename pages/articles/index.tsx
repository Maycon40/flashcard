import Link from "next/link";

import Layout from "@/components/layout";

const articles = [
  {
    slug: "o-que-sao-flashcards",
    title: "Flashcards: o que são e como funcionam?",
    excerpt:
      "Descubra o que são e como utilizar os flashcards para potencializar seus estudos.",
    date: "2026-04-28",
  },
  {
    slug: "prompt-criacao-flashcards",
    title: "Prompt para Criação de Flashcards",
    excerpt:
      "Utilize a Inteligência Artificial para criar flashcards de maneira rápida e eficiente.",
    date: "2026-05-13",
  },
  {
    slug: "markdown-latex-flashcards",
    title: "Domine o Markdown e LaTeX: O Guia para Flashcards Profissionais",
    excerpt:
      "Aprenda a elevar o nível técnico das suas descrições no MyFlashcard utilizando formatação avançada e fórmulas matemáticas com Markdown e LaTeX.",
    date: "2026-05-14",
  },
];

export default function Articles() {
  return (
    <Layout
      title="Artigos sobre Aprendizagem | MyFlashcard"
      description="Artigos de aprendizagem, flashcards e revisão espaçada."
    >
      <div className="mx-auto max-w-5xl px-6 py-12">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold leading-tight mb-2">
            Artigos
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Conteúdo para você aprender mais e melhor. Dicas sobre memorização,
            revisão espaçada e flashcards.
          </p>
        </header>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="group rounded-2xl bg-white dark:bg-zinc-900 shadow-md hover:shadow-lg transition-shadow border border-zinc-100 dark:border-zinc-800 p-6 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-bold mb-2 group-hover:text-indigo-600 transition-colors">
                  {article.title}
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                  {article.excerpt}
                </p>
              </div>
              <div className="flex items-center justify-between text-sm text-zinc-400 dark:text-zinc-500 mt-2">
                <span>
                  {new Date(article.date).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    timeZone: "UTC",
                  })}
                </span>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </Layout>
  );
}
