import { Link } from "react-router-dom";
import { Eye } from "lucide-react";

import type { Paciente, EstadoPaciente } from "../../types/paciente";
import BadgeEstado from "./BadgeEstado";

interface PacienteCardProps {
  paciente: Paciente;
  onCambiarEstado: (id: string | number, estado: EstadoPaciente) => void;
  onAbrirModalEliminar: (id: string | number) => void;
}

export default function PacienteCard({
  paciente,
  onCambiarEstado,
  onAbrirModalEliminar,
}: PacienteCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-semibold text-slate-900">
            {paciente.nombre} {paciente.apellido}
          </p>
          <p className="mt-1 text-sm text-slate-500">{paciente.email}</p>
        </div>
        <BadgeEstado estado={paciente.estado ?? "activo"} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-slate-500">Teléfono</p>
          <p className="font-medium text-slate-900">
            {paciente.telefono || "Sin teléfono"}
          </p>
        </div>
        <div>
          <p className="text-slate-500">Especialidad</p>
          <p className="font-medium text-slate-900">
            {paciente.especialidadAsignada}
          </p>
        </div>
        <div>
          <p className="text-slate-500">Última cita</p>
          <p className="font-medium text-slate-900">{paciente.ultimaCita}</p>
        </div>
        <div>
          <p className="text-slate-500">Estado</p>
          <select
            value={paciente.estado ?? "activo"}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
              onCambiarEstado(paciente.id, event.target.value as EstadoPaciente)
            }
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm"
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
            <option value="en_espera">En espera</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
        <Link
          to={`/pacientes/${paciente.id}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-teal-700 hover:text-teal-900"
        >
          <Eye size={16} />
          Ver detalle
        </Link>

        <button
          type="button"
          onClick={() => onAbrirModalEliminar(paciente.id)}
          className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
