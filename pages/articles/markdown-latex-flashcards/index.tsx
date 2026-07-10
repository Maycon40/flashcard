import Image from "next/image";
import Link from "next/link";

import { Article } from "@/types/types";
import ArticleComponent from "@/components/article";
import { MarkdownViewer } from "@/components/markdown";

const article: Article = {
  title: "Domine o Markdown e LaTeX: O Guia para Flashcards Profissionais",
  description:
    "Aprenda a elevar o nível técnico das suas descrições no MyFlashcard utilizando formatação avançada e fórmulas matemáticas com Markdown e LaTeX.",
  author: "Maycon Santos",
  image: "/post-it-notes.jpg",
  date: "2026-05-14",
  url: "https://myflashcard.com.br/articles/markdown-latex-flashcards",
  topics: [
    { id: "o-que-e-markdown", label: "Markdown: Estrutura e Clareza Visual" },
    {
      id: "organizacao-visual-precisao",
      label: "Organização visual e precisão técnica",
    },
    {
      id: "integracao-myflashcard",
      label: "Turbinando descrições no MyFlashcard",
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
          <p className="mb-4 text-lg">
            Se você estuda áreas técnicas como Programação, Matemática ou
            Engenharia, sabe que nem sempre palavras são suficientes para
            explicar um conceito. Às vezes, você precisa de uma fórmula
            matemática impecável ou de um bloco de código bem estruturado. É
            aqui que o <strong>Markdown</strong> e o <strong>LaTeX</strong>{" "}
            entram em cena no campo de descrição do <strong>MyFlashcard</strong>
            .
          </p>
          <p className="mb-6">
            Neste artigo, vamos explorar como essas duas linguagens transformam
            seus cartões de estudo, permitindo uma clareza visual que acelera a
            compreensão e a retenção de longo prazo.
          </p>

          <h2 className="text-2xl font-bold mb-4" id="o-que-e-markdown">
            Markdown: Estrutura e Clareza Visual
          </h2>
          <p className="mb-4">
            O Markdown funciona através de símbolos intuitivos que instruem o
            sistema a formatar o texto visualmente. A grande vantagem no{" "}
            <strong>MyFlashcard</strong> é que você não precisa de menus
            complexos: basta digitar alguns caracteres para criar hierarquia e
            destaque, mantendo o foco total no conteúdo do estudo.
          </p>

          <p className="mb-4">
            Ao utilizar esses modificadores no campo de descrição, o{" "}
            <strong>MyFlashcard</strong> processa a sintaxe e entrega uma
            interface limpa, que facilita a leitura rápida (scanning) durante
            suas sessões de revisão.
          </p>

          <div className="overflow-x-auto mb-6">
            <table className="min-w-full border-collapse border border-gray-200 dark:border-gray-700">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left">
                    Elemento
                  </th>
                  <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left">
                    Sintaxe Markdown
                  </th>
                  <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left">
                    Resultado Visual
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm font-medium">
                    Título Principal
                  </td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-xs">
                    # Título
                  </td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-bold text-lg">
                    Título
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm font-medium">
                    Subtítulo
                  </td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-xs">
                    ## Subtítulo
                  </td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-bold text-base">
                    Subtítulo
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm font-medium">
                    Negrito
                  </td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-xs">
                    **texto**
                  </td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-bold">
                    texto
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm font-medium">
                    Itálico
                  </td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-xs">
                    *texto*
                  </td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 italic">
                    texto
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm font-medium">
                    Lista com marcadores
                  </td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-xs">
                    - Item
                  </td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                    • Item
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm font-medium">
                    Código inline
                  </td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-xs">
                    `code`
                  </td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded px-1 font-mono">
                    code
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <ul className="list-disc ml-6 mb-4 space-y-2">
            <li>
              <strong>Hierarquia:</strong> Use os níveis de <code>#</code> para
              organizar conceitos de macro a micro.
            </li>
            <li>
              <strong>Destaque Seletivo:</strong> O uso de negrito ajuda a
              &quot;ancorar&quot; o olhar na informação que você costuma
              esquecer.
            </li>
            <li>
              <strong>Contexto Técnico:</strong> Os blocos de código permitem
              salvar sintaxes prontas (como as do Odoo ou Next.js) mantendo a
              indentação correta.
            </li>
          </ul>

          <p className="mb-2 italic text-gray-600 dark:text-gray-400">
            Exemplo de aplicação em um flashcard técnico:
          </p>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mb-6 overflow-x-auto border-l-4 border-blue-500">
            <code className="text-sm">
              {`### Flexbox Cheat Sheet
Para alinhar itens ao centro no eixo principal:
- Use \`justify-content: center;\`
**Nota:** O container precisa ter \`display: flex;\`.`}
            </code>
          </pre>
          <h2 id="o-que-e-latex" className="text-2xl font-bold mb-4">
            LaTeX: A Linguagem Universal da Ciência
          </h2>
          <p className="mb-4">
            Quando o assunto são fórmulas complexas, o texto comum falha. O
            LaTeX funciona através de uma sintaxe específica que descreve a
            estrutura lógica da fórmula em vez de apenas sua aparência. Ao
            utilizá-lo na descrição dos seus cards, o{" "}
            <strong>MyFlashcard</strong> atua como um compilador, renderizando
            equações matemáticas com a mesma precisão profissional encontrada em
            livros didáticos e artigos científicos.
          </p>

          <p className="mb-4">
            Para montar uma fórmula, você utiliza delimitadores como o cifrão
            duplo (<code>$$</code>) para criar fórmulas em blocos centralizados.
            Dentro desses delimitadores, comandos que começam com barra
            invertida (<code>\</code>) definem operadores, frações, raízes e
            símbolos gregos.
          </p>

          {/* Tabela de Operadores Principais LaTeX */}
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full border-collapse border border-gray-200 dark:border-gray-700">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left text-sm">
                    Elemento
                  </th>
                  <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left text-sm">
                    Comando LaTeX
                  </th>
                  <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left text-sm">
                    Resultado
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm">
                    Frações
                  </td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-xs">
                    \frac{"{a}"}
                    {"{b}"}
                  </td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-center text-lg font-serif">
                    <MarkdownViewer
                      clobberPrefix={`latex-content`}
                      value="$$\frac{a}{b}$$"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm">
                    Potência / Sobrescrito
                  </td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-xs">
                    x^2
                  </td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-center text-lg font-serif">
                    <MarkdownViewer
                      clobberPrefix={`latex-content`}
                      value="$$x^2$$"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm">
                    Índice / Subscrito
                  </td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-xs">
                    H_2O
                  </td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-center text-lg font-serif">
                    <MarkdownViewer
                      clobberPrefix={`latex-content`}
                      value="$$H_2O$$"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm">
                    Raiz Quadrada
                  </td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-xs">
                    \sqrt{"{x}"}
                  </td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-center text-lg font-serif">
                    <MarkdownViewer
                      clobberPrefix={`latex-content`}
                      value="$$\sqrt{x}$$"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm">
                    Soma / Integral
                  </td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-xs">
                    \sum \text{" ou "} \int
                  </td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-center text-lg font-serif">
                    <MarkdownViewer
                      clobberPrefix={`latex-content`}
                      value="$$\sum \text{ou} \int$$"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm">
                    Símbolos Gregos
                  </td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-xs">
                    \alpha, \beta, \pi
                  </td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-center text-lg font-serif">
                    <MarkdownViewer
                      clobberPrefix={`latex-content`}
                      value="$$\alpha, \beta, \pi$$"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mb-4">
            No <strong>MyFlashcard</strong>, essa clareza é um divisor de águas
            para disciplinas STEM (Ciência, Tecnologia, Engenharia e
            Matemática). Estudar uma lei física ou um teorema matemático
            torna-se um processo visual muito mais intuitivo quando a fórmula é
            exibida corretamente, em vez de escrita em texto puro de forma
            confusa.
          </p>

          <p className="mb-4 italic text-gray-600 dark:text-gray-400">
            Exemplo de uma fórmula de Física renderizada:
          </p>
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-md mb-6 text-center text-2xl font-serif border-l-4 border-purple-500 shadow-inner">
            <MarkdownViewer
              clobberPrefix={`latex-content`}
              value="$$F = G \frac{m_1 m_2}{r^2}$$"
            />
          </div>

          <h2 className="text-2xl font-bold mb-4" id="sinergia-myflashcard">
            A Sinergia com o MyFlashcard
          </h2>
          <p className="mb-4">
            O grande diferencial do <strong>MyFlashcard</strong> é permitir que
            você combine essas ferramentas. Você pode usar Markdown para
            explicar a teoria e LaTeX para exibir a fórmula correspondente, tudo
            na mesma descrição.
          </p>
          <p className="mb-6">
            Essa riqueza visual não é apenas estética; ela reduz a carga
            cognitiva. Quando a informação está bem organizada, seu cérebro foca
            no que realmente importa: a <strong>recuperação ativa</strong> do
            conhecimento.
          </p>

          <h2 className="text-2xl font-bold mb-4" id="conclusao-cta">
            Eleve o Nível dos Seus Flashcards
          </h2>
          <p className="mb-4 text-lg">
            Não se limite a textos planos e desorganizados. Seus estudos merecem
            a precisão que o Markdown e o LaTeX oferecem.
          </p>
          <p className="mb-6 font-semibold text-indigo-600">
            Pronto para criar os flashcards mais profissionais que você já viu?
          </p>

          <div className="p-6 bg-linear-to-r from-blue-500 to-indigo-600 rounded-xl text-white text-center shadow-lg">
            <p className="text-xl mb-4 font-bold">
              Transforme sua forma de aprender hoje mesmo.
            </p>
            <p className="mb-6">
              Junte-se a milhares de estudantes que utilizam a tecnologia a
              favor da memória.
            </p>
            <Link
              className="inline-block bg-white text-indigo-600 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors"
              href="https://myflashcard.com.br/signup"
            >
              Começar Agora no MyFlashcard
            </Link>
          </div>
        </div>
      </div>
    </ArticleComponent>
  );
}
