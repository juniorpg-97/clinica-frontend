// src/components/citas/SkeletonCita.tsx

export function SkeletonFilaCita() {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-gray-200 animate-pulse">
      {/* Simula el nombre y detalles del paciente */}
      <div className="flex-1 space-y-2">
        <div className="h-4 w-1/3 rounded bg-gray-300" />
        <div className="h-3 w-1/4 rounded bg-gray-200" />
      </div>

      {/* Simula la fecha y hora */}
      <div className="h-4 w-24 rounded bg-gray-200" />

      {/* Simula el badge de estado */}
      <div className="h-6 w-20 rounded-full bg-gray-300" />
    </div>
  );
}

export function SkeletonListaCitas() {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      {/* Renderiza exactamente 10 placeholders como pide el entregable */}
      {Array.from({ length: 10 }).map((_, i) => (
        <SkeletonFilaCita key={i} />
      ))}
    </div>
  );
}
