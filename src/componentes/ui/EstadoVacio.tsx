interface EstadoVacioProps {
  titulo: string;
  descripcion?: string;
  accion?: {
    label: string;
    onClick: () => void;
  };
}

export function EstadoVacio({ titulo, descripcion, accion }: EstadoVacioProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
      <div className="mb-4 text-4xl">📭</div>
      <h3 className="text-lg font-semibold text-gray-900">{titulo}</h3>
      {descripcion && (
        <p className="mt-1 text-sm text-gray-500">{descripcion}</p>
      )}
      {accion && (
        <button
          onClick={accion.onClick}
          className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          {accion.label}
        </button>
        // O usa lucide-react: <Plus size={16} className="mr-2" /> {accion.label}
      )}
    </div>
  );
}
