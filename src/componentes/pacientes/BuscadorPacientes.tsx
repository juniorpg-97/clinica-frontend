import { Search, Loader2 } from "lucide-react";
import { useFiltrosStore } from "../../stores/filtrosStore";
import { useDebounce } from "../../hooks/useDebounce";
import { useApi } from "../../hooks/useApi";
import { pacientesService } from "../../services/pacientes";
import type { Paciente } from "../../types/paciente";
import type { RespuestaPaginada } from "../../types/api";

export function BuscadorPacientes() {
  const queryPacientes = useFiltrosStore((state) => state.queryPacientes);
  const setQueryPacientes = useFiltrosStore((state) => state.setQueryPacientes);
  const resetFiltros = useFiltrosStore((state) => state.resetFiltros);

  const queryDebounced = useDebounce(queryPacientes, 350);

  // 👇 Le pasamos [queryDebounced] como dependencia para que se actualice
  const {
    data: respuesta,
    cargando,
    error,
  } = useApi<RespuestaPaginada<Paciente>>(
    () => pacientesService.getAll(queryDebounced),
    [queryDebounced],
  );

  const pacientes = respuesta?.data || [];

  // 👇 FILTRO LOCAL: Nos aseguramos de que la lista se filtre sí o sí
  const pacientesFiltrados = pacientes.filter((p) =>
    p.nombre.toLowerCase().includes(queryDebounced.toLowerCase().trim()),
  );

  return (
    <div className="w-full max-w-md">
      <div className="relative flex items-center">
        <Search className="absolute left-3 text-slate-400" size={18} />
        <input
          type="text"
          value={queryPacientes}
          onChange={(e) => setQueryPacientes(e.target.value)}
          placeholder="Buscar paciente por nombre..."
          className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-10 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
        {cargando && (
          <Loader2
            className="absolute right-3 animate-spin text-blue-500"
            size={18}
          />
        )}
      </div>

      <button
        onClick={resetFiltros}
        className="mt-2 text-xs font-semibold text-rose-500 hover:text-rose-700"
      >
        Limpiar filtros
      </button>

      {error && <p className="mt-4 text-sm text-rose-500">{error}</p>}

      {!cargando && (
        <ul className="mt-4 space-y-2">
          {/* 👇 Renderizamos los filtrados */}
          {pacientesFiltrados.map((p) => (
            <li
              key={p.id}
              className="rounded-lg border border-slate-100 p-3 text-sm"
            >
              {p.nombre}
            </li>
          ))}
          {pacientesFiltrados.length === 0 && (
            <p className="text-sm text-slate-500">
              No se encontraron pacientes con ese nombre.
            </p>
          )}
        </ul>
      )}
    </div>
  );
}
