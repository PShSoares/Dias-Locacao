export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f5e7cf,_#f8f5ef_40%,_#e7ecf4_100%)] px-6 py-12 text-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <section className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/70 p-8 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-12">
          <div className="mb-8 inline-flex rounded-full border border-amber-300 bg-amber-100 px-4 py-1 text-sm font-medium tracking-wide text-amber-900">
            Dias Locacao SaaS
          </div>
          <div className="grid gap-8 md:grid-cols-[1.4fr_0.8fr] md:items-end">
            <div>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">
                Base inicial do monorepo pronta para gestao moderna de locadora.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700">
                Frontend em Next.js, backend em NestJS, modelagem inicial com
                Prisma e ambiente local com Docker Compose para acelerar o
                desenvolvimento do produto.
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-slate-950 p-6 text-slate-50">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                Stack ativa
              </p>
              <ul className="mt-4 space-y-3 text-sm text-slate-200">
                <li>Next.js + React + TypeScript + TailwindCSS</li>
                <li>NestJS + REST API + JWT</li>
                <li>PostgreSQL + Prisma ORM</li>
                <li>Docker Compose para ambiente local</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          <article className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">Backend</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              API NestJS separada por dominio, pronta para receber autenticacao,
              RBAC, multi-tenant e regras de locacao.
            </p>
          </article>
          <article className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">Frontend</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              App Router preparado para dashboard, modulos operacionais e
              integracao com a API via services e hooks.
            </p>
          </article>
          <article className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">Dados</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Schema Prisma inicial com companies, users, clients, vehicles,
              rentals, contracts, payments e modulos auxiliares.
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}
