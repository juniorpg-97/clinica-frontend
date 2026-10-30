export function SkeletonPacienteRow() {
  return (
    <tr className="animate-pulse border-b border-gray-100">
      <td className="px-6 py-4">
        <div className="h-4 w-32 rounded bg-gray-200" /> {/* Nombre */}
        <div className="mt-2 h-3 w-24 rounded bg-gray-100" /> {/* Email */}
      </td>
      <td className="px-6 py-4">
        <div className="h-4 w-24 rounded bg-gray-200" /> {/* Teléfono */}
      </td>
      <td className="px-6 py-4">
        <div className="h-6 w-20 rounded-full bg-gray-200" />{" "}
        {/* Badge de estado */}
      </td>
      <td className="px-6 py-4">
        <div className="h-8 w-16 rounded bg-gray-200" /> {/* Botón de acción */}
      </td>
    </tr>
  );
}
