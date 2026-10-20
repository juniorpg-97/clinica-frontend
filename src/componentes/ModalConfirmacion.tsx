interface ModalConfirmacionProps {
  isOpen: boolean;
  titulo: string;
  mensaje: string;
  isLoading: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ModalConfirmacion({
  isOpen,
  titulo,
  mensaje,
  isLoading,
  onConfirm,
  onClose,
}: ModalConfirmacionProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <h3 className="text-lg font-bold text-slate-900">{titulo}</h3>
        <p className="mt-2 text-sm text-slate-600">{mensaje}</p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-50"
          >
            {isLoading ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}
