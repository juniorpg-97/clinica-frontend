import { useState, useEffect, useCallback } from "react";
import Encabezado from "../componentes/layout/Encabezado";
import BuscadorPacientes from "../componentes/pacientes/BuscadorPacientes";
import PacienteRow from "../componentes/pacientes/PacienteRow";
import PacienteCard from "../componentes/pacientes/PacienteCard";
import { api } from "../lib/axios";
import type { Paciente, EstadoPaciente } from "../types/paciente";

const estados = [
  { valor: "Todos", etiqueta: "Todos los estados" },
  { valor: "activo", etiqueta: "Activo" },
  { valor: "inactivo", etiqueta: "Inactivo" },
  { valor: "en_espera", etiqueta: "En espera" },
] as const;

type FiltroEstado = (typeof estados)[number]["valor"];
type EstadoNuevoPaciente = Exclude<FiltroEstado, "Todos">;

export default function PaginaPacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [totalServidor, setTotalServidor] = useState<number | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);
  const [errorCarga, setErrorCarga] = useState<boolean>(false);

  const [busqueda, setBusqueda] = useState<string>("");
  const [estadoFiltro, setEstadoFiltro] = useState<FiltroEstado>("Todos");

  const [mostrarFormulario, setMostrarFormulario] = useState<boolean>(false);

  const [nombre, setNombre] = useState<string>("");
  const [apellido, setApellido] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [estadoNuevo, setEstadoNuevo] = useState<EstadoNuevoPaciente>("activo");

  const [error, setError] = useState<string>("");

  const cargarPacientes = useCallback(async (): Promise<void> => {
    setCargando(true);
    setErrorCarga(false);

    try {
      const res = await api.get("/pacientes");

      const datos: unknown = Array.isArray(res.data)
        ? res.data
        : res.data?.data;

      if (!Array.isArray(datos)) {
        throw new Error(
          "La respuesta del servidor no contiene una lista de pacientes.",
        );
      }

      setPacientes(datos as Paciente[]);

      const total: unknown = Array.isArray(res.data)
        ? datos.length
        : res.data?.total;

      setTotalServidor(typeof total === "number" ? total : datos.length);
    } catch (err: unknown) {
      console.error("Error al cargar pacientes:", err);
      setErrorCarga(true);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void cargarPacientes();
  }, [cargarPacientes]);

  const pacientesFiltrados = pacientes.filter((paciente) => {
    const nombreCompleto =
      `${paciente.nombre} ${paciente.apellido}`.toLowerCase();

    const coincideNombre = nombreCompleto.includes(
      busqueda.trim().toLowerCase(),
    );

    const coincideEstado =
      estadoFiltro === "Todos" || paciente.estado === estadoFiltro;

    return coincideNombre && coincideEstado;
  });

  const totalPacientes = pacientes.length;

  const pacientesActivos = pacientes.filter(
    (paciente) => paciente.estado === "activo",
  ).length;

  const pacientesInactivos = pacientes.filter(
    (paciente) => paciente.estado === "inactivo",
  ).length;

  const pacientesEnEspera = pacientes.filter(
    (paciente) => paciente.estado === "en_espera",
  ).length;

  const handleAgregarPaciente = (
    event: React.FormEvent<HTMLFormElement>,
  ): void => {
    event.preventDefault();
    setError("");

    const nombreLimpio = nombre.trim();
    const apellidoLimpio = apellido.trim();
    const emailLimpio = email.trim();

    if (!nombreLimpio || !emailLimpio) {
      setError("El nombre y el correo electrónico son obligatorios.");
      return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLimpio);

    if (!emailValido) {
      setError("Ingresa un correo electrónico válido.");
      return;
    }

    const emailExiste = pacientes.some(
      (paciente) => paciente.email.toLowerCase() === emailLimpio.toLowerCase(),
    );

    if (emailExiste) {
      setError("Ya existe un paciente registrado con ese correo.");
      return;
    }

    const nuevoPaciente: Paciente = {
      id: crypto.randomUUID(),
      nombre: nombreLimpio,
      apellido: apellidoLimpio,
      email: emailLimpio,
      telefono: "",
      especialidadAsignada: "Sin asignar",
      ultimaCita: "Sin citas",
      estado: estadoNuevo,
    };

    setPacientes((prev) => [...prev, nuevoPaciente]);
    setTotalServidor((prev) => (prev === null ? null : prev + 1));

    setNombre("");
    setApellido("");
    setEmail("");
    setEstadoNuevo("activo");
    setError("");
    setMostrarFormulario(false);
  };

  const handleCambiarEstado = (id: string, estado: EstadoPaciente): void => {
    setPacientes((prev) =>
      prev.map((paciente) =>
        paciente.id === id ? { ...paciente, estado } : paciente,
      ),
    );
  };

  const handleEliminarPaciente = (id: string): void => {
    const paciente = pacientes.find((item) => item.id === id);

    if (!paciente) {
      return;
    }

    const confirmar = window.confirm(
      `¿Estás seguro de que deseas eliminar a ${paciente.nombre} ${paciente.apellido}?`,
    );

    if (!confirmar) {
      return;
    }

    setPacientes((prev) => prev.filter((item) => item.id !== id));
    setTotalServidor((prev) => (prev === null ? null : Math.max(0, prev - 1)));
  };

  const handleLimpiarFiltros = (): void => {
    setBusqueda("");
    setEstadoFiltro("Todos");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Encabezado
        titulo="Pacientes"
        descripcion="Administra los registros y el estado de tus pacientes."
      />

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-violet-600">
              Gestión de pacientes
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Pacientes
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Administra los registros y el estado de tus pacientes.
            </p>
          </div>

          <button
            type="button"
            disabled={cargando || errorCarga}
            onClick={() => {
              setMostrarFormulario((prev) => !prev);
              setError("");
            }}
            className="rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {mostrarFormulario ? "Cancelar" : "+ Nuevo paciente"}
          </button>
        </section>

        {cargando && (
          <section
            role="status"
            className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm"
          >
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />

            <p className="mt-4 font-medium text-slate-700">
              Cargando pacientes...
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Estamos consultando los registros del servidor.
            </p>
          </section>
        )}

        {errorCarga && !cargando && (
          <section
            role="alert"
            className="rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm"
          >
            <h2 className="text-lg font-bold text-rose-700">
              No se pudieron cargar los pacientes
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Verifica que el backend esté funcionando y vuelve a intentarlo.
            </p>

            <button
              type="button"
              onClick={() => void cargarPacientes()}
              className="mt-5 rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white transition hover:bg-violet-700"
            >
              Reintentar
            </button>
          </section>
        )}

        {!cargando && !errorCarga && (
          <>
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-slate-900">
                {totalServidor ?? totalPacientes}
              </span>{" "}
              {(totalServidor ?? totalPacientes) === 1
                ? "paciente registrado"
                : "pacientes registrados"}
            </p>

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-sm text-slate-500">Total de pacientes</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {totalPacientes}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-sm text-slate-500">Pacientes activos</p>
                <p className="mt-2 text-3xl font-bold text-emerald-600">
                  {pacientesActivos}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-sm text-slate-500">Pacientes inactivos</p>
                <p className="mt-2 text-3xl font-bold text-rose-600">
                  {pacientesInactivos}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-sm text-slate-500">En espera</p>
                <p className="mt-2 text-3xl font-bold text-amber-600">
                  {pacientesEnEspera}
                </p>
              </div>
            </section>

            {mostrarFormulario && (
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900">
                  Registrar paciente
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Completa los datos para añadir un nuevo registro.
                </p>

                <form
                  onSubmit={handleAgregarPaciente}
                  className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2"
                >
                  <label className="text-sm font-medium text-slate-700">
                    Nombre *
                    <input
                      type="text"
                      value={nombre}
                      onChange={(event) => setNombre(event.target.value)}
                      placeholder="Ej. María"
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                    />
                  </label>

                  <label className="text-sm font-medium text-slate-700">
                    Apellido
                    <input
                      type="text"
                      value={apellido}
                      onChange={(event) => setApellido(event.target.value)}
                      placeholder="Ej. García"
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                    />
                  </label>

                  <label className="text-sm font-medium text-slate-700">
                    Correo electrónico *
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="maria@correo.com"
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                    />
                  </label>

                  <label className="text-sm font-medium text-slate-700">
                    Estado inicial
                    <select
                      value={estadoNuevo}
                      onChange={(event) =>
                        setEstadoNuevo(
                          event.target.value as EstadoNuevoPaciente,
                        )
                      }
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-violet-500"
                    >
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                      <option value="en_espera">En espera</option>
                    </select>
                  </label>

                  {error && (
                    <p
                      role="alert"
                      className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700 sm:col-span-2"
                    >
                      {error}
                    </p>
                  )}

                  <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setMostrarFormulario(false);
                        setNombre("");
                        setApellido("");
                        setEmail("");
                        setEstadoNuevo("activo");
                        setError("");
                      }}
                      className="rounded-xl border border-slate-200 px-5 py-3 font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      className="rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white hover:bg-violet-700"
                    >
                      Guardar paciente
                    </button>
                  </div>
                </form>
              </section>
            )}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
                <div className="flex-1">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Buscar paciente
                  </label>

                  <BuscadorPacientes value={busqueda} onChange={setBusqueda} />
                </div>

                <div className="w-full lg:w-64">
                  <label
                    htmlFor="filtro-estado"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Filtrar por estado
                  </label>

                  <select
                    id="filtro-estado"
                    value={estadoFiltro}
                    onChange={(event) =>
                      setEstadoFiltro(event.target.value as FiltroEstado)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-violet-500"
                  >
                    {estados.map((estado) => (
                      <option key={estado.valor} value={estado.valor}>
                        {estado.etiqueta}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleLimpiarFiltros}
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  Limpiar filtros
                </button>
              </div>

              <p className="mt-4 text-sm text-slate-500">
                <span className="font-semibold text-slate-900">
                  {pacientesFiltrados.length}
                </span>{" "}
                {pacientesFiltrados.length === 1
                  ? "paciente encontrado"
                  : "pacientes encontrados"}
              </p>
            </section>

            <section className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50">
                    <tr className="text-xs uppercase tracking-wide text-slate-500">
                      <th className="px-6 py-4">Paciente</th>
                      <th className="px-6 py-4">Teléfono</th>
                      <th className="px-6 py-4">Especialidad</th>
                      <th className="px-6 py-4">Última cita</th>
                      <th className="px-6 py-4">Estado actual</th>
                      <th className="px-6 py-4">Cambiar estado</th>
                      <th className="px-6 py-4">Acciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {pacientesFiltrados.map((paciente) => (
                      <PacienteRow
                        key={paciente.id}
                        paciente={paciente}
                        onCambiarEstado={handleCambiarEstado}
                        onEliminar={handleEliminarPaciente}
                      />
                    ))}

                    {pacientesFiltrados.length === 0 && (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-6 py-12 text-center text-slate-500"
                        >
                          No se encontraron pacientes con esos filtros.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="grid grid-cols-1 gap-4 lg:hidden">
              {pacientesFiltrados.map((paciente) => (
                <PacienteCard
                  key={paciente.id}
                  paciente={paciente}
                  onCambiarEstado={handleCambiarEstado}
                  onEliminar={handleEliminarPaciente}
                />
              ))}

              {pacientesFiltrados.length === 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
                  No se encontraron pacientes con esos filtros.
                </div>
              )}
            </section>

            <p className="text-center text-sm text-slate-500">
              Mostrando {pacientesFiltrados.length} de{" "}
              {totalServidor ?? totalPacientes} pacientes
            </p>
          </>
        )}
      </main>
    </div>
  );
}
