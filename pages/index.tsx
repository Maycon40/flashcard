import Link from "next/link";

import Layout from "@/components/layout";

export default function Home() {
  return (
    <Layout
      title="Flashcard - Aprenda com Revisão Espaçada | MyFlashcard"
      description="Domine qualquer assunto com flashcards inteligentes. Use o método de revisão espaçada para nunca mais esquecer o que estudou. Comece agora gratuitamente no MyFlashcard!"
    >
      <div className="mx-auto max-w-5xl px-6 py-12">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl font-extrabold leading-tight mb-4">
              Aprenda de verdade com flashcards
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-6">
              Use a repetição ativa e a revisão espaçada para memorizar mais
              rápido e com menos esforço. Simples, eficiente e baseado em
              evidências.
            </p>

            <div className="flex gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center px-5 py-3 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700"
              >
                Criar cartão
              </Link>
            </div>
          </div>

          <div className="rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              Por que flashcards funcionam?
            </h2>
            <ul className="space-y-4 text-zinc-700 dark:text-zinc-300">
              <li className="flex gap-3">
                <svg
                  className="h-6 w-6 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <div>
                  <strong>Recuperação ativa</strong>
                  <div className="text-sm text-zinc-500">
                    Lembrar ativamente fortalece memórias mais que releituras.
                  </div>
                </div>
              </li>

              <li className="flex gap-3">
                <svg
                  className="h-6 w-6 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3"
                  />
                </svg>
                <div>
                  <strong>Repetição espaçada</strong>
                  <div className="text-sm text-zinc-500">
                    Revisões em intervalos aumentam retenção a longo prazo.
                  </div>
                </div>
              </li>

              <li className="flex gap-3">
                <svg
                  className="h-6 w-6 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 7h18M3 12h18M3 17h18"
                  />
                </svg>
                <div>
                  <strong>Foco no essencial</strong>
                  <div className="text-sm text-zinc-500">
                    Fragmentar o conteúdo em perguntas objetivas facilita a
                    revisão.
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </section>

        <section className="mt-12 rounded-2xl bg-white dark:bg-zinc-900 p-8 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <h3 className="text-2xl font-semibold mb-2">
              Biblioteca pública de flashcards
            </h3>
            <p className="text-zinc-700 dark:text-zinc-300 mb-4">
              Explore centenas de cartões criados por outros usuários para
              acelerar seus estudos e compartilhe seus próprios cartões com a
              comunidade.
            </p>
            <Link
              href="/library"
              className="inline-flex items-center px-6 py-3 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
            >
              Explorar biblioteca
            </Link>
          </div>
          <div className="shrink-0 mt-6 md:mt-0 md:ml-8 hidden md:flex items-center justify-center">
            <svg
              className="w-28 h-28 text-indigo-500 drop-shadow-lg"
              fill="none"
              viewBox="0 0 64 64"
              stroke="currentColor"
              aria-hidden
            >
              <path
                d="M12 52c6-4 18-4 24 0M12 12v40c6-4 18-4 24 0V12M12 12c6-4 18-4 24 0m0 0v40"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="stroke-indigo-300 dark:stroke-indigo-600"
              />
              <path
                d="M36 12c6-4 18-4 24 0v40c-6-4-18-4-24 0"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="stroke-indigo-300 dark:stroke-indigo-600"
              />
            </svg>
          </div>
        </section>

        <section className="mt-12 rounded-2xl bg-white dark:bg-zinc-900 p-8 shadow-md">
          <h3 className="text-2xl font-semibold mb-4">Benefícios</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-zinc-700 dark:text-zinc-300">
            <div className="space-y-2">
              <h4 className="font-semibold">Aprendizado ativo</h4>
              <p className="text-sm">
                Envolva-se na recuperação de informações — é a forma mais
                eficiente de consolidar conhecimento.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Economia de tempo</h4>
              <p className="text-sm">
                Revisões curtas e regulares substituem horas de estudo passivo.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Personalizável</h4>
              <p className="text-sm">
                Crie baralhos para qualquer assunto, ajuste a dificuldade e
                acompanhe seu progresso.
              </p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
