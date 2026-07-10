import Image from "next/image";
import Link from "next/link";

import { Article } from "@/types/types";
import ArticleComponent from "@/components/article";

const article: Article = {
  title: "Flashcards: o que são e como funcionam?",
  description:
    "Descubra o que são e como utilizar os flashcards para potencializar seus estudos.",
  author: "Maycon Santos",
  image: "/post-it-notes.jpg",
  date: "2026-04-28",
  url: "https://myflashcard.com.br/articles/oque-sao-flashcards",
  topics: [
    { id: "o-que-sao-flashcards", label: "O que são flashcards?" },
    { id: "como-funcionam", label: "Como funcionam os flashcards?" },
    {
      id: "porque-sao-eficazes",
      label: "Por que os flashcards são tão eficazes?",
    },
    {
      id: "flashcards-fisicos-digitais",
      label: "Flashcards físicos vs. digitais",
    },
    {
      id: "transforme-sua-forma-de-aprender",
      label: "Comece agora: transforme sua forma de aprender",
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
        <p>
          Se você já buscou maneiras mais eficientes de estudar, memorizar
          conteúdos ou acelerar seu aprendizado, provavelmente já se deparou com
          o termo flashcards. Mas afinal, o que são flashcards e por que eles
          são tão eficazes?
        </p>
        <p>
          Neste artigo, você vai entender em profundidade como essa técnica
          funciona, por que ela é amplamente utilizada por estudantes e
          profissionais ao redor do mundo e como você pode começar a aplicá-la
          hoje mesmo para melhorar seus resultados.
        </p>
        <h2
          className="text-2xl text-indigo-600 font-bold mb-2"
          id="o-que-sao-flashcards"
        >
          O que são flashcards?
        </h2>
        <p>
          Flashcards são cartões de estudo que contêm informações organizadas de
          forma simples e objetiva. Normalmente, eles possuem:
        </p>
        <ul className="list-disc ml-6">
          <li>Uma pergunta, termo ou conceito na frente</li>
          <li>Uma resposta ou explicação no verso</li>
        </ul>
        <p>
          Essa estrutura estimula o cérebro a recuperar informações ativamente,
          em vez de apenas reler conteúdos passivamente — o que é fundamental
          para uma memorização mais eficiente.
        </p>
        <p>Por exemplo:</p>
        <ul className="list-disc ml-6">
          <li>Frente: O que é fotossíntese?</li>
          <li>
            Verso: Processo pelo qual as plantas convertem luz solar em energia
            química.
          </li>
        </ul>
        <p>Simples, direto e altamente eficaz.</p>
        <h2
          className="text-2xl text-indigo-600 font-bold mb-2"
          id="como-funcionam"
        >
          Como funcionam os flashcards?
        </h2>
        <p>
          O diferencial dos flashcards não está apenas no formato, mas na forma
          como são utilizados. Eles se baseiam em dois princípios fundamentais
          da ciência da aprendizagem:
        </p>
        <h3 className="text-xl text-indigo-600 font-bold">
          1. Recuperação ativa
        </h3>
        <p>
          Ao tentar lembrar a resposta antes de virar o cartão, você força o
          cérebro a acessar a informação. Esse esforço fortalece as conexões
          neurais e melhora a retenção.
        </p>
        <h3 className="text-xl text-indigo-600 font-bold">
          2. Repetição espaçada
        </h3>
        <p>
          Nem todo conteúdo precisa ser revisado com a mesma frequência. A
          repetição espaçada organiza as revisões com base no seu desempenho:
        </p>
        <p>
          Acertou com facilidade? Revise menos vezes. Teve dificuldade? Revise
          mais frequentemente.
        </p>
        <p>Esse método evita o esquecimento e otimiza seu tempo de estudo.</p>
        <h2
          className="text-2xl text-indigo-600 font-bold mb-2"
          id="porque-sao-eficazes"
        >
          Por que os flashcards são tão eficazes?
        </h2>
        <p>
          Os flashcards são amplamente utilizados porque combinam eficiência,
          simplicidade e resultados comprovados. Entre os principais benefícios,
          destacam-se:
        </p>
        <ul className="list-disc ml-6">
          <li>Melhora significativa na memorização</li>

          <li>Estudo mais ativo e menos cansativo</li>

          <li>Facilidade de adaptação a qualquer conteúdo</li>

          <li>Ideal para revisões rápidas e frequentes</li>

          <li>Aumento da retenção de longo prazo</li>
        </ul>
        <p>
          Além disso, eles são extremamente versáteis. Você pode utilizá-los
          para aprender:
        </p>
        <ul className="list-disc ml-6">
          <li>Idiomas</li>
          <li>Conceitos técnicos</li>
          <li>Fórmulas</li>
          <li>Datas históricas</li>
          <li>Definições importantes</li>
        </ul>
        <h2
          className="text-2xl text-indigo-600 font-bold mb-2"
          id="flashcards-fisicos-digitais"
        >
          Flashcards físicos vs. digitais
        </h2>
        <p>
          Tradicionalmente, os flashcards eram feitos em papel. No entanto, com
          o avanço da tecnologia, surgiram ferramentas digitais que
          potencializam ainda mais essa técnica.
        </p>
        <p>Flashcards físicos:</p>
        <ul className="list-disc ml-6">
          <li>Simples de criar</li>
          <li>Não dependem de tecnologia</li>
          <li>Menos eficientes para organizar revisões</li>
        </ul>
        <p>Flashcards digitais:</p>
        <ul className="list-disc ml-6">
          <li>Automatizam a repetição espaçada</li>
          <li>Permitem acesso em qualquer lugar</li>
          <li>Facilitam a criação e organização</li>
          <li>Oferecem melhor acompanhamento do progresso</li>
        </ul>
        <p>
          É aqui que entra uma solução inteligente para quem deseja resultados
          reais.
        </p>
        <h2
          className="text-2xl text-indigo-600 font-bold mb-2"
          id="transforme-sua-forma-de-aprender"
        >
          Comece agora: transforme sua forma de aprender
        </h2>
        <p>
          Se você quer sair do estudo passivo e começar a aprender de forma mais
          eficiente, os flashcards são um excelente ponto de partida.
        </p>
        <p>E melhor ainda: você não precisa fazer tudo manualmente.</p>
        <p>
          👉 Experimente agora uma ferramenta inteligente de criação e
          gerenciamento de flashcards e descubra como é possível estudar menos e
          aprender mais.
        </p>
        <p>
          Acesse:{" "}
          <Link
            className="text-blue-400 underline"
            href="https://myflashcard.com.br/signup"
          >
            MyFlashcard
          </Link>
        </p>
      </div>
    </ArticleComponent>
  );
}
