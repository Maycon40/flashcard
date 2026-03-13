"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Layout from "@/components/Layout";
import { withLogin } from "@/infra/auth";

export const getServerSideProps = withLogin();

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [errorAction, setErrorAction] = useState<string | null>(null);

  const router = useRouter();

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorAction(null);

    try {
      const response = await fetch("/api/v1/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: identifier,
          password: password,
        }),
      });

      const responseBody = await response.json().catch(() => ({}));

      if (response.status === 201) {
        setErrorAction(null);
        router.push("/dashboard");
      } else {
        const action =
          responseBody?.action ||
          responseBody?.message ||
          "Falha ao autenticar.";
        setErrorAction(action);
      }
    } catch (err: any) {
      setErrorAction(err?.message || "Erro de rede");
    }
  }

  return (
    <Layout>
      <main className="mx-auto max-w-3xl px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-extrabold mb-4">
              Faça login e continue aprendendo
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
              Acesse seus baralhos, acompanhe progresso e estude com revisão
              espaçada onde estiver.
            </p>
            <ul className="space-y-3 text-zinc-700 dark:text-zinc-300">
              <li className="flex gap-3">
                <span className="text-indigo-600 font-bold">•</span>
                <span>Sincronize progresso entre dispositivos</span>
              </li>
              <li className="flex gap-3">
                <span className="text-indigo-600 font-bold">•</span>
                <span>Crie e compartilhe baralhos</span>
              </li>
              <li className="flex gap-3">
                <span className="text-indigo-600 font-bold">•</span>
                <span>Use técnicas baseadas em evidências para memorizar</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl bg-white dark:bg-zinc-900 p-8 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Entrar</h3>
            {errorAction && (
              <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {errorAction}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  type="text"
                  name="identifier"
                  className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 px-3 py-2 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="seu@email.com ou usuario"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Senha</label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  name="password"
                  className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 px-3 py-2 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Sua senha"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <span>Manter-me conectado</span>
                </label>

                <Link
                  href="/forgot"
                  className="text-indigo-600 hover:underline"
                >
                  Esqueci a senha
                </Link>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full inline-flex justify-center items-center px-4 py-2 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700"
                >
                  Entrar
                </button>
              </div>

              <div className="pt-4 text-center text-sm text-zinc-600 dark:text-zinc-400">
                <span>Não tem conta? </span>
                <Link
                  href="/signup"
                  className="text-indigo-600 hover:underline"
                >
                  Crie uma aqui
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </Layout>
  );
}
