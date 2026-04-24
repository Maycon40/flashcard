import { SubmitEvent, useState } from "react";

import Layout from "@/components/layout";
import Link from "next/link";

export default function RecoveryPage() {
  const [identifier, setIdentifier] = useState("");
  const [errorAction, setErrorAction] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorAction(null);

    try {
      const response = await fetch("/api/v1/recovery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: identifier,
        }),
      });

      const responseBody = await response.json().catch(() => ({}));

      if (response.status === 201) {
        setErrorAction(null);
        setSuccess(true);
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
    <Layout
      title="Alteração de senha | MyFlashcard"
      description="Altere sua senha no MyFlashcard"
    >
      <main className="mx-auto max-w-3xl px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-extrabold mb-4">
              Recuperação de senha
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
              Insira o seu email para recuperar a senha
            </p>
          </div>
          {success ? (
            <div className="rounded-2xl bg-white dark:bg-zinc-900 p-8 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Email enviado!</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Foi enviado um email com o link para recuperação da senha!
              </p>
              <div className="mt-6">
                <Link
                  href="/login"
                  className="w-full inline-flex justify-center items-center px-4 py-2 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700"
                >
                  Ir para o Login
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-white dark:bg-zinc-900 p-8 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Recuperar Senha</h3>
              {errorAction && (
                <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                  {errorAction}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <label
                    htmlFor="identifier"
                    className="block text-sm font-medium mb-1"
                  >
                    Email
                  </label>
                  <input
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    type="text"
                    id="identifier"
                    name="identifier"
                    className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 px-3 py-2 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="seu@email.com"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center items-center px-4 py-2 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 cursor-pointer"
                  >
                    Enviar
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
}
