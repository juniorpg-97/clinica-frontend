// src/stores/pacientesStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { api } from "../lib/axios";
import { extraerMensajeError } from "../lib/errorHandler";
import type { Paciente } from "../types/paciente";

interface PacientesState {
  pacientes: Paciente[];
  cargando: boolean;
  error: string | null;
  cargar: (query?: string) => Promise<void>;
  crear: (paciente: Omit<Paciente, "id">) => Promise<boolean>;
  actualizar: (
    id: string | number,
    paciente: Partial<Paciente>,
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
          const res = await api.get("/pacientes");
          let pacientesData: Paciente[] = res.data.data;

          if (query) {
            const lowerQuery = query.toLowerCase();
            pacientesData = pacientesData.filter(
              (p) =>
                p.nombre.toLowerCase().includes(lowerQuery) ||
                p.apellidoPaterno.toLowerCase().includes(lowerQuery) ||
                p.dni.includes(lowerQuery),
            );
          }

          set(
            { pacientes: pacientesData, cargando: false },
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
          const res = await api.post("/pacientes", paciente);
          set(
            (state) => ({
              pacientes: [...state.pacientes, res.data.data],
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
          const res = await api.put(`/pacientes/${id}`, paciente);
          set(
            (state) => ({
              pacientes: state.pacientes.map((p) =>
                p.id === id ? { ...p, ...res.data.data } : p,
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
          await api.delete(`/pacientes/${id}`);
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
