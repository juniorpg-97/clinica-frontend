import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { citasService } from "../services/citas";
import type { RespuestaPaginada } from "../types/api";
import type { Cita } from "../types/cita";
import { SkeletonListaCitas } from "../componentes/citas/SkeletonCita";
import { ControlesPaginacion } from "../componentes/citas/ControlesPaginacion";
import { formatearFecha, formatearHora } from "../lib/formato";
// 👇 NUEVO: Import del EstadoVacio
import { EstadoVacio } from "../componentes/ui/EstadoVacio";

type EstadoCitaFiltro = "Todos" | "Programada" | "Completada" | "Cancelada";
const ESTADOS_FILTRO: EstadoCitaFiltro[] = [
  "Todos",
  "Programada",
  "Completada",
  "Cancelada",
];

export default function PaginaHistorialCitas() {
  const [searchParams, setSearchParams] = useSearchParams();

  const pagina = Number(searchParams.get("pagina")) || 1;
  const estado = (searchParams.get("estado") as EstadoCitaFiltro) || "Todos";

  const [citas, setCitas] = useState<Cita[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const cargarDatos = async () => {
      setCargando(true);
      try {
        const estadoParaApi =
          estado === "Todos" ? "Todos" : estado.toUpperCase();

        const respuesta: RespuestaPaginada<Cita> =
          await citasService.getPaginadas({
            pagina,
            estado: estadoParaApi,
            signal: controller.signal,
          });

        const datosFiltrados =
          estado === "Todos"
            ? respuesta.data
            : respuesta.data.filter((cita) => cita.estado === estadoParaApi);

        setCitas(datosFiltrados);
        setTotal(datosFiltrados.length);
        setTotalPaginas(Math.ceil(datosFiltrados.length / 10) || 1);
      } catch (error: any) {
        if (error.name !== "CanceledError" && error.name !== "AbortError") {
          console.error("Error al cargar citas:", error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setCargando(false);
        }
      }
    };

    cargarDatos();
    return () => controller.abort();
  }, [pagina, estado]);

  const handleCambiarEstado = (nuevoEstado: EstadoCitaFiltro) => {
    setSearchParams({ pagina: "1", estado: nuevoEstado });
  };

  const handleAnterior = () => {
    if (pagina > 1) setSearchParams({ pagina: String(pagina - 1), estado });
  };

  const handleSiguiente = () => {
    if (pagina < totalPaginas)
      setSearchParams({ pagina: String(pagina + 1), estado });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Historial de Citas
      </h1>

      <div className="flex gap-2 mb-6 flex-wrap">
        {ESTADOS_FILTRO.map((e) => (
          <button
            key={e}
            onClick={() => handleCambiarEstado(e)}
            className={`px-4 py-2 rounded-lg transition ${
              estado === e
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {e}
          </button>
        ))}
      </div>

      {cargando ? (
        <SkeletonListaCitas />
      ) : citas.length === 0 ? (
        // 👇 MEJORA: Componente EstadoVacio reutilizable
        <EstadoVacio
          titulo="No hay citas registradas"
          descripcion="No se encontraron citas con los filtros actuales."
          accion={{
            label: "Limpiar filtros",
            onClick: () => setSearchParams({}),
          }}
        />
      ) : (
        <>
          <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            {citas.map((cita) => (
              <div
                key={cita.id}
                className="flex items-center gap-4 p-4 border-b border-gray-200 last:border-b-0"
              >
                <div className="flex-1 space-y-2">
                  <p className="text-base font-semibold text-gray-900 leading-5">
                    {cita.pacienteNombre || `Paciente ID: ${cita.pacienteId}`}
                  </p>
                  <p className="text-sm text-gray-500 leading-4">
                    {cita.motivo || "Sin motivo especificado"}
                  </p>
                </div>

                <p className="text-sm text-gray-600 w-32 text-right leading-5">
                  {formatearFecha(cita.fecha)} <br />
                  <span className="text-gray-400">
                    {formatearHora(cita.hora)}
                  </span>
                </p>

                <span
                  className={`h-6 w-24 flex items-center justify-center rounded-full text-xs font-medium ${
                    cita.estado === "COMPLETADA"
                      ? "bg-green-100 text-green-800"
                      : cita.estado === "CANCELADA"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {cita.estado.charAt(0) + cita.estado.slice(1).toLowerCase()}
                </span>
              </div>
            ))}
          </div>

          <ControlesPaginacion
            pagina={pagina}
            totalPaginas={totalPaginas}
            total={total}
            onAnterior={handleAnterior}
            onSiguiente={handleSiguiente}
          />
        </>
      )}
    </div>
  );
}
