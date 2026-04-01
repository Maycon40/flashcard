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

  async function logout(e: MouseEvent) {
    e.preventDefault();

    await fetch(`/api/v1/sessions`, {
      method: "DELETE",
    });

    router.push("/");
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50 font-sans">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 py-8">
          <aside className="md:col-span-1">
            <div className="sticky top-6 rounded-lg bg-white dark:bg-zinc-900 p-4 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-md bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  FC
                </div>
                <div>
                  <Link href="/" className="text-sm font-semibold">
                    Flashcard
                  </Link>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">
                    Dashboard
                  </div>
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

          <section className="md:col-span-5">
            <div className="rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-lg">
              {children}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
