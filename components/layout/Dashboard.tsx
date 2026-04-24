"use client";

import { useState, ReactNode, MouseEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import ConfirmLogout from "@/components/logout";

interface Props {
  children: ReactNode;
}

export default function LayoutDashboard({ children }: Props) {
  const router = useRouter();

  const [logoutState, setLogoutState] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  async function logout(e: MouseEvent) {
    e.preventDefault();

    await fetch(`/api/v1/sessions`, {
      method: "DELETE",
    });

    router.push("/");
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50 font-sans">
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-zinc-50 dark:bg-black shadow flex items-center justify-between px-4 h-14">
        <div className="lg:hidden fixed top-4 left-3 right-3 z-30 rounded-2xl bg-white dark:bg-zinc-900 shadow-gray-500 dark:shadow-black shadow-sm dark:shadow-md flex items-center justify-between px-4 h-17">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-md bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
              FC
            </div>
            <span className="font-semibold text-base">
              <Link href="/dashboard" className="text-sm font-semibold">
                MyFlashcard
              </Link>
            </span>
          </div>
          <button
            className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Abrir menu"
            onClick={() => setMobileMenuOpen((v) => !v)}
          >
            <span className="block w-6 h-0.5 bg-zinc-700 dark:bg-zinc-200 mb-1"></span>
            <span className="block w-6 h-0.5 bg-zinc-700 dark:bg-zinc-200 mb-1"></span>
            <span className="block w-6 h-0.5 bg-zinc-700 dark:bg-zinc-200"></span>
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 top-18 z-40 bg-black/40"
          onClick={() => setMobileMenuOpen(false)}
        >
          <nav
            className="absolute rounded-b-2xl top-0 left-3 right-3 bg-white dark:bg-zinc-900 shadow-md p-6 space-y-2"
            onClick={(e) => e.stopPropagation()}
          >
            <Link
              href="/dashboard"
              className="block rounded-md px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              Painel
            </Link>
            <Link
              href="/dashboard/decks"
              className="block rounded-md px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              Meus baralhos
            </Link>
            <Link
              href="/dashboard/cards"
              className="block rounded-md px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              Meus cartões
            </Link>
            <Link
              href="/library"
              className="block rounded-md px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              Biblioteca
            </Link>
            <Link
              href="/dashboard/profile"
              className="block rounded-md px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              Perfil
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setLogoutState(true);
              }}
              className="w-full text-left block rounded-md px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-red-600 cursor-pointer"
            >
              Sair
            </button>
          </nav>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 lg:px-6 pt-16 lg:pt-0">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 py-8">
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-6 rounded-lg bg-white dark:bg-zinc-900 p-4 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="h-8 w-8 rounded-md bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  FC
                </div>
                <div>
                  <Link href="/dashboard" className="text-md font-semibold">
                    MyFlashcard
                  </Link>
                </div>
              </div>

              <nav className="space-y-1 text-sm">
                <Link
                  href="/dashboard"
                  className="block rounded-md px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Painel
                </Link>
                <Link
                  href="/dashboard/decks"
                  className="block rounded-md px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Meus baralhos
                </Link>
                <Link
                  href="/dashboard/cards"
                  className="block rounded-md px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Meus cartões
                </Link>
                <Link
                  href="/library"
                  className="block rounded-md px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Biblioteca
                </Link>
                <Link
                  href="/dashboard/profile"
                  className="block rounded-md px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Perfil
                </Link>
                <button
                  onClick={() => setLogoutState(true)}
                  className="w-full text-left block rounded-md px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-red-600 cursor-pointer"
                >
                  Sair
                </button>
              </nav>
            </div>
          </aside>

          <ConfirmLogout
            logout={logoutState}
            setLogout={setLogoutState}
            callback={(e: MouseEvent) => logout(e)}
          >
            Você tem certeza que deseja <strong>sair</strong>?
          </ConfirmLogout>

          <main className="lg:col-span-5">
            <div className="rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-lg">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
