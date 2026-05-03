import Head from "next/head";
import Link from "next/link";
import { ReactNode } from "react";

import Layout from "@/components/layout";
import Citation from "@/components/citation";
import { Article } from "@/types/types";

export default function ArticleComponent({
  article,
  children,
}: {
  article: Article;
  children: ReactNode;
}) {
  return (
    <Layout
      title={`${article.title} | MyFlashcard`}
      description={article.description}
    >
      <Head>
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={article.url} />
        <meta name="author" content={article.author} />
        <meta name="article:published_time" content={article.date} />
      </Head>
      <div className="mx-auto max-w-5xl px-6 py-12 flex flex-col md:flex-row gap-8">
        {/* Sidebar de tópicos */}
        <aside className="hidden md:block md:w-64 shrink-0">
          <nav className="sticky top-10 bg-white dark:bg-zinc-900 rounded-xl shadow p-4 border border-zinc-100 dark:border-zinc-800">
            <h2 className="text-sm font-semibold mb-3 text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Tópicos do artigo
            </h2>
            <ul className="space-y-2">
              {article.topics.map((topic) => (
                <li key={topic.id}>
                  <a
                    href={`#${topic.id}`}
                    className="block px-2 py-1 rounded-md text-zinc-700 dark:text-zinc-200 hover:bg-indigo-50 dark:hover:bg-zinc-800 transition underline"
                  >
                    {topic.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        {/* Conteúdo do artigo */}
        <article className="flex-1">
          <header className="mb-8">
            <h1 className="text-4xl font-extrabold leading-tight mb-2">
              {article.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400 mb-4">
              <span>
                Por <span className="font-semibold">{article.author}</span>
              </span>
              <span>•</span>
              <span>
                {new Date(article.date).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  timeZone: "UTC",
                })}
              </span>
            </div>
          </header>
          {children}
          <Citation article={article} />
          <Link
            href="/articles"
            className="inline-block mt-8 text-indigo-600 hover:underline font-medium"
          >
            ← Ver todos os artigos
          </Link>
        </article>
      </div>
    </Layout>
  );
}
