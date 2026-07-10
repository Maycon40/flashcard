import Layout from "@/components/layout";

export default function PrivacyPolicy() {
  return (
    <Layout
      title="Política de Privacidade | MyFlashcard"
      description="Entenda a Política de Privacidade do MyFlashcard"
    >
      <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-200 transition-colors duration-200">
        <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          {/* Cabeçalho Principal */}
          <header className="border-b border-slate-200 dark:border-slate-700 pb-6 mb-8">
            <h1 className="text-3xl font-extrabold text-purple-600 dark:text-purple-400 sm:text-4xl tracking-tight">
              POLÍTICA DE PRIVACIDADE – MYFLASHCARD
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Última atualização: 9 de julho de 2026
            </p>
          </header>

          {/* Corpo do Texto */}
          <div className="space-y-6 text-base leading-relaxed">
            <p>
              O MyFlashcard valoriza a privacidade dos seus usuários e está
              comprometido com a proteção de seus dados pessoais. Esta Política
              de Privacidade descreve como coletamos, usamos, armazenamos e
              protegemos as suas informações, em total conformidade com a Lei
              Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018) no Brasil e
              com as diretrizes da Google Play Store.
            </p>
            <p>
              Ao utilizar o aplicativo MyFlashcard, você concorda com os termos
              descritos nesta política.
            </p>

            {/* Seção 1 */}
            <section className="pt-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 border-l-4 border-purple-500 pl-3">
                1. QUEM É O RESPONSÁVEL PELO TRATAMENTO DOS DADOS?
              </h2>
              <p className="mb-3">
                O controlador responsável pelo tratamento dos dados pessoais
                coletados por este aplicativo é:
              </p>
              <ul className="list-disc pl-5 space-y-1 bg-white dark:bg-slate-800/50 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
                <li>
                  <span className="font-semibold">Nome:</span> MyFlashcard
                </li>
                <li>
                  <span className="font-semibold">Contato Oficial:</span>{" "}
                  <a
                    href="mailto:contato@myflashcard.com.br"
                    className="text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    contato@myflashcard.com.br
                  </a>
                </li>
              </ul>
            </section>

            {/* Seção 2 */}
            <section className="pt-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 border-l-4 border-purple-500 pl-3">
                2. QUAIS DADOS NÓS COLETAMOS?
              </h2>
              <p className="mb-4">
                Para que o aplicativo funcione corretamente e permita a
                sincronização dos seus estudos, coletamos as seguintes
                informações que você nos fornece voluntariamente ao criar uma
                conta:
              </p>
              <ul className="space-y-3 pl-2">
                <li>
                  <strong className="block text-purple-600 dark:text-purple-400">
                    Nome de usuário:
                  </strong>
                  Para identificação e personalização dentro da interface do
                  aplicativo.
                </li>
                <li>
                  <strong className="block text-purple-600 dark:text-purple-400">
                    Endereço de e-mail:
                  </strong>
                  Utilizado como credencial única de acesso, recuperação de
                  senha e comunicações essenciais sobre a conta.
                </li>
                <li>
                  <strong className="block text-purple-600 dark:text-purple-400">
                    Senha de acesso:
                  </strong>
                  Criptografada em nossos sistemas para garantir a segurança da
                  sua conta.
                </li>
              </ul>
              <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg text-sm text-purple-800 dark:text-purple-300 border border-purple-100 dark:border-purple-900/50">
                <span className="font-bold">
                  Nota sobre Flashcards e Baralhos:
                </span>{" "}
                Os conteúdos criados por você (flashcards, baralhos e histórico
                de revisões) também são processados para fins exclusivos de
                funcionamento do aplicativo.
              </div>
            </section>

            {/* Seção 3 */}
            <section className="pt-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 border-l-4 border-purple-500 pl-3">
                3. COMO OS DADOS SÃO UTILIZADOS E ARMAZENADOS?
              </h2>
              <p className="mb-4">
                Os dados coletados possuem a finalidade exclusiva de prestar o
                serviço de gerenciamento e memorização de estudos.
              </p>
              <ul className="space-y-3 pl-2">
                <li>
                  <strong className="text-slate-900 dark:text-white">
                    Armazenamento Local e em Nuvem:
                  </strong>{" "}
                  Seus dados cadastrais, baralhos e flashcards são salvos
                  localmente no seu dispositivo e, para fins de backup e
                  sincronização entre múltiplos dispositivos, são enviados e
                  armazenados em nosso servidor/backend próprio.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">
                    Ferramentas de Terceiros:
                  </strong>{" "}
                  Nós não utilizamos nenhuma ferramenta de análise de dados
                  (analytics), rastreamento de comportamento ou relatórios
                  automáticos de travamento de empresas terceiras dentro do
                  aplicativo.
                </li>
              </ul>
            </section>

            {/* Seção 4 */}
            <section className="pt-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 border-l-4 border-purple-500 pl-3">
                4. COMPARTILHAMENTO DE DADOS
              </h2>
              <p>
                Nós adotamos uma política estrita de privacidade: seus dados não
                são compartilhados, vendidos, alugados ou repassados para
                nenhuma outra empresa, parceiro comercial ou terceiros. Todas as
                informações trafegam e permanecem exclusivamente em nossa
                própria infraestrutura de backend seguro.
              </p>
            </section>

            {/* Seção 5 */}
            <section className="pt-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 border-l-4 border-purple-500 pl-3">
                5. SEGURANÇA DOS DADOS
              </h2>
              <p>
                Implementamos medidas técnicas e organizativas adequadas para
                proteger seus dados pessoais contra acessos não autorizados,
                perda, destruição ou alteração. O tráfego de dados entre o
                aplicativo e o nosso backend é criptografado.
              </p>
            </section>

            {/* Seção 6 */}
            <section className="pt-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 border-l-4 border-purple-500 pl-3">
                6. DIREITOS DO USUÁRIO E EXCLUSÃO DE DADOS
              </h2>
              <p className="mb-4">
                Em conformidade com a LGPD, você possui total controle sobre os
                seus dados. A qualquer momento, você pode exercer os seguintes
                direitos:
              </p>
              <ul className="space-y-3 pl-2">
                <li>
                  <strong className="text-slate-900 dark:text-white">
                    Acesso e Correção:
                  </strong>{" "}
                  Visualizar ou alterar seu nome de usuário e e-mail diretamente
                  no aplicativo.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">
                    Exclusão Definitiva de Dados:
                  </strong>{" "}
                  Você tem o direito de apagar sua conta. O aplicativo
                  disponibiliza uma opção direta e simples para deletar a conta.
                  Ao acionar essa opção, o seu perfil, seus e-mails, senhas,
                  baralhos e todos os seus flashcards salvos serão eliminados
                  permanentemente tanto do seu dispositivo quanto dos nossos
                  servidores em nuvem, sem possibilidade de recuperação.
                </li>
              </ul>
            </section>

            {/* Seção 7 */}
            <section className="pt-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 border-l-4 border-purple-500 pl-3">
                7. ALTERAÇÕES NESTA POLÍTICA DE PRIVACIDADE
              </h2>
              <p>
                Podemos atualizar esta Política de Privacidade periodicamente
                para refletir melhorias no aplicativo ou mudanças na legislação.
                Sempre que uma alteração relevante for feita, atualizaremos a{" "}
                {'"Data de última atualização"'} no topo deste documento.
              </p>
            </section>

            {/* Seção 8 */}
            <section className="pt-4 pb-8">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 border-l-4 border-purple-500 pl-3">
                8. CONTATO
              </h2>
              <p>
                Se você tiver qualquer dúvida sobre esta Política de Privacidade
                ou quiser fazer alguma solicitação sobre seus dados, entre em
                contato através do e-mail:{" "}
                <a
                  href="mailto:contato@myflashcard.com.br"
                  className="text-purple-600 dark:text-purple-400 font-semibold hover:underline"
                >
                  contato@myflashcard.com.br
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}
