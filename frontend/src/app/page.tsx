"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../services/api";
import {
  clearSession,
  getSession,
  saveSession,
  type AuthSession,
} from "../services/session";

type Mode = "login" | "setup";

type AuthResponse = AuthSession;

const emptyLoginForm = {
  companyDocument: "",
  email: "",
  password: "",
};

const emptySetupForm = {
  companyName: "",
  companyDocument: "",
  adminName: "",
  adminEmail: "",
  adminPassword: "",
};

export default function Home() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginForm, setLoginForm] = useState(emptyLoginForm);
  const [setupForm, setSetupForm] = useState(emptySetupForm);

  useEffect(() => {
    const session = getSession();

    if (session?.accessToken) {
      router.replace("/dashboard");
    }
  }, [router]);

  const headline = useMemo(() => {
    if (mode === "setup") {
      return "Configure a primeira locadora e gere o admin inicial.";
    }

    return "Entre com a empresa e o usuario para abrir a operacao.";
  }, [mode]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    try {
      clearSession();

      const response = await apiFetch<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(loginForm),
      });

      saveSession(response);
      setMessage("Sessao iniciada. Redirecionando para o dashboard...");
      router.push("/dashboard");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Nao foi possivel entrar.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSetup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    try {
      clearSession();

      const response = await apiFetch<AuthResponse>("/auth/bootstrap", {
        method: "POST",
        body: JSON.stringify(setupForm),
      });

      saveSession(response);
      setMessage("Empresa criada e admin autenticado. Redirecionando...");
      router.push("/dashboard");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Nao foi possivel configurar a empresa.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,_#07111f_0%,_#0f2740_38%,_#f4efe6_38%,_#f7f1e8_100%)] px-5 py-10 text-slate-950 md:px-8 md:py-14">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[2rem] border border-white/10 bg-slate-950/85 p-8 text-white shadow-[0_30px_120px_rgba(2,6,23,0.45)] backdrop-blur md:p-10">
          <div className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">
            Sprint 1 em andamento
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
            Autenticacao, tenancy e acesso inicial da locadora.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
            Esta etapa cria a primeira empresa, provisiona o admin e valida o
            fluxo de login sobre NestJS, Prisma e JWT antes dos modulos
            operacionais entrarem em producao.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <article className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <p className="text-sm uppercase tracking-[0.22em] text-cyan-200">
                Auth API
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Bootstrap inicial, login JWT e rota protegida de perfil.
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <p className="text-sm uppercase tracking-[0.22em] text-cyan-200">
                Tenancy
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Usuario sempre atrelado a uma empresa via documento unico.
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <p className="text-sm uppercase tracking-[0.22em] text-cyan-200">
                Frontend
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Tela de acesso, setup e dashboard minimo para liberar a proxima
                fase.
              </p>
            </article>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200/70 bg-white/90 p-6 shadow-[0_25px_80px_rgba(15,23,42,0.12)] backdrop-blur md:p-8">
          <div className="flex gap-3 rounded-full bg-slate-100 p-1">
            <button
              className={`flex-1 rounded-full px-4 py-3 text-sm font-semibold transition ${
                mode === "login"
                  ? "bg-slate-950 text-white"
                  : "text-slate-600 hover:text-slate-950"
              }`}
              onClick={() => setMode("login")}
              type="button"
            >
              Entrar
            </button>
            <button
              className={`flex-1 rounded-full px-4 py-3 text-sm font-semibold transition ${
                mode === "setup"
                  ? "bg-slate-950 text-white"
                  : "text-slate-600 hover:text-slate-950"
              }`}
              onClick={() => setMode("setup")}
              type="button"
            >
              Primeira configuracao
            </button>
          </div>

          <div className="mt-6">
            <p className="text-sm uppercase tracking-[0.26em] text-amber-700">
              {mode === "setup" ? "Setup inicial" : "Login da empresa"}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              {headline}
            </h2>
          </div>

          {message ? (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              {message}
            </div>
          ) : null}

          {error ? (
            <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          {mode === "login" ? (
            <form className="mt-8 space-y-4" onSubmit={handleLogin}>
              <Field
                label="Documento da empresa"
                placeholder="CNPJ ou documento cadastrado"
                value={loginForm.companyDocument}
                onChange={(value) =>
                  setLoginForm((current) => ({
                    ...current,
                    companyDocument: value,
                  }))
                }
              />
              <Field
                label="Email"
                placeholder="admin@locadora.com"
                type="email"
                value={loginForm.email}
                onChange={(value) =>
                  setLoginForm((current) => ({ ...current, email: value }))
                }
              />
              <Field
                label="Senha"
                placeholder="Sua senha"
                type="password"
                value={loginForm.password}
                onChange={(value) =>
                  setLoginForm((current) => ({ ...current, password: value }))
                }
              />

              <button
                className="mt-4 w-full rounded-[1.25rem] bg-amber-500 px-5 py-4 text-sm font-semibold text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? "Validando acesso..." : "Entrar no dashboard"}
              </button>
            </form>
          ) : (
            <form className="mt-8 space-y-4" onSubmit={handleSetup}>
              <Field
                label="Nome da empresa"
                placeholder="Dias Locacao"
                value={setupForm.companyName}
                onChange={(value) =>
                  setSetupForm((current) => ({
                    ...current,
                    companyName: value,
                  }))
                }
              />
              <Field
                label="Documento da empresa"
                placeholder="CNPJ ou documento unico"
                value={setupForm.companyDocument}
                onChange={(value) =>
                  setSetupForm((current) => ({
                    ...current,
                    companyDocument: value,
                  }))
                }
              />
              <Field
                label="Nome do admin"
                placeholder="Responsavel principal"
                value={setupForm.adminName}
                onChange={(value) =>
                  setSetupForm((current) => ({ ...current, adminName: value }))
                }
              />
              <Field
                label="Email do admin"
                placeholder="admin@locadora.com"
                type="email"
                value={setupForm.adminEmail}
                onChange={(value) =>
                  setSetupForm((current) => ({ ...current, adminEmail: value }))
                }
              />
              <Field
                label="Senha inicial"
                placeholder="Minimo de 6 caracteres"
                type="password"
                value={setupForm.adminPassword}
                onChange={(value) =>
                  setSetupForm((current) => ({
                    ...current,
                    adminPassword: value,
                  }))
                }
              />

              <button
                className="mt-4 w-full rounded-[1.25rem] bg-slate-950 px-5 py-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? "Criando empresa..." : "Criar empresa e admin"}
              </button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}

type FieldProps = {
  label: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  value: string;
};

function Field({
  label,
  onChange,
  placeholder,
  type = "text",
  value,
}: FieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </span>
      <input
        className="w-full rounded-[1.1rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
        value={value}
      />
    </label>
  );
}
