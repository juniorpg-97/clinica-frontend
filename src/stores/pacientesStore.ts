import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { pacientesService } from "../services/pacientes";
import { extraerMensajeError } from "../lib/errorHandler";
import type { Paciente } from "../types/paciente";
import type { CrearPacienteDTO, ActualizarPacienteDTO } from "../types/dtos";

interface PacientesState {
  pacientes: Paciente[];
  cargando: boolean;
  error: string | null;
  cargar: (query?: string) => Promise<void>;
  crear: (paciente: CrearPacienteDTO) => Promise<boolean>;
  actualizar: (
    id: string | number,
    paciente: ActualizarPacienteDTO,
  ) => Promise<boolean>;
  eliminar: (id: string | number) => Promise<boolean>;
}

export const usePacientesStore = create<PacientesState>()(
  devtools(
    (set) => ({
      pacientes: [],
      cargando: false,
      error: null,

      cargar: async (query) => {
        set({ cargando: true, error: null }, false, "PacientesStore/cargar");
        try {
          const data = await pacientesService.getAll(query);
          set(
            { pacientes: data, cargando: false },
            false,
            "PacientesStore/cargarExito",
          );
        } catch (err) {
          set(
            { error: extraerMensajeError(err), cargando: false },
            false,
            "PacientesStore/cargarError",
          );
        }
      },

      crear: async (paciente) => {
        set({ cargando: true, error: null }, false, "PacientesStore/crear");
        try {
          const nuevo = await pacientesService.create(paciente);
          set(
            (state) => ({
              pacientes: [...state.pacientes, nuevo],
              cargando: false,
            }),
            false,
            "PacientesStore/crearExito",
          );
          return true;
        } catch (err) {
          set(
            { error: extraerMensajeError(err), cargando: false },
            false,
            "PacientesStore/crearError",
          );
          return false;
        }
      },

      actualizar: async (id, paciente) => {
        set(
          { cargando: true, error: null },
          false,
          "PacientesStore/actualizar",
        );
        try {
          const actualizado = await pacientesService.update(id, paciente);
          set(
            (state) => ({
              pacientes: state.pacientes.map((p) =>
                p.id === id ? actualizado : p,
              ),
              cargando: false,
            }),
            false,
            "PacientesStore/actualizarExito",
          );
          return true;
        } catch (err) {
          set(
            { error: extraerMensajeError(err), cargando: false },
            false,
            "PacientesStore/actualizarError",
          );
          return false;
        }
      },

      eliminar: async (id) => {
        set({ cargando: true, error: null }, false, "PacientesStore/eliminar");
        try {
          await pacientesService.delete(id);
          set(
            (state) => ({
              pacientes: state.pacientes.filter((p) => p.id !== id),
              cargando: false,
            }),
            false,
            "PacientesStore/eliminarExito",
          );
          return true;
        } catch (err) {
          set(
            { error: extraerMensajeError(err), cargando: false },
            false,
            "PacientesStore/eliminarError",
          );
          return false;
        }
      },
    }),
    { name: "PacientesStore" },
  ),
);
