import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Users,
  CalendarDays,
  ClipboardList,
  Activity,
  ArrowRight,
  CheckCircle,
  XCircle,
} from "lucide-react";

import { api } from "../lib/axios";
import { usePacientesStore } from "../stores/pacientesStore";
import { useCitasStore } from "../stores/citasStore";
import type { Metrica } from "../types";
import type { EstadoCita } from "../types/cita";
import MetricCard from "../componentes/MetricCard";
import StatusBadge from "../componentes/StatusBadge";
import Encabezado from "../componentes/layout/Encabezado";
// 👇 NUEVO: Import del Skeleton específico
import { SkeletonMetricCard } from "../componentes/ui/SkeletonMetricCard";

export default function PaginaDashboard() {
  const pacientes = usePacientesStore((s) => s.pacientes);
  const cargarPacientes = usePacientesStore((s) => s.cargar);
  const cargandoPacientes = usePacientesStore((s) => s.cargando);

  const citas = useCitasStore((s) => s.citas);
  const cargarTodasCitas = useCitasStore((s) => s.cargarTodas);
  const actualizarEstado = useCitasStore((s) => s.actualizarEstado);
  const cargandoCitas = useCitasStore((s) => s.cargando);

  const [mantenimiento, setMantenimiento] = useState<boolean>(false);
  const [totalMedicos, setTotalMedicos] = useState<number | null>(null);
  const [cargandoMedicos, setCargandoMedicos] = useState<boolean>(true);

  useEffect(() => {
    void cargarPacientes();
    void cargarTodasCitas();

    async function cargarMedicos() {
      try {
        const res = await api.get("/medicos");
        const datos = Array.isArray(res.data) ? res.data : res.data?.data;
        setTotalMedicos(Array.isArray(datos) ? datos.length : 0);
      } catch (err) {
        console.error("Error al cargar médicos", err);
      } finally {
        setCargandoMedicos(false);
      }
    }

    void cargarMedicos();
  }, [cargarPacientes, cargarTodasCitas]);

  const cargando = cargandoPacientes || cargandoCitas || cargandoMedicos;

  const totalPacientes = pacientes.length;
  const citasProgramadas = citas.filter(
    (c) => c.estado === "PROGRAMADA",
  ).length;
  const citasCompletadas = citas.filter(
    (c) => c.estado === "COMPLETADA",
  ).length;

  const handleCambiarEstadoOptimista = async (
    id: number | string,
    nuevoEstado: EstadoCita,
  ): Promise<void> => {
    const exito = await actualizarEstado(id, nuevoEstado);
    if (exito) {
      toast.success("Estado de cita actualizado");
    } else {
      toast.error("No se pudo actualizar el estado");
    }
  };

  const metricas: Metrica[] = [
    {
      id: "pacientes",
      titulo: "Pacientes",
      valor: totalPacientes,
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
      valor: citasProgramadas,
      descripcion: "Citas con estado programado",
      tendencia: "neutra",
      icono: "📅",
    },
    {
      id: "citas-completadas",
      titulo: "Completadas Hoy",
      valor: citasCompletadas,
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
            <div className="flex gap-3">
              <Link
                to="/citas/nueva"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
              >
                <CalendarDays size={18} /> Nueva cita
              </Link>
              <Link
                to="/pacientes"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
              >
                <Users size={18} /> Ver pacientes <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          {/* 👇 MEJORA: Skeletons específicos en lugar de texto */}
          {cargando ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonMetricCard key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {metricas.map((metrica) => (
                <MetricCard key={metrica.id} metrica={metrica} />
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">
              Gestión de Citas
            </h2>
            <span className="text-xs text-slate-500">
              Actualización instantánea con fallback
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {citas.map((cita) => (
              <div
                key={cita.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <p className="font-semibold text-slate-800">
                    {cita.pacienteNombre ?? `Cita #${cita.id}`}
                  </p>
                  <p className="text-xs text-slate-500">
                    {cita.motivo ?? "Consulta médica"} ·{" "}
                    {new Date(cita.fecha).toLocaleDateString()}
                  </p>
                  <span
                    className={`inline-block mt-1 px-2.5 py-0.5 rounded text-xs font-semibold ${
                      cita.estado === "COMPLETADA"
                        ? "bg-emerald-100 text-emerald-800"
                        : cita.estado === "CANCELADA"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {cita.estado}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={cita.estado === "COMPLETADA"}
                    onClick={() =>
                      void handleCambiarEstadoOptimista(cita.id, "COMPLETADA")
                    }
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40"
                  >
                    <CheckCircle size={14} /> Completar
                  </button>
                  <button
                    type="button"
                    disabled={cita.estado === "CANCELADA"}
                    onClick={() =>
                      void handleCambiarEstadoOptimista(cita.id, "CANCELADA")
                    }
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-600 text-white hover:bg-slate-700 disabled:opacity-40"
                  >
                    <XCircle size={14} /> Cancelar
                  </button>
                </div>
              </div>
            ))}
            {citas.length === 0 && !cargando && (
              <p className="text-sm text-slate-500 py-4 text-center">
                No hay citas registradas actualmente.
              </p>
            )}
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
                {totalPacientes}
              </span>
            </div>
            <Link
              to="/pacientes"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-900"
            >
              Ir al listado de pacientes <ArrowRight size={16} />
            </Link>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div
                className={`rounded-xl p-3 ${mantenimiento ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}
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
                className={`rounded-xl px-5 py-3 text-sm font-semibold text-white transition ${mantenimiento ? "bg-teal-600 hover:bg-teal-700" : "bg-red-600 hover:bg-red-700"}`}
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
