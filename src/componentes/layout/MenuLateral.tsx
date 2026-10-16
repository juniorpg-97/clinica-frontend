interface MenuLateralProps {
  paginaActual: "dashboard" | "pacientes";
  onCambiarPagina: (pagina: "dashboard" | "pacientes") => void;
}

const opcionesMenu = [
  {
    id: "dashboard",
    nombre: "Dashboard",
    icono: "▦",
  },
  {
    id: "pacientes",
    nombre: "Pacientes",
    icono: "♙",
  },
] as const;

export default function MenuLateral({
  paginaActual,
  onCambiarPagina,
}: MenuLateralProps) {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-lg font-bold text-white">
          CS
        </div>

        <div>
          <h2 className="text-sm font-bold text-slate-900">Clínica Salud</h2>
          <p className="text-xs text-slate-500">Integral</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Menú principal
        </p>

        {opcionesMenu.map((opcion) => {
          const seleccionada = paginaActual === opcion.id;

          return (
            <button
              key={opcion.id}
              type="button"
              onClick={() => onCambiarPagina(opcion.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors ${
                seleccionada
                  ? "bg-teal-50 text-teal-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span className="text-lg" aria-hidden="true">
                {opcion.icono}
              </span>

              {opcion.nombre}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-slate-100 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-700">
            AD
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-800">
              Administrador
            </p>
            <p className="text-xs text-slate-500">Clínica Salud Integral</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
