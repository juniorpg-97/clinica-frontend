import Encabezado from "../componentes/layout/Encabezado";
import BuscadorPacientes from "../componentes/pacientes/BuscadorPacientes";
import PacienteRow from "../componentes/pacientes/PacienteRow";
import PacienteCard from "../componentes/pacientes/PacienteCard";
import { pacientesIniciales } from "../data/pacientes";

// Problemas encontrados en el código generado por la IA:
// 1. El buscador estaba escrito directamente en la página y no reutilizaba su componente.
// 2. La tabla y las tarjetas necesitaban una estructura adaptable a diferentes pantallas.
// 3. Los estados de los pacientes debían mostrarse con etiquetas visuales diferenciadas.

const estados = [
  { valor: "todos", etiqueta: "Todos los estados" },
  { valor: "activo", etiqueta: "Activo" },
  { valor: "inactivo", etiqueta: "Inactivo" },
  { valor: "en_espera", etiqueta: "En espera" },
] as const;

export default function PaginaPacientes() {
  const totalPacientes = pacientesIniciales.length;

  const pacientesActivos = pacientesIniciales.filter(
    (paciente) => paciente.estado === "activo",
  ).length;

  const pacientesEnEspera = pacientesIniciales.filter(
    (paciente) => paciente.estado === "en_espera",
  ).length;
  const pacientesInactivos = pacientesIniciales.filter(
    (p) => p.estado === "inactivo",
  ).length;
  return (
    <div className="min-h-full">
      <Encabezado
        titulo="Pacientes"
        descripcion="Consulta y organiza la información de los pacientes."
      />

      <main className="space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Estadísticas de pacientes */}
        <section
          aria-label="Estadísticas de pacientes"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total de pacientes</p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {totalPacientes}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Registros de demostración
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Pacientes activos</p>

            <p className="mt-2 text-3xl font-bold text-emerald-600">
              {pacientesActivos}
            </p>

            <p className="mt-2 text-xs text-slate-500">Con estado activo</p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">En espera</p>

            <p className="mt-2 text-3xl font-bold text-amber-600">
              {pacientesEnEspera}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Pendientes de atención
            </p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Pacientes inactivos
            </p>
            <p className="mt-3 text-3xl font-bold text-rose-600">
              {pacientesInactivos}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Pacientes sin estado activo
            </p>
          </article>
        </section>

        {/* Listado de pacientes */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Listado de pacientes
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Información general y estado de cada paciente.
                </p>
              </div>

              <button
                type="button"
                disabled
                title="Disponible en una siguiente etapa"
                className="cursor-not-allowed rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white opacity-60"
              >
                + Nuevo paciente
              </button>
            </div>

            {/* Buscador y filtro visuales; interactividad pendiente */}
            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-[1fr_220px] md:items-end">
              <div className="pointer-events-none opacity-70">
                <BuscadorPacientes value="" onChange={() => undefined} />
              </div>

              <div>
                <label
                  htmlFor="filtro-estado"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Filtrar por estado
                </label>

                <select
                  id="filtro-estado"
                  disabled
                  defaultValue="todos"
                  className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-500 opacity-70"
                >
                  {estados.map((estado) => (
                    <option key={estado.valor} value={estado.valor}>
                      {estado.etiqueta}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Tarjetas para dispositivos móviles */}
          <div className="flex flex-col gap-4 p-4 md:hidden">
            {pacientesIniciales.map((paciente) => (
              <PacienteCard key={paciente.id} paciente={paciente} />
            ))}
          </div>

          {/* Tabla para pantallas medianas y grandes */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[800px] text-left">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  {[
                    "Paciente",
                    "Teléfono",
                    "Especialidad",
                    "Última cita",
                    "Estado",
                  ].map((columna) => (
                    <th
                      key={columna}
                      className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                      {columna}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {pacientesIniciales.map((paciente) => (
                  <PacienteRow key={paciente.id} paciente={paciente} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Pie del listado */}
          <div className="flex flex-col gap-1 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Mostrando {totalPacientes} pacientes
            </p>

            <span className="text-xs text-slate-400">
              Datos de demostración
            </span>
          </div>
        </section>
      </main>
    </div>
  );
}
