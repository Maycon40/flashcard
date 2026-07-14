import { useState, SubmitEvent } from "react";
import { useRouter } from "next/router";

import ErrorComponent from "@/components/error";
import ButtonComponent from "@/components/button";
import SuccessComponent from "@/components/success";
import ConfirmDelete from "@/components/delete";
import Layout from "@/components/layout";

export default function DeleteAccountPage() {
  return (
    <Layout
      title="Excluir Conta - MyFlashcard"
      description="Exclua sua conta da MyFlashcard"
    >
      <div className="my-10 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-semibold mb-6 text-red-600 dark:text-red-500">
          Excluir Conta
        </h1>

        <div className="space-y-6 max-w-lg">
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 p-4 rounded-md">
            <h2 className="text-sm font-semibold text-red-800 dark:text-red-400 mb-1">
              Atenção: Esta ação é irreversível
            </h2>
            <p className="text-sm text-red-700 dark:text-red-400/80">
              Ao prosseguir, todos os seus dados, configurações e informações
              vinculadas a esta conta serão permanentemente removidos de nossos
              servidores.
            </p>
          </div>

          <section>
            <DeleteAccountForm />
          </section>
        </div>
      </div>
    </Layout>
  );
}

function DeleteAccountForm() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
  const [userDelete, setUserDelete] = useState<string | null>(null);

  async function handleDeleteAccount(e: MouseEvent) {
    e.preventDefault();
    setDeleteError(null);
    setDeleteSuccess(null);
    setIsSubmitting(true);
    setUserDelete(null);

    try {
      const res = await fetch(`/api/v1/user`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const body = await res.json().catch(() => ({}));

      if (res.ok) {
        setDeleteSuccess(
          "Sua conta foi excluída com sucesso. Redirecionando...",
        );
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setDeleteError(
          body?.message ||
            "Falha ao excluir a conta. Verifique as credenciais.",
        );
      }
    } catch (err: any) {
      setDeleteError(err?.message || "Erro de rede.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={(e: SubmitEvent) => {
        e.preventDefault();
        setUserDelete("user");
      }}
      className="space-y-4"
    >
      <ConfirmDelete
        deleteState={userDelete}
        setDeleteState={setUserDelete}
        callback={(e: MouseEvent) => handleDeleteAccount(e)}
      >
        Você tem certeza que deseja excluir a conta? Esta ação não pode ser
        desfeita.
      </ConfirmDelete>

      {deleteError && <ErrorComponent>{deleteError}</ErrorComponent>}
      {deleteSuccess && <SuccessComponent>{deleteSuccess}</SuccessComponent>}

      <div>
        <label htmlFor="username" className="block text-sm font-medium mb-1">
          Confirme seu nome de usuário
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 px-3 py-2 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Confirme seu e-mail
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 px-3 py-2 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          placeholder="seu@email.com"
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Digite sua senha atual
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 px-3 py-2 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          placeholder="••••••••"
          required
        />
      </div>

      <div className="pt-2">
        <ButtonComponent isLoading={isSubmitting}>
          {isSubmitting ? "Excluindo conta..." : "Excluir conta"}
        </ButtonComponent>
      </div>
    </form>
  );
}
