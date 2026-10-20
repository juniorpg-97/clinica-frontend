import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  CalendarDays,
  ClipboardList,
  Activity,
  ArrowRight,
} from "lucide-react";

import { api } from "../lib/axios";
import type { Metrica } from "../types";
import MetricCard from "../componentes/MetricCard";
import StatusBadge from "../componentes/StatusBadge";
import Encabezado from "../componentes/layout/Encabezado";

export default function PaginaDashboard() {
  const [totalPacientes, setTotalPacientes] = useState<number | null>(null);
  const [totalMedicos, setTotalMedicos] = useState<number | null>(null);
  const [citasProgramadas, setCitasProgramadas] = useState<number | null>(null);
  const [citasCompletadas, setCitasCompletadas] = useState<number | null>(null);

  const [mantenimiento, setMantenimiento] = useState<boolean>(false);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [intento, setIntento] = useState<number>(0);

  useEffect(() => {
    let activo = true;

    setCargando(true);
    setError(null);

    async function cargarMetricas() {
      try {
        const [pacientesRes, medicosRes, programadasRes, completadasRes] =
          await Promise.all([
            api.get("/pacientes"),
            api.get("/medicos"),
            api.get("/citas", {
              params: { estado: "Programada" },
            }),
            api.get("/citas", {
              params: { estado: "Completada" },
            }),
          ]);

        if (!activo) return;

        setTotalPacientes(
          Array.isArray(pacientesRes.data)
            ? pacientesRes.data.length
            : Array.isArray(pacientesRes.data.data)
              ? pacientesRes.data.data.length
              : pacientesRes.data.total,
        );

        setTotalMedicos(
          Array.isArray(medicosRes.data)
            ? medicosRes.data.length
            : medicosRes.data.total,
        );

        setCitasProgramadas(
          Array.isArray(programadasRes.data)
            ? programadasRes.data.length
            : programadasRes.data.total,
        );

        setCitasCompletadas(
          Array.isArray(completadasRes.data)
            ? completadasRes.data.length
            : completadasRes.data.total,
        );
      } catch (err: unknown) {
        if (!activo) return;

        console.error("Error al cargar las métricas del Dashboard:", err);

        setError(
          "No se pudieron cargar las métricas. Comprueba que el backend esté funcionando e inténtalo nuevamente.",
        );
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    }

    void cargarMetricas();

    return () => {
      activo = false;
    };
  }, [intento]);

  const metricas: Metrica[] = [
    {
      id: "pacientes",
      titulo: "Pacientes",
      valor: totalPacientes ?? (cargando ? "Cargando..." : "—"),
      descripcion: "Pacientes registrados",
      tendencia: "positiva",
      icono: "👥",
    },
    {
      id: "medicos",
      titulo: "Médicos",
      valor: totalMedicos ?? (cargando ? "Cargando..." : "—"),
      descripcion: "Médicos registrados",
      tendencia: "positiva",
      icono: "🩺",
    },
    {
      id: "citas-programadas",
      titulo: "Citas Programadas",
      valor: citasProgramadas ?? (cargando ? "Cargando..." : "—"),
      descripcion: "Citas con estado programado",
      tendencia: "neutra",
      icono: "📅",
    },
    {
      id: "citas-completadas",
      titulo: "Completadas Hoy",
      valor: citasCompletadas ?? (cargando ? "Cargando..." : "—"),
      descripcion: "Citas con estado completado",
      tendencia: "positiva",
      icono: "📋",
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

          {error && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800"
            >
              <p className="text-sm">{error}</p>
              <button
                type="button"
                onClick={() => setIntento((actual) => actual + 1)}
                className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Reintentar
              </button>
            </div>
          )}

          {cargando && (
            <p className="mb-4 text-sm text-slate-500" role="status">
              Cargando métricas...
            </p>
          )}

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
                  Total de pacientes registrados.
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <span className="min-w-16 text-center text-3xl font-bold text-slate-900">
                {totalPacientes ?? (cargando ? "Cargando..." : "—")}
              </span>
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
