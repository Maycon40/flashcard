import { SubmitEvent, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import Layout from "@/components/layout";

export default function ConfirmEmailPage() {
  const router = useRouter();
  const { token_id } = router.query;

  const [password, setPassword] = useState("");
  const [errorAction, setErrorAction] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const response = await fetch(`/api/v1/recovery`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token_id,
          password,
        }),
      });

      const responseBody = await response.json().catch(() => ({}));

      if (response.status === 200) {
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
      title="Confirme seu email | MyFlashcard"
      description="Confirme seu email no MyFlashcard"
    >
      <main className="mx-auto max-w-3xl px-6 py-16">
        <div className="flex justify-center">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 p-8 shadow-lg text-center">
            {success ? (
              <>
                <h3 className="text-xl font-semibold mb-4">Senha Alterada!</h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Sua senha foi alterada com sucesso.
                </p>
                <div className="mt-6">
                  <Link
                    href="/login"
                    className="w-full inline-flex justify-center items-center px-4 py-2 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700"
                  >
                    Ir para o Login
                  </Link>
                </div>
              </>
            ) : (
              <div className="rounded-2xl bg-white dark:bg-zinc-900 p-8 shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Alterar Senha</h3>
                {errorAction && (
                  <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                    {errorAction}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium mb-1"
                    >
                      Senha
                    </label>
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type="password"
                      id="password"
                      name="password"
                      className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 px-3 py-2 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center items-center px-4 py-2 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700"
                    >
                      Alterar Senha
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>
    </Layout>
  );
}
