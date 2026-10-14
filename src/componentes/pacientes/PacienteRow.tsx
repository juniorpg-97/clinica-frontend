import type { Paciente } from "../../types/paciente";
import BadgeEstado from "./BadgeEstado";

interface PacienteRowProps {
  paciente: Paciente;
}

export default function PacienteRow({ paciente }: PacienteRowProps) {
  return (
    <tr className="border-b border-slate-100 transition-colors hover:bg-slate-50">
      <td className="px-6 py-4">
        <p className="font-semibold text-slate-800">
          {paciente.nombre} {paciente.apellido}
        </p>
        <p className="mt-1 text-sm text-slate-500">{paciente.email}</p>
      </td>

      <td className="px-6 py-4 text-sm text-slate-600">{paciente.telefono}</td>

      <td className="px-6 py-4 text-sm text-slate-600">
        {paciente.especialidadAsignada}
      </td>

      <td className="px-6 py-4 text-sm text-slate-600">
        {paciente.ultimaCita}
      </td>

      <td className="px-6 py-4">
        <BadgeEstado estado={paciente.estado} />
      </td>
    </tr>
  );
}
