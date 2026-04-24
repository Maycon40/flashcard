import type { GetServerSidePropsContext } from "next";
import Link from "next/link";

import Layout from "@/components/layout";

interface Props {
  success: boolean;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req, query } = context;
  const { token_id } = query;

  const proto = (req.headers["x-forwarded-proto"] as string) || "http";
  const host = req.headers["host"];
  const origin = `${proto}://${host}`;

  let success = false;

  try {
    const res = await fetch(`${origin}/api/v1/activations/${token_id}`, {
      method: "PATCH",
      headers: {
        cookie: req.headers.cookie || "",
      },
    });

    if (res.status === 200) {
      success = true;
    }
  } catch {
    // ignore network/fetch errors
  }

  return {
    props: {
      success,
    },
  };
}

export default function RegisterPage({ success }: Props) {
  return (
    <Layout
      title="Ativação da conta | MyFlashcard"
      description="Ative sua conta no MyFlashcard"
    >
      <main className="mx-auto max-w-3xl px-6 py-16">
        <div className="flex justify-center">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 p-8 shadow-lg text-center">
            {success ? (
              <>
                <h3 className="text-xl font-semibold mb-4">Conta Ativada!</h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Sua conta foi ativada com sucesso.
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
              <>
                <h3 className="text-xl font-semibold mb-4">
                  Falha na Ativação
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Não foi possível ativar sua conta. O link pode ser inválido ou
                  ter expirado.
                </p>
              </>
            )}
          </div>
        </div>
      </main>
    </Layout>
  );
}
