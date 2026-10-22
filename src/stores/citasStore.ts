// src/stores/citasStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { api } from "../lib/axios";
import { extraerMensajeError } from "../lib/errorHandler";
import type { Cita, EstadoCita } from "../types/cita";

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
  agregarCita: (cita: Omit<Cita, "id">) => Promise<boolean>;
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
          const res = await api.get("/citas");
          set(
            { citas: res.data.data, cargando: false },
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
          const res = await api.get("/citas", { params: { pacienteId: id } });
          set(
            { citas: res.data.data, cargando: false },
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
          await api.patch(`/citas/${id}/estado`, { estado });
          set(
            (state) => ({
              citas: state.citas.map((c) =>
                c.id === id ? { ...c, estado } : c,
              ),
              citaSeleccionada:
                state.citaSeleccionada?.id === id
                  ? { ...state.citaSeleccionada, estado }
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
          const res = await api.post("/citas", cita);
          set(
            (state) => ({
              citas: [...state.citas, res.data.data],
              cargando: false,
            }),
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
