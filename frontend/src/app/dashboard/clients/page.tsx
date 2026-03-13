"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../../services/api";
import {
  clearSession,
  getSession,
  type AuthSession,
} from "../../../services/session";

type ClientItem = {
  id: string;
  type: "PF" | "PJ";
  fullName: string;
  cpfCnpj: string | null;
  phone: string | null;
  email: string | null;
  status: "ACTIVE" | "BLOCKED" | "DEFAULTING";
};

type CreateClientPayload = {
  type: "PF" | "PJ";
  fullName: string;
  cpfCnpj?: string;
  phone?: string;
  email?: string;
};

export default function ClientsPage() {
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<CreateClientPayload>({
    type: "PF",
    fullName: "",
    cpfCnpj: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    const current = getSession();

    if (!current?.accessToken) {
      router.replace("/");
      return;
    }

    setSession(current);
    void loadClients(current.accessToken, "");
  }, [router]);

  async function loadClients(token: string, term: string) {
    setIsLoading(true);
    setError(null);

    try {
      const query = term ? `?search=${encodeURIComponent(term)}` : "";
      const response = await apiFetch<ClientItem[]>(`/clients${query}`, {
        method: "GET",
        token,
      });
      setClients(response);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Erro ao carregar clientes.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!session) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await apiFetch<ClientItem>("/clients", {
        method: "POST",
        token: session.accessToken,
        body: JSON.stringify({
          ...form,
          cpfCnpj: form.cpfCnpj?.trim() || undefined,
          phone: form.phone?.trim() || undefined,
          email: form.email?.trim() || undefined,
        }),
      });

      setForm({ type: "PF", fullName: "", cpfCnpj: "", phone: "", email: "" });
      await loadClients(session.accessToken, search);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Erro ao criar cliente.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-8 text-slate-900 md:px-8 md:py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
                Sprint 2
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                Clientes
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Tenant: {session?.user.company.name ?? "..."}
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]"
                href="/dashboard"
              >
                Dashboard
              </Link>
              <Link
                className="rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white"
                href="/dashboard/vehicles"
              >
                Veiculos
              </Link>
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-lg font-semibold">Novo cliente</h2>
          <form
            className="mt-4 grid gap-3 md:grid-cols-2"
            onSubmit={handleSubmit}
          >
            <select
              className="rounded-xl border border-slate-200 px-3 py-3 text-sm"
              value={form.type}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  type: event.target.value as "PF" | "PJ",
                }))
              }
            >
              <option value="PF">Pessoa fisica</option>
              <option value="PJ">Pessoa juridica</option>
            </select>
            <input
              className="rounded-xl border border-slate-200 px-3 py-3 text-sm"
              placeholder="Nome completo"
              value={form.fullName}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  fullName: event.target.value,
                }))
              }
              required
            />
            <input
              className="rounded-xl border border-slate-200 px-3 py-3 text-sm"
              placeholder="CPF/CNPJ"
              value={form.cpfCnpj}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  cpfCnpj: event.target.value,
                }))
              }
            />
            <input
              className="rounded-xl border border-slate-200 px-3 py-3 text-sm"
              placeholder="Telefone"
              value={form.phone}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  phone: event.target.value,
                }))
              }
            />
            <input
              className="rounded-xl border border-slate-200 px-3 py-3 text-sm md:col-span-2"
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  email: event.target.value,
                }))
              }
            />
            <button
              className="rounded-xl bg-amber-500 px-4 py-3 text-sm font-semibold text-slate-950 md:col-span-2"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Salvando..." : "Cadastrar cliente"}
            </button>
          </form>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Lista de clientes</h2>
            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm md:w-80"
              placeholder="Buscar por nome/email/documento"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && session) {
                  void loadClients(session.accessToken, search);
                }
              }}
            />
          </div>

          {error ? <p className="mt-4 text-sm text-rose-700">{error}</p> : null}

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="px-3 py-2">Nome</th>
                  <th className="px-3 py-2">Tipo</th>
                  <th className="px-3 py-2">Documento</th>
                  <th className="px-3 py-2">Contato</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td className="px-3 py-3 text-slate-500" colSpan={5}>
                      Carregando...
                    </td>
                  </tr>
                ) : clients.length === 0 ? (
                  <tr>
                    <td className="px-3 py-3 text-slate-500" colSpan={5}>
                      Nenhum cliente cadastrado.
                    </td>
                  </tr>
                ) : (
                  clients.map((client) => (
                    <tr className="border-b border-slate-100" key={client.id}>
                      <td className="px-3 py-3">{client.fullName}</td>
                      <td className="px-3 py-3">{client.type}</td>
                      <td className="px-3 py-3">{client.cpfCnpj ?? "-"}</td>
                      <td className="px-3 py-3">
                        {client.email ?? client.phone ?? "-"}
                      </td>
                      <td className="px-3 py-3">{client.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {session ? (
            <button
              className="mt-4 rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]"
              onClick={() => void loadClients(session.accessToken, search)}
              type="button"
            >
              Atualizar lista
            </button>
          ) : null}
        </section>

        <button
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-rose-700"
          onClick={() => {
            clearSession();
            router.push("/");
          }}
          type="button"
        >
          Encerrar sessao
        </button>
      </div>
    </main>
  );
}
