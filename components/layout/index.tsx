"use client";

import React from "react";
import Link from "next/link";
import Head from "next/head";

interface LayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function Layout({ title, description, children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50 font-sans">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <Link href="/" className="flex items-center gap-2 md:gap-3">
              <div className="h-8 w-8 md:h-10 md:w-10 rounded-md bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-base text-white font-bold">
                FC
              </div>
              <p className="text-base md:text-lg font-semibold">Flashcard</p>
            </Link>
          </div>

          <nav className="flex items-center gap-2 md:gap-3 ml-3">
            <Link
              href="/login"
              className="px-3 py-2 rounded-md border border-zinc-800 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              Entrar
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-3 md:px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
            >
              Criar conta
            </Link>
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800 mt-12">
        <div className="mx-auto max-w-5xl px-6 py-6 text-sm text-zinc-600 dark:text-zinc-400">
          <p>
            Flashcard — aprenda com recuperação ativa e revisão espaçada.
            Pequenos passos, memórias duradouras.
          </p>
        </div>
      </footer>
    </div>
  );
}
