import type { Metrica, Tendencia } from "../types";

interface MetricCardProps {
  metrica: Metrica;
}

const colorPorTendencia: Record<Tendencia, string> = {
  positiva: "text-emerald-600",
  negativa: "text-rose-600",
  neutra: "text-slate-600",
};

export default function MetricCard({ metrica }: MetricCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-slate-500">{metrica.titulo}</h2>

        <span className="text-2xl" aria-hidden="true">
          {metrica.icono}
        </span>
      </div>

      <p className="mt-4 text-3xl font-bold text-slate-900">{metrica.valor}</p>

      <p className={`mt-2 text-sm ${colorPorTendencia[metrica.tendencia]}`}>
        {metrica.descripcion}
      </p>
    </article>
  );
}
