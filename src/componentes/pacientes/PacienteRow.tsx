import type { Paciente, EstadoPaciente } from "../../types/paciente";
import BadgeEstado from "./BadgeEstado";

interface PacienteRowProps {
  paciente: Paciente;
  onCambiarEstado: (id: string, estado: EstadoPaciente) => void;
  onEliminar: (id: string) => void;
}

export default function PacienteRow({
  paciente,
  onCambiarEstado,
  onEliminar,
}: PacienteRowProps) {
  return (
    <tr className="border-b border-slate-100 transition hover:bg-slate-50">
      <td className="px-6 py-4">
        <p className="font-semibold text-slate-900">
          {paciente.nombre} {paciente.apellido}
        </p>
        <p className="mt-1 text-sm text-slate-500">{paciente.email}</p>
      </td>

      <td className="px-6 py-4 text-sm text-slate-600">
        {paciente.telefono || "Sin teléfono"}
      </td>

      <td className="px-6 py-4 text-sm text-slate-600">
        {paciente.especialidadAsignada}
      </td>

      <td className="px-6 py-4 text-sm text-slate-600">
        {paciente.ultimaCita}
      </td>

      <td className="px-6 py-4">
        <BadgeEstado estado={paciente.estado} />
      </td>

      <td className="px-6 py-4">
        <select
          value={paciente.estado}
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
            onCambiarEstado(paciente.id, event.target.value as EstadoPaciente)
          }
          className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm"
          aria-label={`Cambiar estado de ${paciente.nombre}`}
        >
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
          <option value="en_espera">En espera</option>
        </select>
      </td>

      <td className="px-6 py-4">
        <button
          type="button"
          onClick={() => onEliminar(paciente.id)}
          className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50"
        >
          Eliminar
        </button>
      </td>
    </tr>
  );
}
