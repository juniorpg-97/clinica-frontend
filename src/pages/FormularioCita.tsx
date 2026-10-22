import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import {
  CheckCircle2,
  CalendarDays,
  Clock,
  UserRound,
  ArrowLeft,
} from "lucide-react";

import { citaSchema } from "../schemas/citaSchema";
import type { CitaFormData } from "../schemas/citaSchema";
import { useMedicos } from "../hooks/useMedicos";
import { useCitasStore } from "../stores/citasStore";
import { extraerMensajeError } from "../lib/errorHandler";

export default function FormularioCita() {
  const navigate = useNavigate();
  const { medicos, cargando } = useMedicos();

  const agregarCita = useCitasStore((s) => s.agregarCita);

  const [citaAgendada, setCitaAgendada] = useState<CitaFormData | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CitaFormData>({
    resolver: zodResolver(citaSchema),
    defaultValues: {
      pacienteNombre: "",
      medicoId: "",
      fecha: "",
      hora: "",
      motivo: "",
      urgencia: "media",
    },
  });

  const fechaMinima = new Date().toISOString().split("T")[0];

  const onSubmit = async (data: CitaFormData): Promise<void> => {
    try {
      const exito = await agregarCita({
        pacienteId: 1, // o el ID correspondiente
        medicoId: Number(data.medicoId),
        pacienteNombre: data.pacienteNombre,
        fecha: `${data.fecha}T${data.hora || "09:00"}:00Z`,
        hora: data.hora || "09:00",
        motivo: data.motivo,
        estado: "PROGRAMADA",
        urgencia: data.urgencia,
      });

      if (exito) {
        toast.success("Cita agendada con éxito");
        setCitaAgendada(data);
      }
    } catch (err: unknown) {
      toast.error(extraerMensajeError(err));
    }
  };

  const agendarOtraCita = (): void => {
    reset();
    setCitaAgendada(null);
  };

  const cancelarCita = (): void => {
    navigate(-1);
  };

  const inputClass = (tieneError: boolean): string =>
    `w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:ring-2 ${
      tieneError
        ? "border-red-500 focus:ring-red-100"
        : "border-gray-200 focus:border-violet-500 focus:ring-violet-100"
    }`;

  const labelClass = "mb-2 block text-sm font-semibold text-gray-700";

  if (citaAgendada !== null) {
    const medicoSeleccionado = medicos.find(
      (medico) => String(medico.id) === String(citaAgendada.medicoId),
    );

    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <section className="mx-auto max-w-2xl rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-10">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-9 w-9 text-green-600" />
          </div>

          <h1 className="text-center text-2xl font-bold text-gray-900">
            ¡Cita agendada con éxito!
          </h1>

          <p className="mt-2 text-center text-gray-500">
            La cita se registró correctamente en el sistema.
          </p>

          <div className="mt-8 space-y-4 rounded-xl bg-gray-50 p-5">
            <div>
              <p className="text-sm text-gray-500">Paciente</p>
              <p className="font-semibold text-gray-900">
                {citaAgendada.pacienteNombre}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Médico</p>
              <p className="font-semibold text-gray-900">
                {medicoSeleccionado?.nombre ?? "No disponible"}
              </p>
              <p className="text-sm text-gray-500">
                {medicoSeleccionado?.especialidad}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="flex items-center gap-2 text-sm text-gray-500">
                  <CalendarDays size={16} />
                  Fecha
                </p>
                <p className="mt-1 font-semibold">{citaAgendada.fecha}</p>
              </div>

              <div>
                <p className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock size={16} />
                  Hora
                </p>
                <p className="mt-1 font-semibold">{citaAgendada.hora}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">Motivo</p>
              <p className="text-gray-800">{citaAgendada.motivo}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Urgencia</p>
              <p className="font-semibold capitalize">
                {citaAgendada.urgencia}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={agendarOtraCita}
            className="mt-6 w-full rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white transition hover:bg-violet-700"
          >
            Agendar otra cita
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-3 w-full rounded-xl border border-gray-200 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Volver al Dashboard
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <button
            type="button"
            onClick={cancelarCita}
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-violet-700"
          >
            <ArrowLeft size={18} />
            Volver
          </button>

          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100">
            <CalendarDays className="h-6 w-6 text-violet-700" />
          </div>

          <p className="text-sm font-semibold text-violet-600">
            CLÍNICA SALUD INTEGRAL
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
            Nueva cita médica
          </h1>

          <p className="mt-2 text-gray-500">
            Completa los datos para programar una nueva consulta.
          </p>
        </header>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8"
        >
          <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-5">
            <UserRound className="text-violet-600" size={22} />

            <div>
              <h2 className="font-bold text-gray-900">Datos de la consulta</h2>
              <p className="text-sm text-gray-500">
                Los campos marcados deben completarse correctamente.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="pacienteNombre" className={labelClass}>
                Nombre del paciente
              </label>

              <input
                id="pacienteNombre"
                type="text"
                placeholder="Ej. Juan Pérez"
                aria-invalid={Boolean(errors.pacienteNombre)}
                {...register("pacienteNombre")}
                className={inputClass(Boolean(errors.pacienteNombre))}
              />

              {errors.pacienteNombre && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.pacienteNombre.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="medicoId" className={labelClass}>
                Médico
              </label>

              <select
                id="medicoId"
                disabled={cargando}
                aria-invalid={Boolean(errors.medicoId)}
                {...register("medicoId")}
                className={inputClass(Boolean(errors.medicoId))}
              >
                <option value="">
                  {cargando ? "Cargando médicos..." : "Selecciona un médico"}
                </option>

                {medicos.map((medico) => (
                  <option key={medico.id} value={medico.id}>
                    {medico.nombre} — {medico.especialidad}
                  </option>
                ))}
              </select>

              {errors.medicoId && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.medicoId.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="fecha" className={labelClass}>
                Fecha de la cita
              </label>

              <input
                id="fecha"
                type="date"
                min={fechaMinima}
                aria-invalid={Boolean(errors.fecha)}
                {...register("fecha")}
                className={inputClass(Boolean(errors.fecha))}
              />

              {errors.fecha && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.fecha.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="hora" className={labelClass}>
                Hora de la cita
              </label>

              <input
                id="hora"
                type="time"
                aria-invalid={Boolean(errors.hora)}
                {...register("hora")}
                className={inputClass(Boolean(errors.hora))}
              />

              {errors.hora && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.hora.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="motivo" className={labelClass}>
                Motivo de la consulta
              </label>

              <textarea
                id="motivo"
                rows={4}
                maxLength={500}
                placeholder="Describe el motivo de la consulta..."
                aria-invalid={Boolean(errors.motivo)}
                {...register("motivo")}
                className={inputClass(Boolean(errors.motivo))}
              />

              {errors.motivo && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.motivo.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="urgencia" className={labelClass}>
                Nivel de urgencia
              </label>

              <select
                id="urgencia"
                {...register("urgencia")}
                aria-invalid={Boolean(errors.urgencia)}
                className={inputClass(Boolean(errors.urgencia))}
              >
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
                <option value="critica">Crítica</option>
              </select>

              {errors.urgencia && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.urgencia.message}
                </p>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={cancelarCita}
              disabled={isSubmitting}
              className="rounded-xl border border-gray-200 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => reset()}
              className="rounded-xl border border-gray-200 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
            >
              Limpiar formulario
            </button>

            <button
              type="submit"
              disabled={isSubmitting || cargando}
              className="rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Agendando..." : "Agendar cita"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
