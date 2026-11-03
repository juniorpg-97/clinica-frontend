export function SkeletonMetricCard() {
  return (
    <div className="animate-pulse rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 h-4 w-1/2 rounded bg-gray-200" /> {/* Título */}
      <div className="mb-2 h-8 w-3/4 rounded bg-gray-300" />{" "}
      {/* Número grande */}
      <div className="h-3 w-1/3 rounded bg-gray-200" />{" "}
      {/* Descripción/Tendencia */}
    </div>
  );
}
