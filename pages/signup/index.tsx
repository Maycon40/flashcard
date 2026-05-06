"use client";

import { useRouter } from "next/router";
import { useState, SubmitEvent } from "react";
import Link from "next/link";

import Layout from "@/components/layout";
import ButtonComponent from "@/components/button";
import ErrorComponent from "@/components/error";

export default function SignupPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [touched, setTouched] = useState(false);
  const [errorAction, setErrorAction] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    setTouched(true);
    setErrorAction(null);

    if (password !== confirmPassword) {
      setErrorAction("As senhas não coincidem.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const responseBody = await response.json().catch(() => ({}));

      if (response.ok) {
        router.push("/signup/success");
      } else {
        setErrorAction(
          responseBody?.message + " " + responseBody?.action ||
            "Falha ao criar a conta.",
        );
      }
    } catch (err: any) {
      setErrorAction(err?.message || "Erro de rede. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const passwordsMatch = password === confirmPassword;
  const isDisabled =
    !username ||
    !email ||
    !password ||
    !confirmPassword ||
    passwordsMatch === false ||
    isSubmitting;

  return (
    <Layout
      title="Criar Conta | MyFlashcard"
      description="Crie sua conta no MyFlashcard"
    >
      <main className="mx-auto max-w-3xl px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-3xl font-extrabold mb-4">Crie sua conta</h1>
            <p className="hidden md:block text-zinc-600 dark:text-zinc-400 mb-6">
              Comece a criar e revisar seus flashcards com revisão espaçada e
              retenção otimizada.
            </p>
            <ul className="hidden md:block space-y-3 text-zinc-700 dark:text-zinc-300">
              <li className="flex gap-3">
                <span className="text-indigo-600 font-bold">•</span>
                <span>Sincronize seu progresso</span>
              </li>
              <li className="flex gap-3">
                <span className="text-indigo-600 font-bold">•</span>
                <span>Crie baralhos personalizados</span>
              </li>
              <li className="flex gap-3">
                <span className="text-indigo-600 font-bold">•</span>
                <span>Revisão inteligente baseada em evidências</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl bg-white dark:bg-zinc-900 p-8 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Cadastro</h3>
            {errorAction && <ErrorComponent>{errorAction}</ErrorComponent>}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Usuário
                </label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  name="username"
                  required
                  className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 px-3 py-2 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Seu nome de usuário"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  name="email"
                  required
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
                  required
                  className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 px-3 py-2 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Crie uma senha"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Confirme a senha
                </label>
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() => setTouched(true)}
                  type="password"
                  name="confirmPassword"
                  required
                  className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 px-3 py-2 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Repita a senha"
                />

                {touched && !passwordsMatch && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    As senhas não coincidem.
                  </p>
                )}
              </div>

              <div className="pt-2">
                <ButtonComponent
                  className="w-full justify-center"
                  disabled={isDisabled}
                  isLoading={isSubmitting}
                >
                  {isSubmitting ? "Criando" : "Criar conta"}
                </ButtonComponent>
              </div>

              <div className="pt-4 text-center text-sm text-zinc-600 dark:text-zinc-400">
                <span>Já tem conta? </span>
                <Link href="/login" className="text-indigo-600 hover:underline">
                  Entre aqui
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </Layout>
  );
}
