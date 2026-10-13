interface StatusBadgeProps {
  activo: boolean;
}

export default function StatusBadge({ activo }: StatusBadgeProps) {
  const color = activo
    ? "bg-emerald-100 text-emerald-700"
    : "bg-rose-100 text-rose-700";

  const texto = activo ? "Sistema Operativo" : "Modo Mantenimiento";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${color}`}
    >
      {texto}
    </span>
  );
}
