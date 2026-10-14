import { useState } from "react";
import type { Metrica } from "../types";
import MetricCard from "../componentes/MetricCard";
import StatusBadge from "../componentes/StatusBadge";
import Encabezado from "../componentes/layout/Encabezado";

const metricasIniciales: Metrica[] = [
  {
    id: "pacientes",
    titulo: "Pacientes",
    valor: 128,
    descripcion: "Pacientes registrados en la clínica",
    tendencia: "positiva",
    icono: "♙",
  },
  {
    id: "citas",
    titulo: "Citas Hoy",
    valor: 18,
    descripcion: "Citas programadas para hoy",
    tendencia: "neutra",
    icono: "▦",
  },
  {
    id: "consultas",
    titulo: "Consultas Pendientes",
    valor: 7,
    descripcion: "Consultas por atender",
    tendencia: "negativa",
    icono: "◷",
  },
  {
    id: "disponibilidad",
    titulo: "Disponibilidad",
    valor: "85%",
    descripcion: "Disponibilidad general de atención",
    tendencia: "positiva",
    icono: "♡",
  },
];

export default function PaginaDashboard() {
  const [metricas, setMetricas] = useState<Metrica[]>(metricasIniciales);

  const [mantenimiento, setMantenimiento] = useState<boolean>(false);

  const modificarPacientes = (cantidad: number) => {
    setMetricas((actuales) =>
      actuales.map((metrica) => {
        if (metrica.id !== "pacientes") {
          return metrica;
        }

        const valorActual =
          typeof metrica.valor === "number" ? metrica.valor : 0;

        return {
          ...metrica,
          valor: Math.max(0, valorActual + cantidad),
        };
      }),
    );
  };

  return (
    <div className="min-h-full">
      <Encabezado
        titulo="Dashboard"
        descripcion="Resumen general de la actividad de la clínica."
      />

      <main className="space-y-8 p-4 sm:p-6 lg:p-8">
        {mantenimiento && (
          <div
            role="alert"
            className="flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-semibold text-rose-800">
                Modo mantenimiento activado
              </p>
              <p className="mt-1 text-sm text-rose-700">
                El sistema se encuentra en mantenimiento.
              </p>
            </div>

            <span className="text-sm font-semibold text-rose-700">
              Atención
            </span>
          </div>
        )}

        <section>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Resumen general
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Indicadores principales de la clínica.
              </p>
            </div>

            <StatusBadge activo={!mantenimiento} />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {metricas.map((metrica) => (
              <div key={metrica.id}>
                <MetricCard metrica={metrica} />

                {metrica.id === "pacientes" && (
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => modificarPacientes(-1)}
                      disabled={
                        typeof metrica.valor !== "number" || metrica.valor === 0
                      }
                      aria-label="Disminuir pacientes"
                      className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      − Disminuir
                    </button>

                    <button
                      type="button"
                      onClick={() => modificarPacientes(1)}
                      aria-label="Incrementar pacientes"
                      className="flex-1 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700"
                    >
                      + Aumentar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-bold text-slate-900">Estado del sistema</h2>
              <p className="mt-1 text-sm text-slate-500">
                Control visual del modo de mantenimiento.
              </p>
            </div>

            <button
              type="button"
              aria-pressed={mantenimiento}
              onClick={() => setMantenimiento((actual) => !actual)}
              className={`rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                mantenimiento
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "bg-rose-600 text-white hover:bg-rose-700"
              }`}
            >
              {mantenimiento
                ? "Desactivar mantenimiento"
                : "Activar mantenimiento"}
            </button>
          </div>

          <div className="mt-5 border-t border-slate-100 pt-4">
            <StatusBadge activo={!mantenimiento} />
          </div>
        </section>
      </main>
    </div>
  );
}
