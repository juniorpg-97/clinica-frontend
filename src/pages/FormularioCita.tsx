import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { citaSchema, type CitaFormData } from "../schemas/citaSchema";
import { useCitasStore } from "../stores/citasStore";
import { usePacientesStore } from "../stores/pacientesStore";
import { extraerMensajeError } from "../lib/errorHandler";

export default function FormularioCita() {
  const navigate = useNavigate();
  const agregarCita = useCitasStore((s) => s.agregarCita);

  const pacientes = usePacientesStore((s) => s.pacientes);
  const cargarPacientes = usePacientesStore((s) => s.cargar);

  const medicos = [
    { id: 1, nombre: "Dr. Juan Pérez" },
    { id: 2, nombre: "Dra. María Gómez" },
  ];
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CitaFormData>({
    resolver: zodResolver(citaSchema),
    defaultValues: {
      urgencia: "baja",
    },
  });

  useEffect(() => {
    cargarPacientes();
  }, [cargarPacientes]);

  const fechaMinima = new Date().toISOString().split("T")[0];

  const onSubmit = async (data: CitaFormData): Promise<void> => {
    try {
      const exito = await agregarCita({
        pacienteId: Number(data.pacienteId),
        medicoId: Number(data.medicoId),
        fecha: data.fecha,
        hora: data.hora,
        motivo: data.motivo,
        urgencia: data.urgencia,
      });

      if (exito) {
        toast.success("Cita agendada correctamente");
        navigate("/");
      }
    } catch (err: unknown) {
      toast.error(extraerMensajeError(err));
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Agendar Nueva Cita
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* SELECT PACIENTE */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Paciente
          </label>
          <select
            {...register("pacienteId")}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="">Seleccione un paciente</option>
            {pacientes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre} {p.apellidoPaterno}
              </option>
            ))}
          </select>
          {errors.pacienteId && (
            <p className="text-rose-500 text-sm mt-1">
              {errors.pacienteId.message}
            </p>
          )}
        </div>

        {/* SELECT MÉDICO */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Médico
          </label>
          <select
            {...register("medicoId")}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="">Seleccione un médico</option>
            {medicos.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre}
              </option>
            ))}
          </select>
          {errors.medicoId && (
            <p className="text-rose-500 text-sm mt-1">
              {errors.medicoId.message}
            </p>
          )}
        </div>

        {/* FECHA Y HORA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha
            </label>
            <input
              type="date"
              min={fechaMinima}
              {...register("fecha")}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            {errors.fecha && (
              <p className="text-rose-500 text-sm mt-1">
                {errors.fecha.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hora
            </label>
            <input
              type="time"
              {...register("hora")}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            {errors.hora && (
              <p className="text-rose-500 text-sm mt-1">
                {errors.hora.message}
              </p>
            )}
          </div>
        </div>

        {/* URGENCIA */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Urgencia
          </label>
          <select
            {...register("urgencia")}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
            <option value="critica">Crítica</option>
          </select>
          {errors.urgencia && (
            <p className="text-rose-500 text-sm mt-1">
              {errors.urgencia.message}
            </p>
          )}
        </div>

        {/* MOTIVO */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Motivo de la consulta
          </label>
          <textarea
            {...register("motivo")}
            rows={4}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            placeholder="Describa el motivo de la cita (mínimo 10 caracteres)..."
          ></textarea>
          {errors.motivo && (
            <p className="text-rose-500 text-sm mt-1">
              {errors.motivo.message}
            </p>
          )}
        </div>

        {/* BOTONES */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Agendando..." : "Agendar Cita"}
          </button>
        </div>
      </form>
    </div>
  );
}
