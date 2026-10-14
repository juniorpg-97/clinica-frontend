import type { Paciente } from "../../types/paciente";
import BadgeEstado from "./BadgeEstado";

interface PacienteRowProps {
  paciente: Paciente;
}

export default function PacienteRow({ paciente }: PacienteRowProps) {
  return (
    <tr className="border-b border-gray-100 transition-colors hover:bg-gray-50">
      <td className="px-6 py-4">
        <div className="font-medium text-gray-900">
          {paciente.nombre} {paciente.apellido}
        </div>
        <div className="text-sm text-gray-500">{paciente.email}</div>
      </td>

      <td className="px-6 py-4 text-sm text-gray-700">{paciente.telefono}</td>

      <td className="px-6 py-4 text-sm text-gray-700">
        {paciente.especialidadAsignada}
      </td>

      <td className="px-6 py-4 text-sm text-gray-700">{paciente.ultimaCita}</td>

      <td className="px-6 py-4">
        <BadgeEstado estado={paciente.estado} />
      </td>
    </tr>
  );
}
