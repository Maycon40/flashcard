import { useState, SubmitEvent } from "react";

import { withAuth } from "@/infra/auth";
import { User } from "@/types/types";
import LayoutDashboard from "@/components/layout/Dashboard";

export const getServerSideProps = withAuth();

export default function ProfilePage({ user }: { user: User }) {
  const [username, setUsername] = useState(user.username || "");
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  async function handleProfileUpdate(e: SubmitEvent) {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(null);
    setProfileSubmitting(true);

    try {
      const res = await fetch(`/api/v1/users/${user?.username}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email: user.email }),
      });

      const body = await res.json().catch(() => ({}));

      if (res.ok) {
        setProfileSuccess("Perfil atualizado com sucesso!");
      } else {
        setProfileError(
          body?.action || body?.message || "Falha ao atualizar o perfil.",
        );
      }
    } catch (err: any) {
      setProfileError(err?.message || "Erro de rede.");
    } finally {
      setProfileSubmitting(false);
    }
  }

  async function handlePasswordChange(e: SubmitEvent) {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword !== confirmPassword) {
      setPasswordError("As novas senhas não coincidem.");
      return;
    }
    if (!currentPassword || !newPassword) {
      setPasswordError("Todos os campos de senha são obrigatórios.");
      return;
    }

    setPasswordSubmitting(true);

    try {
      const res = await fetch(`/api/v1/users/${user?.username}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: newPassword,
          old_password: currentPassword,
        }),
      });

      const body = await res.json().catch(() => ({}));

      if (res.ok) {
        setPasswordSuccess("Senha alterada com sucesso!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordError(
          body?.action || body?.message || "Falha ao alterar a senha.",
        );
      }
    } catch (err: any) {
      setPasswordError(err?.message || "Erro de rede.");
    } finally {
      setPasswordSubmitting(false);
    }
  }

  if (!user) {
    return (
      <LayoutDashboard>
        <div className="animate-pulse">
          <div className="h-8 w-48 rounded bg-zinc-200 dark:bg-zinc-800 mb-6" />
          <div className="space-y-4">
            <div className="h-20 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-20 rounded bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </div>
      </LayoutDashboard>
    );
  }

  return (
    <LayoutDashboard>
      <h1 className="text-2xl font-semibold mb-6">Meu Perfil</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Informações do Perfil</h2>
          <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-lg">
            {profileError && (
              <div className="text-sm text-red-600">{profileError}</div>
            )}
            {profileSuccess && (
              <div className="text-sm text-green-600">{profileSuccess}</div>
            )}

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium mb-1"
              >
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
                value={user.email}
                className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 px-3 py-2 bg-gray-800 outline-0 text-sm cursor-auto"
                readOnly={true}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={profileSubmitting}
                className={`inline-flex items-center px-4 py-2 rounded-md text-white ${
                  profileSubmitting
                    ? "bg-indigo-300 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {profileSubmitting ? "Salvando..." : "Salvar alterações"}
              </button>
            </div>
          </form>
        </section>

        <div className="border-t border-zinc-200 dark:border-zinc-800"></div>

        <section>
          <h2 className="text-xl font-semibold mb-4">Alterar Senha</h2>
          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-lg">
            {passwordError && (
              <div className="text-sm text-red-600">{passwordError}</div>
            )}
            {passwordSuccess && (
              <div className="text-sm text-green-600">{passwordSuccess}</div>
            )}

            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium mb-1"
              >
                Senha atual
              </label>
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 px-3 py-2 bg-transparent text-sm"
                placeholder="Sua senha atual"
              />
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium mb-1"
              >
                Nova senha
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 px-3 py-2 bg-transparent text-sm"
                placeholder="Crie uma nova senha"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium mb-1"
              >
                Confirme a nova senha
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 px-3 py-2 bg-transparent text-sm"
                placeholder="Repita a nova senha"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={passwordSubmitting}
                className={`inline-flex items-center px-4 py-2 rounded-md text-white ${
                  passwordSubmitting
                    ? "bg-indigo-300 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {passwordSubmitting ? "Alterando..." : "Alterar senha"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </LayoutDashboard>
  );
}
