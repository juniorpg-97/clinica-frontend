interface EncabezadoProps {
  titulo: string;
  descripcion: string;
}

export default function Encabezado({ titulo, descripcion }: EncabezadoProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-slate-200 bg-white px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-600">
          Clínica Salud Integral
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
          {titulo}
        </h1>

        <p className="mt-1 text-sm text-slate-500">{descripcion}</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-slate-800">Administrador</p>
          <p className="text-xs text-slate-500">Panel de gestión</p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-700">
          AD
        </div>
      </div>
    </header>
  );
}
