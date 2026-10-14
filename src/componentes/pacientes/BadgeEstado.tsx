import type { EstadoPaciente } from "../../types/paciente";

interface BadgeEstadoProps {
  estado: EstadoPaciente;
}

const estilosEstado: Record<EstadoPaciente, string> = {
  activo: "bg-emerald-100 text-emerald-700",
  inactivo: "bg-rose-100 text-rose-700",
  en_espera: "bg-amber-100 text-amber-700",
};

const etiquetasEstado: Record<EstadoPaciente, string> = {
  activo: "Activo",
  inactivo: "Inactivo",
  en_espera: "En espera",
};

export default function BadgeEstado({ estado }: BadgeEstadoProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${estilosEstado[estado]}`}
    >
      <span className="h-2 w-2 rounded-full bg-current" aria-hidden="true" />
      {etiquetasEstado[estado]}
    </span>
  );
}
