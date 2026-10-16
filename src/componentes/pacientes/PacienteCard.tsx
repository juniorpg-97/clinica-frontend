import { Link } from "react-router-dom";
import { Eye } from "lucide-react";

import type { Paciente, EstadoPaciente } from "../../types/paciente";

import BadgeEstado from "./BadgeEstado";

interface PacienteCardProps {
  paciente: Paciente;
  onCambiarEstado: (id: string, estado: EstadoPaciente) => void;
  onEliminar: (id: string) => void;
}

export default function PacienteCard({
  paciente,
  onCambiarEstado,
  onEliminar,
}: PacienteCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-slate-900">
            {paciente.nombre} {paciente.apellido}
          </h3>

          <p className="mt-1 break-all text-sm text-slate-500">
            {paciente.email}
          </p>
        </div>

        <BadgeEstado estado={paciente.estado} />
      </div>

      <div className="mt-4 space-y-3 text-sm">
        <div>
          <p className="text-slate-500">Teléfono</p>
          <p className="font-medium text-slate-800">
            {paciente.telefono || "Sin teléfono"}
          </p>
        </div>

        <div>
          <p className="text-slate-500">Especialidad asignada</p>
          <p className="font-medium text-slate-800">
            {paciente.especialidadAsignada}
          </p>
        </div>

        <div>
          <p className="text-slate-500">Última cita</p>
          <p className="font-medium text-slate-800">{paciente.ultimaCita}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        <label className="text-sm font-medium text-slate-700">
          Cambiar estado
          <select
            value={paciente.estado}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
              onCambiarEstado(paciente.id, event.target.value as EstadoPaciente)
            }
            className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2"
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
            <option value="en_espera">En espera</option>
          </select>
        </label>

        <Link
          to={`/pacientes/${paciente.id}`}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-50 px-4 py-3 text-sm font-semibold text-teal-700 transition hover:bg-teal-100"
        >
          <Eye size={18} />
          Ver detalle del paciente
        </Link>

        <button
          type="button"
          onClick={() => onEliminar(paciente.id)}
          className="w-full rounded-lg border border-rose-200 px-4 py-2 font-medium text-rose-600 transition hover:bg-rose-50"
        >
          Eliminar paciente
        </button>
      </div>
    </article>
  );
}
