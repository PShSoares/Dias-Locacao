"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../services/api";
import {
  clearSession,
  getSession,
  saveSession,
  type AuthSession,
} from "../../services/session";

type ProfileResponse = {
  user: AuthSession["user"];
};

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const currentSession = getSession();

    if (!currentSession?.accessToken) {
      router.replace("/");
      return;
    }

    setSession(currentSession);

    apiFetch<ProfileResponse>("/auth/me", {
      method: "GET",
      token: currentSession.accessToken,
    })
      .then((response) => {
        const nextSession = {
          accessToken: currentSession.accessToken,
          user: response.user,
        };

        saveSession(nextSession);
        setSession(nextSession);
      })
      .catch((requestError) => {
        clearSession();
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Sua sessao expirou.",
        );
        router.replace("/");
      });
  }, [router]);

  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <p className="text-sm uppercase tracking-[0.26em] text-slate-300">
          Carregando sessao...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#08111c_0%,_#0d1b2c_28%,_#f5efe7_28%,_#f5efe7_100%)] px-5 py-10 text-slate-950 md:px-8 md:py-12">
      <div className="mx-auto max-w-6xl">
        <section className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-8 text-white shadow-[0_30px_120px_rgba(2,6,23,0.45)]">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.26em] text-cyan-200">
                Dashboard inicial
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
                {session.user.company.name}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
                A Sprint 1 entregou o primeiro acesso autenticado da empresa.
                Agora a base esta pronta para usuarios, veiculos, clientes e
                locacoes.
              </p>
            </div>
            <button
              className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              onClick={() => {
                clearSession();
                router.push("/");
              }}
              type="button"
            >
              Sair
            </button>
          </div>
        </section>

        {error ? (
          <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <section className="mt-8 grid gap-6 md:grid-cols-3">
          <article className="rounded-[1.6rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">
              Usuario ativo
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-slate-950">
              {session.user.name}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {session.user.email}
            </p>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Perfil: {session.user.role}
            </p>
          </article>
          <article className="rounded-[1.6rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">
              Identificacao da empresa
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-slate-950">
              {session.user.company.document}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Documento usado como chave de acesso inicial do tenant.
            </p>
          </article>
          <article className="rounded-[1.6rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">
              Proximo passo
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-slate-950">
              Cadastros base
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Clientes, veiculos e regras iniciais de locacao entram a partir
              daqui.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                className="rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white"
                href="/dashboard/clients"
              >
                Clientes
              </Link>
              <Link
                className="rounded-full bg-amber-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-950"
                href="/dashboard/vehicles"
              >
                Veiculos
              </Link>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
