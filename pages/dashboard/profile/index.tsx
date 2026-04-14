import useSWR from "swr";
import { useState, SubmitEvent, MouseEvent } from "react";
import { useRouter } from "next/router";

import { User } from "@/types/types";
import LayoutDashboard from "@/components/layout/Dashboard";
import { fetcher } from "@/infra/fetcher";
import ErrorComponent from "@/components/error";
import ButtonComponent from "@/components/button";
import SuccessComponent from "@/components/success";

export default function ProfilePage() {
  const router = useRouter();

  const { data: user, mutate } = useSWR<User>("/api/v1/user", fetcher);

  function editPassword(e: MouseEvent) {
    e.preventDefault();
    router.push("/recovery");
  }

  return (
    <LayoutDashboard>
      <h1 className="text-2xl font-semibold mb-6">Meu Perfil</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Informações do Perfil</h2>
          {user ? (
            <ProfileForm user={user} mutate={mutate} />
          ) : (
            <div className="animate-pulse">
              <div className="h-20 rounded bg-zinc-200 dark:bg-zinc-800" />
            </div>
          )}
        </section>

        <div className="border-t border-zinc-200 dark:border-zinc-800"></div>

        <section>
          <h2 className="text-xl font-semibold mb-4">Alteração de Senha</h2>
          <p>Para alterar a senha, clique no botão abaixo.</p>
          <button
            className="mt-4 inline-flex items-center px-4 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
            onClick={(e) => editPassword(e)}
          >
            Alterar Senha
          </button>
        </section>
      </div>
    </LayoutDashboard>
  );
}

function ProfileForm({ user, mutate }: { user: User; mutate: any }) {
  const [username, setUsername] = useState(user.username || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);

  async function handleProfileUpdate(e: SubmitEvent) {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(null);
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/v1/users/${user?.username}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      const body = await res.json().catch(() => ({}));

      const newUser = {
        ...user,
        username: username,
      };

      mutate(newUser);

      if (res.ok) {
        setProfileSuccess("Perfil atualizado com sucesso!");
      } else {
        setProfileError(body?.message || "Falha ao atualizar o perfil.");
      }
    } catch (err: any) {
      setProfileError(err?.message || "Erro de rede.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-lg">
      {profileError && <ErrorComponent>{profileError}</ErrorComponent>}
      {profileSuccess && <SuccessComponent>{profileSuccess}</SuccessComponent>}

      <div>
        <label htmlFor="username" className="block text-sm font-medium mb-1">
          Nome de usuário
        </label>
        <input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 px-3 py-2 bg-transparent text-sm"
          placeholder="Seu nome de usuário"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          id="email"
          value={user?.email}
          className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 px-3 py-2 bg-gray-800 outline-0 text-sm cursor-auto"
          readOnly={true}
        />
      </div>

      <div>
        <ButtonComponent isLoading={isSubmitting}>
          {isSubmitting ? "Salvando" : "Salvar alterações"}
        </ButtonComponent>
      </div>
    </form>
  );
}
