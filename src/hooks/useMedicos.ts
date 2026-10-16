import { useEffect, useState } from "react";
import type { Medico } from "../types/medico";

const medicosSimulados: Medico[] = [
  {
    id: "med-001",
    nombre: "Dra. Ana Torres",
    especialidad: "Medicina general",
  },
  {
    id: "med-002",
    nombre: "Dr. Carlos Mendoza",
    especialidad: "Cardiología",
  },
  {
    id: "med-003",
    nombre: "Dra. María Flores",
    especialidad: "Pediatría",
  },
  {
    id: "med-004",
    nombre: "Dr. Luis Ramírez",
    especialidad: "Dermatología",
  },
];

export function useMedicos() {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMedicos(medicosSimulados);
      setCargando(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return { medicos, cargando };
}
