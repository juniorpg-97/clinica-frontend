// src/stores/filtrosStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { EstadoCita } from "../types/cita";

interface FiltrosState {
  queryPacientes: string;
  especialidadFiltro: string;
  estadoCitaFiltro: EstadoCita | "Todos";
  setQueryPacientes: (query: string) => void;
  setEspecialidad: (especialidad: string) => void;
  setEstadoCita: (estado: EstadoCita | "Todos") => void;
  resetFiltros: () => void;
}

const estadoInicial = {
  queryPacientes: "",
  especialidadFiltro: "",
  estadoCitaFiltro: "Todos" as const,
};

export const useFiltrosStore = create<FiltrosState>()(
  devtools(
    (set) => ({
      ...estadoInicial,

      setQueryPacientes: (query) =>
        set({ queryPacientes: query }, false, "FiltrosStore/setQueryPacientes"),

      setEspecialidad: (especialidad) =>
        set(
          { especialidadFiltro: especialidad },
          false,
          "FiltrosStore/setEspecialidad",
        ),

      setEstadoCita: (estado) =>
        set({ estadoCitaFiltro: estado }, false, "FiltrosStore/setEstadoCita"),

      resetFiltros: () =>
        set(estadoInicial, false, "FiltrosStore/resetFiltros"),
    }),
    { name: "FiltrosStore" },
  ),
);
