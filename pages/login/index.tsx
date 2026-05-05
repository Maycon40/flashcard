"use client";

import { useSWRConfig } from "swr";
import { useState, SubmitEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import Layout from "@/components/layout";
import ButtonComponent from "@/components/button";

export default function LoginPage() {
  const { mutate } = useSWRConfig();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errorAction, setErrorAction] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    setErrorAction(null);
    setIsSubmitting(true);

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
        mutate(() => true, undefined, { revalidate: true });
        setIsSubmitting(false);
        router.push("/dashboard");
      } else {
        const action =
          responseBody?.message + " " + responseBody?.action ||
          "Falha ao autenticar.";
        setErrorAction(action);
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setErrorAction(err?.message || "Erro de rede");
      setIsSubmitting(false);
    }
  }

  const isDisabled = !identifier || !password || isSubmitting;

  return (
    <Layout title="Login | MyFlashcard" description="Faça login no MyFlashcard">
      <main className="mx-auto max-w-3xl px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-3xl font-extrabold mb-4">
              Faça login e continue aprendendo
            </h1>
            <p className="hidden md:block text-zinc-600 dark:text-zinc-400 mb-6">
              Acesse seus baralhos, acompanhe progresso e estude com revisão
              espaçada onde estiver.
            </p>
            <ul className="hidden md:block space-y-3 text-zinc-700 dark:text-zinc-300">
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
                  placeholder="seu@email.com"
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
                <Link
                  href="/recovery"
                  className="text-indigo-600 hover:underline"
                >
                  Esqueci a senha
                </Link>
              </div>

              <div className="pt-2">
                <ButtonComponent
                  className="w-full justify-center"
                  disabled={isDisabled}
                  isLoading={isSubmitting}
                >
                  {isSubmitting ? "Entrando" : "Entrar"}
                </ButtonComponent>
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
