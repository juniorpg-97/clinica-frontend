// src/components/citas/ControlesPaginacion.tsx

interface ControlesPaginacionProps {
  pagina: number;
  totalPaginas: number;
  total: number;
  onAnterior: () => void;
  onSiguiente: () => void;
}

export function ControlesPaginacion({
  pagina,
  totalPaginas,
  total,
  onAnterior,
  onSiguiente,
}: ControlesPaginacionProps) {
  return (
    <div className="flex items-center justify-between mt-4 px-2">
      {/* Texto informativo */}
      <p className="text-sm text-gray-600">
        Página <span className="font-semibold text-gray-900">{pagina}</span> de{" "}
        <span className="font-semibold text-gray-900">{totalPaginas}</span> —{" "}
        <span className="font-semibold text-gray-900">{total}</span> registros
      </p>

      {/* Botones de navegación */}
      <div className="flex gap-2">
        <button
          onClick={onAnterior}
          disabled={pagina === 1}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition"
        >
          ← Anterior
        </button>

        <button
          onClick={onSiguiente}
          disabled={pagina >= totalPaginas}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition"
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}
