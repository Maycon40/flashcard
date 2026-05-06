import Layout from "@/components/layout";

export default function SignupPage() {
  return (
    <Layout
      title="Ativar Conta | MyFlashcard"
      description="Ative sua conta no MyFlashcard"
    >
      <main className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-2xl bg-white dark:bg-zinc-900 p-8 shadow-lg">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Confira seu email!</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Sua conta foi criada com sucesso.
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 mt-2">
              Por favor, verifique seu e-mail para ativá-la.
            </p>
          </div>
        </div>
      </main>
    </Layout>
  );
}
