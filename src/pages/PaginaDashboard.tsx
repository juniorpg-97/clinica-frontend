import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  CalendarDays,
  ClipboardList,
  Activity,
  ArrowRight,
} from "lucide-react";

import type { Metrica } from "../types";
import MetricCard from "../componentes/MetricCard";
import StatusBadge from "../componentes/StatusBadge";
import Encabezado from "../componentes/layout/Encabezado";

export default function PaginaDashboard() {
  const [pacientes, setPacientes] = useState<number>(128);
  const [mantenimiento, setMantenimiento] = useState<boolean>(false);

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
      titulo: "Citas hoy",
      valor: 24,
      descripcion: "Citas programadas para hoy",
      tendencia: "positiva",
      icono: "📅",
    },
    {
      id: "consultas",
      titulo: "Consultas pendientes",
      valor: 8,
      descripcion: "Consultas por atender",
      tendencia: "neutra",
      icono: "📋",
    },
    {
      id: "disponibilidad",
      titulo: "Disponibilidad",
      valor: mantenimiento ? "Inactiva" : "Activa",
      descripcion: mantenimiento
        ? "Sistema en mantenimiento"
        : "Sistema operativo",
      tendencia: mantenimiento ? "negativa" : "positiva",
      icono: "💚",
    },
  ];

  return (
    <div className="min-h-screen">
      <Encabezado
        titulo="Dashboard"
        descripcion="Resumen general de Clínica Salud Integral."
      />

      <div className="space-y-8 p-6 sm:p-8">
        {mantenimiento && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800"
          >
            <h2 className="font-semibold">Sistema en mantenimiento</h2>

            <p className="mt-1 text-sm">
              El sistema se encuentra temporalmente en mantenimiento.
            </p>
          </div>
        )}

        <section>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Resumen general
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Consulta el estado actual de la clínica.
              </p>
            </div>

            <Link
              to="/pacientes"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
            >
              <Users size={18} />
              Ver pacientes
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {metricas.map((metrica) => (
              <MetricCard key={metrica.id} metrica={metrica} />
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-teal-50 p-3 text-teal-700">
                <Users size={24} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Gestión de pacientes
                </h2>

                <p className="text-sm text-slate-500">
                  Contador de pacientes registrados.
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <button
                type="button"
                onClick={() =>
                  setPacientes((actual) => Math.max(0, actual - 1))
                }
                aria-label="Disminuir pacientes"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-300 text-xl font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                −
              </button>

              <span className="min-w-16 text-center text-3xl font-bold text-slate-900">
                {pacientes}
              </span>

              <button
                type="button"
                onClick={() => setPacientes((actual) => actual + 1)}
                aria-label="Aumentar pacientes"
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-600 text-xl font-semibold text-white transition hover:bg-teal-700"
              >
                +
              </button>
            </div>

            <Link
              to="/pacientes"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-900"
            >
              Ir al listado de pacientes
              <ArrowRight size={16} />
            </Link>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div
                className={`rounded-xl p-3 ${
                  mantenimiento
                    ? "bg-red-50 text-red-600"
                    : "bg-emerald-50 text-emerald-600"
                }`}
              >
                <Activity size={24} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Estado del sistema
                </h2>

                <p className="text-sm text-slate-500">
                  Control del modo de mantenimiento.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <StatusBadge activo={!mantenimiento} />

              <button
                type="button"
                onClick={() => setMantenimiento((actual) => !actual)}
                className={`rounded-xl px-5 py-3 text-sm font-semibold text-white transition ${
                  mantenimiento
                    ? "bg-teal-600 hover:bg-teal-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {mantenimiento
                  ? "Desactivar mantenimiento"
                  : "Activar mantenimiento"}
              </button>
            </div>

            <div className="mt-6 flex items-center gap-3 rounded-xl bg-slate-50 p-4">
              <CalendarDays size={20} className="text-slate-500" />

              <p className="text-sm text-slate-600">
                {mantenimiento
                  ? "El modo de mantenimiento está activado."
                  : "La clínica se encuentra operativa."}
              </p>
            </div>
          </article>
        </section>

        <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
          <ClipboardList size={22} className="shrink-0 text-blue-700" />

          <div>
            <h2 className="font-semibold text-blue-900">Recordatorio</h2>

            <p className="mt-1 text-sm text-blue-800">
              Puedes administrar pacientes y registrar nuevas citas desde las
              opciones del menú lateral.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
