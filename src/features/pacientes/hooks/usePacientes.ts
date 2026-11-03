import { useEffect } from "react";
import { usePacientesStore } from "../../../stores/pacientesStore";

export function usePacientes() {
  const pacientes = usePacientesStore((s) => s.pacientes);
  const cargando = usePacientesStore((s) => s.cargando);
  const error = usePacientesStore((s) => s.error);

  const cargar = usePacientesStore((s) => s.cargar);
  const crear = usePacientesStore((s) => s.crear);
  const actualizar = usePacientesStore((s) => s.actualizar);
  const eliminar = usePacientesStore((s) => s.eliminar);

  useEffect(() => {
    void cargar();
  }, [cargar]);
  return {
    pacientes,
    cargando,
    error,
    cargar,
    crear,
    actualizar,
    eliminar,
  };
}
