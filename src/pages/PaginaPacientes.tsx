import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

import Encabezado from "../componentes/layout/Encabezado";
import { BuscadorPacientes } from "../componentes/pacientes/BuscadorPacientes";
import PacienteRow from "../componentes/pacientes/PacienteRow";
import PacienteCard from "../componentes/pacientes/PacienteCard";
import ModalConfirmacion from "../componentes/ModalConfirmacion";

import { usePacientesStore } from "../stores/pacientesStore";
import { useFiltrosStore } from "../stores/filtrosStore";
import { extraerMensajeError } from "../lib/errorHandler";
import type { Paciente, EstadoPaciente } from "../types/paciente";

// 👇 NUEVOS IMPORTS PARA UI ROBUSTA
import { SkeletonPacienteRow } from "../componentes/ui/SkeletonPacienteRow";
import { EstadoVacio } from "../componentes/ui/EstadoVacio";

const estados = [
  { valor: "Todos", etiqueta: "Todos los estados" },
  { valor: "activo", etiqueta: "Activo" },
  { valor: "inactivo", etiqueta: "Inactivo" },
  { valor: "en_espera", etiqueta: "En espera" },
] as const;

type FiltroEstado = (typeof estados)[number]["valor"];

const pacienteSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es obligatorio."),
  apellido: z.string().trim().min(1, "El apellido es obligatorio."),
  dni: z.string().trim().min(8, "El DNI debe tener al menos 8 dígitos."),
  email: z
    .string()
    .trim()
    .min(1, "El correo es obligatorio.")
    .email("Ingresa un correo válido."),
  telefono: z.string().trim().optional(),
  fechaNacimiento: z.string().min(1, "La fecha de nacimiento es obligatoria."),
  estado: z.enum(["activo", "inactivo", "en_espera"]),
});

type FormPacienteValues = z.infer<typeof pacienteSchema>;

export default function PaginaPacientes() {
  const pacientes = usePacientesStore((s) => s.pacientes);
  const cargando = usePacientesStore((s) => s.cargando);
  const error = usePacientesStore((s) => s.error);
  const cargar = usePacientesStore((s) => s.cargar);
  const crear = usePacientesStore((s) => s.crear);
  const eliminar = usePacientesStore((s) => s.eliminar);
  const actualizar = usePacientesStore((s) => s.actualizar);

  const queryPacientes = useFiltrosStore((s) => s.queryPacientes);
  const setQueryPacientes = useFiltrosStore((s) => s.setQueryPacientes);

  const [estadoFiltro, setEstadoFiltro] = useState<FiltroEstado>("Todos");
  const [mostrarFormulario, setMostrarFormulario] = useState<boolean>(false);
  const [idAEliminar, setIdAEliminar] = useState<string | number | null>(null);
  const [eliminando, setEliminando] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormPacienteValues>({
    resolver: zodResolver(pacienteSchema),
    defaultValues: {
      nombre: "",
      apellido: "",
      dni: "",
      email: "",
      telefono: "",
      fechaNacimiento: "1995-01-01",
      estado: "activo",
    },
  });

  useEffect(() => {
    void cargar();
  }, [cargar]);

  const onSubmit = async (data: FormPacienteValues): Promise<void> => {
    const emailExiste = pacientes.some(
      (paciente) => paciente.email.toLowerCase() === data.email.toLowerCase(),
    );
    if (emailExiste) {
      toast.error("Ya existe un paciente registrado con ese correo.");
      return;
    }

    try {
      const payload = {
        nombre: data.nombre.trim(),
        apellidoPaterno: data.apellido.trim(),
        dni: data.dni.trim(),
        email: data.email.trim().toLowerCase(),
        telefono: data.telefono ? data.telefono.trim() : null,
        fechaNacimiento: new Date(data.fechaNacimiento).toISOString(),
      };
      const exito = await crear(payload as unknown as Omit<Paciente, "id">);
      if (exito) {
        toast.success("Paciente registrado");
        reset();
        setMostrarFormulario(false);
      }
    } catch (err: unknown) {
      toast.error(extraerMensajeError(err));
    }
  };

  const handleConfirmarEliminar = async (): Promise<void> => {
    if (idAEliminar === null) return;
    setEliminando(true);
    try {
      const exito = await eliminar(idAEliminar);
      if (exito) {
        toast.success("Paciente eliminado");
        setIdAEliminar(null);
      }
    } catch (err: unknown) {
      toast.error(extraerMensajeError(err));
    } finally {
      setEliminando(false);
    }
  };

  const handleCambiarEstado = (
    id: string | number,
    estado: EstadoPaciente,
  ): void => {
    void actualizar(id, { estado });
  };

  const pacientesFiltrados = pacientes.filter((paciente) => {
    const apellidoMostrar = paciente.apellido ?? paciente.apellidoPaterno ?? "";
    const nombreCompleto =
      `${paciente.nombre} ${apellidoMostrar}`.toLowerCase();
    const coincideNombre = nombreCompleto.includes(
      queryPacientes.trim().toLowerCase(),
    );
    const coincideEstado =
      estadoFiltro === "Todos" || paciente.estado === estadoFiltro;
    return coincideNombre && coincideEstado;
  });

  const totalPacientes = pacientes.length;
  const pacientesActivos = pacientes.filter(
    (p) => p.estado === "activo",
  ).length;
  const pacientesInactivos = pacientes.filter(
    (p) => p.estado === "inactivo",
  ).length;
  const pacientesEnEspera = pacientes.filter(
    (p) => p.estado === "en_espera",
  ).length;

  const handleLimpiarFiltros = (): void => {
    setQueryPacientes("");
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
            disabled={cargando || !!error}
            onClick={() => {
              setMostrarFormulario((prev) => !prev);
              reset();
            }}
            className="rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {mostrarFormulario ? "Cancelar" : "+ Nuevo paciente"}
          </button>
        </section>

        {/* 👇 MEJORA: Skeletons específicos en lugar de spinner manual */}
        {cargando && (
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
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
                {Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonPacienteRow key={i} />
                ))}
              </tbody>
            </table>
          </section>
        )}

        {error && !cargando && (
          <section
            role="alert"
            className="rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm"
          >
            <h2 className="text-lg font-bold text-rose-700">
              No se pudieron cargar los pacientes
            </h2>
            <p className="mt-2 text-sm text-slate-600">{error}</p>
            <button
              type="button"
              onClick={() => void cargar()}
              className="mt-5 rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white transition hover:bg-violet-700"
            >
              Reintentar
            </button>
          </section>
        )}

        {!cargando && !error && (
          <>
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-slate-900">
                {totalPacientes}
              </span>{" "}
              {totalPacientes === 1
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
                  onSubmit={handleSubmit(onSubmit)}
                  className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2"
                >
                  <label className="text-sm font-medium text-slate-700">
                    Nombre *
                    <input
                      type="text"
                      {...register("nombre")}
                      placeholder="Ej. María"
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                    />
                    {errors.nombre && (
                      <p className="mt-1 text-xs text-rose-600">
                        {errors.nombre.message}
                      </p>
                    )}
                  </label>
                  <label className="text-sm font-medium text-slate-700">
                    Apellido *
                    <input
                      type="text"
                      {...register("apellido")}
                      placeholder="Ej. García"
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                    />
                    {errors.apellido && (
                      <p className="mt-1 text-xs text-rose-600">
                        {errors.apellido.message}
                      </p>
                    )}
                  </label>
                  <label className="text-sm font-medium text-slate-700">
                    DNI *
                    <input
                      type="text"
                      {...register("dni")}
                      placeholder="Ej. 74859612"
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                    />
                    {errors.dni && (
                      <p className="mt-1 text-xs text-rose-600">
                        {errors.dni.message}
                      </p>
                    )}
                  </label>
                  <label className="text-sm font-medium text-slate-700">
                    Correo electrónico *
                    <input
                      type="email"
                      {...register("email")}
                      placeholder="maria@correo.com"
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-rose-600">
                        {errors.email.message}
                      </p>
                    )}
                  </label>
                  <label className="text-sm font-medium text-slate-700">
                    Teléfono
                    <input
                      type="text"
                      {...register("telefono")}
                      placeholder="Ej. 987654321"
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                    />
                  </label>
                  <label className="text-sm font-medium text-slate-700">
                    Fecha de nacimiento *
                    <input
                      type="date"
                      {...register("fechaNacimiento")}
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                    />
                    {errors.fechaNacimiento && (
                      <p className="mt-1 text-xs text-rose-600">
                        {errors.fechaNacimiento.message}
                      </p>
                    )}
                  </label>
                  <label className="text-sm font-medium text-slate-700 sm:col-span-2">
                    Estado inicial
                    <select
                      {...register("estado")}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-violet-500"
                    >
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                      <option value="en_espera">En espera</option>
                    </select>
                  </label>
                  <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setMostrarFormulario(false);
                        reset();
                      }}
                      className="rounded-xl border border-slate-200 px-5 py-3 font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white transition hover:bg-violet-700 disabled:opacity-50"
                    >
                      {isSubmitting ? "Guardando..." : "Guardar paciente"}
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
                  <BuscadorPacientes />
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
                        onAbrirModalEliminar={setIdAEliminar}
                      />
                    ))}
                    {/* 👇 MEJORA: EstadoVacio en lugar de texto simple */}
                    {pacientesFiltrados.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-6 py-12">
                          <EstadoVacio
                            titulo="No se encontraron pacientes"
                            descripcion="Intenta ajustar los filtros de búsqueda o agrega un nuevo paciente."
                            accion={{
                              label: "Limpiar filtros",
                              onClick: handleLimpiarFiltros,
                            }}
                          />
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
                  onAbrirModalEliminar={setIdAEliminar}
                />
              ))}
              {pacientesFiltrados.length === 0 && (
                <div className="col-span-full">
                  <EstadoVacio
                    titulo="No se encontraron pacientes"
                    descripcion="Intenta ajustar los filtros de búsqueda o agrega un nuevo paciente."
                    accion={{
                      label: "Limpiar filtros",
                      onClick: handleLimpiarFiltros,
                    }}
                  />
                </div>
              )}
            </section>

            <p className="text-center text-sm text-slate-500">
              Mostrando {pacientesFiltrados.length} de {totalPacientes}{" "}
              pacientes
            </p>
          </>
        )}
      </main>

      <ModalConfirmacion
        isOpen={idAEliminar !== null}
        titulo="¿Eliminar paciente?"
        mensaje="Esta acción no se puede deshacer. ¿Seguro que deseas eliminar el registro?"
        isLoading={eliminando}
        onConfirm={() => void handleConfirmarEliminar()}
        onClose={() => setIdAEliminar(null)}
      />
    </div>
  );
}
