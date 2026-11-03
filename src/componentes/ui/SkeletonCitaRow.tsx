export function SkeletonCitaRow() {
  return (
    <div className="animate-pulse flex items-center gap-4 p-4 border-b border-gray-200">
      <div className="flex-1 space-y-2">
        <div className="h-4 w-1/3 rounded bg-gray-300" />{" "}
        {/* Nombre paciente */}
        <div className="h-3 w-1/4 rounded bg-gray-200" /> {/* Motivo */}
      </div>
      <div className="h-4 w-24 rounded bg-gray-200" /> {/* Fecha/Hora */}
      <div className="h-6 w-20 rounded-full bg-gray-300" />{" "}
      {/* Badge de estado */}
    </div>
  );
}

// Helper para renderizar 10 filas (como pide el entregable del Día 4/5)
export function SkeletonListaCitas() {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      {Array.from({ length: 10 }).map((_, i) => (
        <SkeletonCitaRow key={i} />
      ))}
    </div>
  );
}
