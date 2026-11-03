import { Spinner } from "./Spinner";

interface ModalConfirmacionProps {
  isOpen: boolean;
  titulo: string;
  mensaje: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ModalConfirmacion({
  isOpen,
  titulo,
  mensaje,
  onConfirm,
  onCancel,
  isLoading = false,
}: ModalConfirmacionProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900">{titulo}</h3>
        <p className="mt-2 text-sm text-gray-600">{mensaje}</p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-700 disabled:opacity-50"
          >
            {isLoading && <Spinner size="sm" />}
            {isLoading ? "Procesando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}
