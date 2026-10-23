import { create } from "zustand";

interface FiltrosState {
  queryPacientes: string;
  setQueryPacientes: (query: string) => void;
  resetFiltros: () => void;
}

export const useFiltrosStore = create<FiltrosState>((set) => ({
  queryPacientes: "",
  setQueryPacientes: (query) => set({ queryPacientes: query }),
  resetFiltros: () => set({ queryPacientes: "" }),
}));
