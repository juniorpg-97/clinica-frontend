import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface InputFotoPerfilProps {
  fotoActual?: string;
  onChange: (archivo: File | null) => void;
}

export function InputFotoPerfil({
  fotoActual,
  onChange,
}: InputFotoPerfilProps) {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleSeleccion = (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    e.target.value = "";
    if (!archivo) return;

    if (!archivo.type.startsWith("image/")) {
      toast.error("El archivo debe ser una imagen");
      return;
    }
    if (archivo.size > 5 * 1024 * 1024) {
      toast.error("La imagen no puede superar los 5MB");
      return;
    }

    setPreview(URL.createObjectURL(archivo));
    onChange(archivo);
  };

  const quitarSeleccion = () => {
    setPreview(null);
    onChange(null);
  };

  const imagenMostrada = preview ?? fotoActual;

  return (
    <div className="flex flex-col items-center gap-3">
      <label className="group relative inline-block cursor-pointer">
        <div className="rounded-full bg-gradient-to-br from-blue-500 via-red-500 to-red-600 p-[3px] shadow-lg shadow-red-500/20 transition group-hover:shadow-red-500/40">
          <div className="relative h-28 w-28 overflow-hidden rounded-full border border-white/10 bg-zinc-900">
            {imagenMostrada ? (
              <img
                src={imagenMostrada}
                alt="Foto de perfil"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="grid h-full w-full place-items-center bg-gradient-to-br from-blue-600/20 to-red-600/20 text-zinc-500">
                <svg
                  className="size-12"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </span>
            )}

            <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
              <span className="text-xs font-semibold text-white">
                Cambiar foto
              </span>
            </div>
          </div>
        </div>

        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleSeleccion}
        />
      </label>

      {preview && (
        <button
          type="button"
          onClick={quitarSeleccion}
          className="text-xs font-semibold text-red-400 transition hover:text-red-300"
        >
          Quitar foto
        </button>
      )}
    </div>
  );
}
