import Image from "next/image";
import Link from "next/link";

import { Article } from "@/types/types";
import ArticleComponent from "@/components/article";
import CopyButton from "@/components/button/copy";

const article: Article = {
  title: "Prompt para Criação de Flashcards",
  description:
    "Utilize a Inteligência Artificial para criar flashcards de maneira rápida e eficiente.",
  author: "Maycon Santos",
  image: "/post-it-notes.jpg",
  date: "2026-05-13",
  url: "https://myflashcard.com.br/articles/prompt-criacao-flashcards",
  topics: [
    { id: "o-que-sao-flashcards", label: "O que são flashcards?" },
    {
      id: "prompt-criacao-flashcards",
      label: "Prompt para criação de flashcards",
    },
  ],
};

export default function ArticlePage() {
  return (
    <ArticleComponent article={article}>
      <div className="mb-10 scroll-mt-24 flex flex-col gap-5">
        <div className="relative w-full h-75">
          <Image
            src={article.image}
            alt="Vista superior de uma mesa com suprimentos de escritório sobre papel pautado. Na esquerda, um bloco de notas autoadesivas empilhadas em rosa pink, verde limão e um pequeno bloco amarelo claro por cima. Uma caneta prateada e clips de papel brancos estão acima deles. No centro-direita, uma tesoura de ponta afiada com alças brancas e vermelhas e uma pilha de papéis coloridos escalonados."
            fill
            className="object-cover"
          />
        </div>
        <div className="max-w-4xl mx-auto py-6 font-sans leading-relaxed">
          <p className="mb-4">
            Você já sentiu que perde mais tempo <strong>criando</strong> o
            material de estudo do que realmente <strong>estudando</strong>? A
            criação manual de flashcards pode ser um processo exaustivo,
            especialmente quando lidamos com grandes volumes de conteúdo.
          </p>
          <p className="mb-6">
            Neste artigo, exploraremos como o uso de prompts inteligentes e{" "}
            <strong>Inteligência Artificial</strong> pode transformar horas de
            trabalho manual em segundos de automação, permitindo que você foque
            no que realmente importa: a memorização e o aprendizado.
          </p>

          <h2
            className="text-2xl font-bold mb-4 text-indigo-600"
            id="o-que-e-um-prompt"
          >
            O que é um prompt para flashcards?
          </h2>
          <p className="mb-4">
            Um prompt é basicamente uma instrução dada a uma IA (como o ChatGPT
            ou Gemini) para que ela execute uma tarefa específica. Para o
            estudo, um prompt bem estruturado orienta a ferramenta a:
          </p>
          <ul className="list-disc ml-6 mb-6 space-y-2">
            <li>Identificar os conceitos-chave de um texto longo.</li>
            <li>
              Transformar definições complexas em perguntas e respostas diretas.
            </li>
            <li>
              Formatá-las no padrão ideal para aplicativos como o Anki ou
              MyFlashcard.
            </li>
          </ul>

          <h2
            className="text-2xl font-bold mb-4 text-indigo-600"
            id="como-estruturar-prompt"
          >
            Como estruturar o prompt perfeito?
          </h2>
          <p className="mb-4">
            Não basta pedir &quot;crie flashcards deste texto&quot;. Para obter
            resultados de alta qualidade e prontos para uso, seu prompt deve
            seguir três pilares fundamentais:
          </p>

          <h3 className="text-xl font-semibold mb-2">
            1. Definição de Papel (Roleplay)
          </h3>
          <p className="mb-4 italic">
            &quot;Atue como um professor especialista em [assunto] focado em
            metodologias de aprendizagem ativa.&quot;
          </p>

          <h3 className="text-xl font-semibold mb-2">
            2. Especificação do Formato
          </h3>
          <p className="mb-4">
            Peça para a IA seguir a &quot;Regra da Atomaticidade&quot;: cada
            cartão deve conter apenas <strong>uma</strong> ideia ou pergunta
            simples. Isso evita a sobrecarga cognitiva.
          </p>

          <h3 className="text-xl font-semibold mb-2">3. Instrução de Saída</h3>
          <p className="mb-6">
            Solicite o formato CSV ou uma lista clara (Frente: / Verso:), o que
            facilita a importação direta para plataformas digitais.
          </p>

          <h2
            className="text-2xl font-bold mb-4 text-indigo-600"
            id="exemplo-pratico"
          >
            Exemplo de Prompt para Copiar e Usar
          </h2>
          <div className="bg-gray-100 dark:bg-gray-800 flex items-center gap-x-1 p-4 rounded-lg border-l-4 border-indigo-500 mb-6">
            <p className="font-mono text-sm">
              Leia o texto abaixo e extraia 10 flashcards no formato
              Frente/Verso. Foque em conceitos, termos técnicos e relações de
              causa e efeito. Mantenha as respostas curtas (máximo 15 palavras).
              <br />
              [Insira seu texto aqui]
            </p>
            <CopyButton>
              Leia o texto abaixo e extraia 10 flashcards no formato
              Frente/Verso. Foque em conceitos, termos técnicos e relações de
              causa e efeito. Mantenha as respostas curtas (máximo 15 palavras).
              [Insira seu texto aqui]
            </CopyButton>
          </div>

          <h2
            className="text-2xl font-bold mb-4 text-indigo-600"
            id="beneficios-automacao"
          >
            Vantagens da Criação Automática
          </h2>
          <p className="mb-4">
            Utilizar prompts para gerar seus cartões oferece benefícios que vão
            além da simples economia de tempo:
          </p>
          <ul className="list-disc ml-6 mb-6 space-y-2">
            <li>
              <strong>Consistência:</strong> Todos os cartões seguem o mesmo
              padrão de qualidade.
            </li>
            <li>
              <strong>Escalabilidade:</strong> Transforme um capítulo inteiro de
              livro em decks de estudo em minutos.
            </li>
            <li>
              <strong>Visão Imparcial:</strong> A IA muitas vezes identifica
              pontos importantes que passariam despercebidos por você.
            </li>
          </ul>

          <h2
            className="text-2xl font-bold mb-4 text-indigo-600"
            id="conclusao"
          >
            Potencialize seus estudos hoje mesmo
          </h2>
          <p className="mb-4">
            A tecnologia está aqui para trabalhar a seu favor. Combinar a
            potência dos flashcards com a agilidade da Inteligência Artificial é
            o segredo dos estudantes de alta performance.
          </p>
          <p className="mb-6">
            Pare de digitar e comece a revisar. Use o poder dos prompts para
            acelerar sua jornada rumo à aprovação ou ao domínio de um novo
            idioma.
          </p>

          <p className="text-center font-bold">
            👉 Quer automatizar seus estudos agora? Conheça o{" "}
            <Link
              className="text-indigo-600 underline"
              href="https://myflashcard.com.br/signup"
            >
              MyFlashcard
            </Link>{" "}
            e transforme textos em conhecimento.
          </p>
        </div>
      </div>
    </ArticleComponent>
  );
}
