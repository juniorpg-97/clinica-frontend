import type { Paciente } from "../../types/paciente";
import BadgeEstado from "./BadgeEstado";

interface PacienteCardProps {
  paciente: Paciente;
}

export default function PacienteCard({ paciente }: PacienteCardProps) {
  return (
    <article className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-slate-800">
            {paciente.nombre} {paciente.apellido}
          </h3>

          <p className="mt-1 break-all text-sm text-slate-500">
            {paciente.email}
          </p>
        </div>

        <BadgeEstado estado={paciente.estado} />
      </div>

      <div className="grid grid-cols-1 gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Teléfono
          </p>
          <p className="mt-1 text-sm text-slate-700">{paciente.telefono}</p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Especialidad
          </p>
          <p className="mt-1 text-sm text-slate-700">
            {paciente.especialidadAsignada}
          </p>
        </div>

        <div className="sm:col-span-2">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Última cita
          </p>
          <p className="mt-1 text-sm text-slate-700">{paciente.ultimaCita}</p>
        </div>
      </div>
    </article>
  );
}
