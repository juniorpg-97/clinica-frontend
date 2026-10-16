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
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-medium text-slate-500">
            {metrica.titulo}
          </h2>

          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            {metrica.valor}
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-2xl text-teal-700">
          <span aria-hidden="true">{metrica.icono}</span>
        </div>
      </div>

      <p
        className={`mt-4 border-t border-slate-100 pt-3 text-xs ${colorPorTendencia[metrica.tendencia]}`}
      >
        {metrica.descripcion}
      </p>
    </article>
  );
}
