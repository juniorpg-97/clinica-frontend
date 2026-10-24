import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { citasService } from "../services/citas";
import { extraerMensajeError } from "../lib/errorHandler";
import type { Cita, EstadoCita } from "../types/cita";
import type { CrearCitaDTO } from "../types/dtos";

interface CitasState {
  citas: Cita[];
  citaSeleccionada: Cita | null;
  cargando: boolean;
  error: string | null;
  cargarTodas: () => Promise<void>;
  cargarPorPaciente: (id: string | number) => Promise<void>;
  seleccionar: (id: string | number) => void;
  actualizarEstado: (
    id: string | number,
    estado: EstadoCita,
  ) => Promise<boolean>;
  agregarCita: (cita: CrearCitaDTO) => Promise<boolean>;
}

export const useCitasStore = create<CitasState>()(
  devtools(
    (set, get) => ({
      citas: [],
      citaSeleccionada: null,
      cargando: false,
      error: null,

      cargarTodas: async () => {
        set({ cargando: true, error: null }, false, "CitasStore/cargarTodas");
        try {
          const data = await citasService.getAll();
          set(
            { citas: data, cargando: false },
            false,
            "CitasStore/cargarTodasExito",
          );
        } catch (err) {
          set(
            { error: extraerMensajeError(err), cargando: false },
            false,
            "CitasStore/cargarTodasError",
          );
        }
      },

      cargarPorPaciente: async (id) => {
        set(
          { cargando: true, error: null },
          false,
          "CitasStore/cargarPorPaciente",
        );
        try {
          const data = await citasService.getAll();
          const filtradas = data.filter((c) => c.pacienteId === Number(id));
          set(
            { citas: filtradas, cargando: false },
            false,
            "CitasStore/cargarPorPacienteExito",
          );
        } catch (err) {
          set(
            { error: extraerMensajeError(err), cargando: false },
            false,
            "CitasStore/cargarPorPacienteError",
          );
        }
      },

      seleccionar: (id) => {
        const cita = get().citas.find((c) => c.id === id);
        set(
          { citaSeleccionada: cita || null },
          false,
          "CitasStore/seleccionar",
        );
      },

      actualizarEstado: async (id, estado) => {
        set(
          { cargando: true, error: null },
          false,
          "CitasStore/actualizarEstado",
        );
        try {
          const actualizada = await citasService.updateEstado(id, estado);
          set(
            (state) => ({
              citas: state.citas.map((c) => (c.id === id ? actualizada : c)),
              citaSeleccionada:
                state.citaSeleccionada?.id === id
                  ? actualizada
                  : state.citaSeleccionada,
              cargando: false,
            }),
            false,
            "CitasStore/actualizarEstadoExito",
          );
          return true;
        } catch (err) {
          set(
            { error: extraerMensajeError(err), cargando: false },
            false,
            "CitasStore/actualizarEstadoError",
          );
          return false;
        }
      },

      agregarCita: async (cita) => {
        set({ cargando: true, error: null }, false, "CitasStore/agregarCita");
        try {
          const nueva = await citasService.create(cita);
          set(
            (state) => ({ citas: [...state.citas, nueva], cargando: false }),
            false,
            "CitasStore/agregarCitaExito",
          );
          return true;
        } catch (err) {
          set(
            { error: extraerMensajeError(err), cargando: false },
            false,
            "CitasStore/agregarCitaError",
          );
          return false;
        }
      },
    }),
    { name: "CitasStore" },
  ),
);
