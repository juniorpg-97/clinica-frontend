interface StatusBadgeProps {
  activo: boolean;
}

export default function StatusBadge({ activo }: StatusBadgeProps) {
  const estilos = activo
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : "border-rose-200 bg-rose-50 text-rose-700";

  const etiqueta = activo ? "Sistema Operativo" : "Modo Mantenimiento";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold ${estilos}`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          activo ? "bg-emerald-500" : "bg-rose-500"
        }`}
        aria-hidden="true"
      />

      {etiqueta}
    </span>
  );
}
