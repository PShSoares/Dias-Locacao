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

type VehicleItem = {
  id: string;
  brand: string;
  model: string;
  year: number;
  plate: string;
  chassis: string;
  status: "AVAILABLE" | "RENTED" | "MAINTENANCE" | "SOLD";
  dailyRate: string;
  currentMileage: number;
};

type CreateVehiclePayload = {
  brand: string;
  model: string;
  year: number;
  plate: string;
  chassis: string;
  dailyRate: number;
  currentMileage: number;
};

type UpdateVehiclePayload = {
  brand: string;
  model: string;
  year: number;
  plate: string;
  chassis: string;
  dailyRate: number;
  currentMileage: number;
  status: "AVAILABLE" | "RENTED" | "MAINTENANCE" | "SOLD";
};

export default function VehiclesPage() {
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [vehicles, setVehicles] = useState<VehicleItem[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [processingVehicleId, setProcessingVehicleId] = useState<string | null>(
    null,
  );
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<CreateVehiclePayload>({
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    plate: "",
    chassis: "",
    dailyRate: 0,
    currentMileage: 0,
  });
  const [editForm, setEditForm] = useState<UpdateVehiclePayload>({
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    plate: "",
    chassis: "",
    dailyRate: 0,
    currentMileage: 0,
    status: "AVAILABLE",
  });

  useEffect(() => {
    const current = getSession();

    if (!current?.accessToken) {
      router.replace("/");
      return;
    }

    setSession(current);
    void loadVehicles(current.accessToken, "");
  }, [router]);

  async function loadVehicles(token: string, term: string) {
    setIsLoading(true);
    setError(null);

    try {
      const query = term ? `?search=${encodeURIComponent(term)}` : "";
      const response = await apiFetch<VehicleItem[]>(`/vehicles${query}`, {
        method: "GET",
        token,
      });
      setVehicles(response);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Erro ao carregar veiculos.",
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
      await apiFetch<VehicleItem>("/vehicles", {
        method: "POST",
        token: session.accessToken,
        body: JSON.stringify(form),
      });

      setForm({
        brand: "",
        model: "",
        year: new Date().getFullYear(),
        plate: "",
        chassis: "",
        dailyRate: 0,
        currentMileage: 0,
      });
      await loadVehicles(session.accessToken, search);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Erro ao criar veiculo.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function openEditVehicle(vehicle: VehicleItem) {
    setEditingVehicleId(vehicle.id);
    setEditForm({
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      plate: vehicle.plate,
      chassis: vehicle.chassis,
      dailyRate: Number(vehicle.dailyRate),
      currentMileage: vehicle.currentMileage,
      status: vehicle.status,
    });
  }

  function closeEditVehicle() {
    setEditingVehicleId(null);
    setEditForm({
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      plate: "",
      chassis: "",
      dailyRate: 0,
      currentMileage: 0,
      status: "AVAILABLE",
    });
  }

  async function handleUpdateVehicle(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!session || !editingVehicleId) {
      return;
    }

    setIsEditing(true);
    setError(null);

    try {
      await apiFetch<VehicleItem>(`/vehicles/${editingVehicleId}`, {
        method: "PATCH",
        token: session.accessToken,
        body: JSON.stringify(editForm),
      });

      closeEditVehicle();
      await loadVehicles(session.accessToken, search);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Erro ao atualizar veiculo.",
      );
    } finally {
      setIsEditing(false);
    }
  }

  async function handleDeleteVehicle(vehicleId: string) {
    if (!session) {
      return;
    }

    const shouldDelete = window.confirm(
      "Deseja realmente excluir este veiculo?",
    );

    if (!shouldDelete) {
      return;
    }

    setProcessingVehicleId(vehicleId);
    setError(null);

    try {
      await apiFetch<void>(`/vehicles/${vehicleId}`, {
        method: "DELETE",
        token: session.accessToken,
      });

      if (editingVehicleId === vehicleId) {
        closeEditVehicle();
      }

      await loadVehicles(session.accessToken, search);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Erro ao excluir veiculo.",
      );
    } finally {
      setProcessingVehicleId(null);
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
                Veiculos
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
                href="/dashboard/clients"
              >
                Clientes
              </Link>
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-lg font-semibold">Novo veiculo</h2>
          <form
            className="mt-4 grid gap-3 md:grid-cols-2"
            onSubmit={handleSubmit}
          >
            <input
              className="rounded-xl border border-slate-200 px-3 py-3 text-sm"
              placeholder="Marca"
              value={form.brand}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  brand: event.target.value,
                }))
              }
              required
            />
            <input
              className="rounded-xl border border-slate-200 px-3 py-3 text-sm"
              placeholder="Modelo"
              value={form.model}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  model: event.target.value,
                }))
              }
              required
            />
            <input
              className="rounded-xl border border-slate-200 px-3 py-3 text-sm"
              min={1900}
              placeholder="Ano"
              type="number"
              value={form.year}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  year: Number(event.target.value),
                }))
              }
              required
            />
            <input
              className="rounded-xl border border-slate-200 px-3 py-3 text-sm"
              placeholder="Placa"
              value={form.plate}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  plate: event.target.value,
                }))
              }
              required
            />
            <input
              className="rounded-xl border border-slate-200 px-3 py-3 text-sm"
              placeholder="Chassi"
              value={form.chassis}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  chassis: event.target.value,
                }))
              }
              required
            />
            <input
              className="rounded-xl border border-slate-200 px-3 py-3 text-sm"
              min={0}
              step="0.01"
              placeholder="Diaria"
              type="number"
              value={form.dailyRate}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  dailyRate: Number(event.target.value),
                }))
              }
              required
            />
            <input
              className="rounded-xl border border-slate-200 px-3 py-3 text-sm md:col-span-2"
              min={0}
              placeholder="Quilometragem atual"
              type="number"
              value={form.currentMileage}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  currentMileage: Number(event.target.value),
                }))
              }
            />
            <button
              className="rounded-xl bg-amber-500 px-4 py-3 text-sm font-semibold text-slate-950 md:col-span-2"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Salvando..." : "Cadastrar veiculo"}
            </button>
          </form>
        </section>

        {editingVehicleId ? (
          <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-lg font-semibold">Editar veiculo</h2>
            <form
              className="mt-4 grid gap-3 md:grid-cols-2"
              onSubmit={handleUpdateVehicle}
            >
              <input
                className="rounded-xl border border-slate-200 px-3 py-3 text-sm"
                placeholder="Marca"
                value={editForm.brand}
                onChange={(event) =>
                  setEditForm((current) => ({
                    ...current,
                    brand: event.target.value,
                  }))
                }
                required
              />
              <input
                className="rounded-xl border border-slate-200 px-3 py-3 text-sm"
                placeholder="Modelo"
                value={editForm.model}
                onChange={(event) =>
                  setEditForm((current) => ({
                    ...current,
                    model: event.target.value,
                  }))
                }
                required
              />
              <input
                className="rounded-xl border border-slate-200 px-3 py-3 text-sm"
                min={1900}
                placeholder="Ano"
                type="number"
                value={editForm.year}
                onChange={(event) =>
                  setEditForm((current) => ({
                    ...current,
                    year: Number(event.target.value),
                  }))
                }
                required
              />
              <input
                className="rounded-xl border border-slate-200 px-3 py-3 text-sm"
                placeholder="Placa"
                value={editForm.plate}
                onChange={(event) =>
                  setEditForm((current) => ({
                    ...current,
                    plate: event.target.value,
                  }))
                }
                required
              />
              <input
                className="rounded-xl border border-slate-200 px-3 py-3 text-sm"
                placeholder="Chassi"
                value={editForm.chassis}
                onChange={(event) =>
                  setEditForm((current) => ({
                    ...current,
                    chassis: event.target.value,
                  }))
                }
                required
              />
              <input
                className="rounded-xl border border-slate-200 px-3 py-3 text-sm"
                min={0}
                step="0.01"
                placeholder="Diaria"
                type="number"
                value={editForm.dailyRate}
                onChange={(event) =>
                  setEditForm((current) => ({
                    ...current,
                    dailyRate: Number(event.target.value),
                  }))
                }
                required
              />
              <input
                className="rounded-xl border border-slate-200 px-3 py-3 text-sm"
                min={0}
                placeholder="Quilometragem atual"
                type="number"
                value={editForm.currentMileage}
                onChange={(event) =>
                  setEditForm((current) => ({
                    ...current,
                    currentMileage: Number(event.target.value),
                  }))
                }
              />
              <select
                className="rounded-xl border border-slate-200 px-3 py-3 text-sm"
                value={editForm.status}
                onChange={(event) =>
                  setEditForm((current) => ({
                    ...current,
                    status: event.target.value as
                      | "AVAILABLE"
                      | "RENTED"
                      | "MAINTENANCE"
                      | "SOLD",
                  }))
                }
              >
                <option value="AVAILABLE">Disponivel</option>
                <option value="RENTED">Locado</option>
                <option value="MAINTENANCE">Manutencao</option>
                <option value="SOLD">Vendido</option>
              </select>
              <div className="flex gap-2 md:col-span-2">
                <button
                  className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white"
                  disabled={isEditing}
                  type="submit"
                >
                  {isEditing ? "Salvando..." : "Salvar alteracoes"}
                </button>
                <button
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold"
                  onClick={closeEditVehicle}
                  type="button"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </section>
        ) : null}

        <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Lista de veiculos</h2>
            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm md:w-80"
              placeholder="Buscar por marca/modelo/placa"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && session) {
                  void loadVehicles(session.accessToken, search);
                }
              }}
            />
          </div>

          {error ? <p className="mt-4 text-sm text-rose-700">{error}</p> : null}

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="px-3 py-2">Veiculo</th>
                  <th className="px-3 py-2">Placa</th>
                  <th className="px-3 py-2">Km</th>
                  <th className="px-3 py-2">Diaria</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Acoes</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td className="px-3 py-3 text-slate-500" colSpan={6}>
                      Carregando...
                    </td>
                  </tr>
                ) : vehicles.length === 0 ? (
                  <tr>
                    <td className="px-3 py-3 text-slate-500" colSpan={6}>
                      Nenhum veiculo cadastrado.
                    </td>
                  </tr>
                ) : (
                  vehicles.map((vehicle) => (
                    <tr className="border-b border-slate-100" key={vehicle.id}>
                      <td className="px-3 py-3">
                        {vehicle.brand} {vehicle.model} ({vehicle.year})
                      </td>
                      <td className="px-3 py-3">{vehicle.plate}</td>
                      <td className="px-3 py-3">{vehicle.currentMileage}</td>
                      <td className="px-3 py-3">
                        R$ {Number(vehicle.dailyRate).toFixed(2)}
                      </td>
                      <td className="px-3 py-3">{vehicle.status}</td>
                      <td className="px-3 py-3">
                        <div className="flex gap-2">
                          <button
                            className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold"
                            onClick={() => openEditVehicle(vehicle)}
                            type="button"
                          >
                            Editar
                          </button>
                          <button
                            className="rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700"
                            disabled={processingVehicleId === vehicle.id}
                            onClick={() => void handleDeleteVehicle(vehicle.id)}
                            type="button"
                          >
                            {processingVehicleId === vehicle.id
                              ? "Excluindo..."
                              : "Excluir"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {session ? (
            <button
              className="mt-4 rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]"
              onClick={() => void loadVehicles(session.accessToken, search)}
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
