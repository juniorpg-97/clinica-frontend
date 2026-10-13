import { useState } from "react";
import MetricCard from "../componentes/MetricCard";
import StatusBadge from "../componentes/StatusBadge";
import type { Metrica } from "../types";

export default function PaginaDashboard() {
  const [pacientes, setPacientes] = useState<number>(128);
  const [citasHoy] = useState<number>(24);
  const [consultasPendientes] = useState<number>(8);
  const [disponibilidad] = useState<number>(92);
  const [mantenimiento, setMantenimiento] = useState<boolean>(false);

  const incrementarPacientes = () => {
    setPacientes((prev) => prev + 1);
  };

  const decrementarPacientes = () => {
    setPacientes((prev) => Math.max(0, prev - 1));
  };

  const metricas: Metrica[] = [
    {
      id: "pacientes",
      titulo: "Pacientes",
      valor: pacientes,
      descripcion: "Pacientes registrados",
      tendencia: "positiva",
      icono: "👥",
    },
    {
      id: "citas",
      titulo: "Citas Hoy",
      valor: citasHoy,
      descripcion: "Citas programadas para hoy",
      tendencia: "neutra",
      icono: "📅",
    },
    {
      id: "consultas",
      titulo: "Consultas Pendientes",
      valor: consultasPendientes,
      descripcion: "Consultas por atender",
      tendencia: "negativa",
      icono: "🩺",
    },
    {
      id: "disponibilidad",
      titulo: "Disponibilidad",
      valor: `${disponibilidad}%`,
      descripcion: "Disponibilidad de atención",
      tendencia: "positiva",
      icono: "📊",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      {mantenimiento && (
        <div
          role="alert"
          className="bg-rose-600 px-4 py-3 text-center font-medium text-white"
        >
          ⚠️ El sistema está en modo mantenimiento. Algunas funciones podrían no
          estar disponibles.
        </div>
      )}

      <div className="mx-auto max-w-7xl px-6 py-8">
        <header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-emerald-700">
              Clínica Salud Integral
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Dashboard
            </h1>

            <p className="mt-2 text-slate-500">
              Resumen general de la clínica.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge activo={!mantenimiento} />

            <button
              type="button"
              onClick={() => setMantenimiento((prev) => !prev)}
              className={`rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition ${
                mantenimiento
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-rose-600 hover:bg-rose-700"
              }`}
            >
              {mantenimiento
                ? "Desactivar mantenimiento"
                : "Activar mantenimiento"}
            </button>
          </div>
        </header>

        <section aria-labelledby="metricas-titulo">
          <div className="mb-5">
            <h2
              id="metricas-titulo"
              className="text-xl font-semibold text-slate-900"
            >
              Indicadores generales
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Estado actual de los servicios de la clínica.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {metricas.map((metrica) => (
              <MetricCard key={metrica.id} metrica={metrica} />
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Gestionar pacientes
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Actualiza el contador de pacientes registrados.
              </p>

              <p className="mt-3 text-2xl font-bold text-emerald-700">
                {pacientes} pacientes
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={decrementarPacientes}
                disabled={pacientes === 0}
                aria-label="Disminuir pacientes"
                className="rounded-lg border border-slate-300 px-5 py-3 text-xl font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                −
              </button>

              <button
                type="button"
                onClick={incrementarPacientes}
                aria-label="Aumentar pacientes"
                className="rounded-lg bg-emerald-600 px-5 py-3 text-xl font-bold text-white transition hover:bg-emerald-700"
              >
                +
              </button>
            </div>
          </div>
        </section>

        <footer className="mt-8 border-t border-slate-200 pt-5 text-center text-sm text-slate-400">
          Clínica Salud Integral · Panel administrativo
        </footer>
      </div>
    </main>
  );
}
