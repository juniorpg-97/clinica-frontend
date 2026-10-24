import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface FiltrosState {
  queryPacientes: string;
  setQueryPacientes: (query: string) => void;
  resetFiltros: () => void;
}

export const useFiltrosStore = create<FiltrosState>()(
  devtools(
    (set) => ({
      queryPacientes: "",
      setQueryPacientes: (query) =>
        set({ queryPacientes: query }, false, "FiltrosStore/setQueryPacientes"),
      resetFiltros: () =>
        set({ queryPacientes: "" }, false, "FiltrosStore/resetFiltros"),
    }),
    { name: "FiltrosStore" },
  ),
);
