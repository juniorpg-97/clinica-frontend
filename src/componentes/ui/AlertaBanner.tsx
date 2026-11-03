type TipoAlerta = "info" | "exito" | "advertencia" | "error";

interface AlertaBannerProps {
  tipo: TipoAlerta;
  mensaje: string;
  onClose?: () => void;
}

const estilosPorTipo: Record<TipoAlerta, string> = {
  info: "bg-blue-50 text-blue-800 border-blue-200",
  exito: "bg-emerald-50 text-emerald-800 border-emerald-200",
  advertencia: "bg-amber-50 text-amber-800 border-amber-200",
  error: "bg-rose-50 text-rose-800 border-rose-200",
};

export function AlertaBanner({ tipo, mensaje, onClose }: AlertaBannerProps) {
  return (
    <div
      className={`flex items-center justify-between rounded-lg border p-4 ${estilosPorTipo[tipo]}`}
    >
      <span className="text-sm font-medium">{mensaje}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 text-current opacity-70 hover:opacity-100"
        >
          ✕
        </button>
        // Puedes usar el ícono X de lucide-react si lo prefieres: <X size={16} />
      )}
    </div>
  );
}
