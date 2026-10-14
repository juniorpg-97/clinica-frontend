interface TarjetaEstadisticaProps {
  titulo: string;
  valor: string | number;
  descripcion: string;
  icono: string;
}

export default function TarjetaEstadistica({
  titulo,
  valor,
  descripcion,
  icono,
}: TarjetaEstadisticaProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{titulo}</p>

          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            {valor}
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-2xl text-teal-700">
          <span aria-hidden="true">{icono}</span>
        </div>
      </div>

      <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
        {descripcion}
      </p>
    </article>
  );
}
