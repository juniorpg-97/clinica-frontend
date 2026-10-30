import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { perfilSchema, type PerfilFormData } from "../schemas/perfilSchema";
import { perfilService } from "../services/perfil";
import { useAuthStore } from "../stores/authStore";
import { InputFotoPerfil } from "../componentes/InputFotoPerfil";
import { extraerMensajeError } from "../lib/errorHandler"; // 👈 Tu archivo existente

export default function PaginaPerfil() {
  const navigate = useNavigate();
  const usuario = useAuthStore((s) => s.usuario);
  const actualizarUsuario = useAuthStore((s) => s.actualizarUsuario);

  const [archivoFoto, setArchivoFoto] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PerfilFormData>({
    resolver: zodResolver(perfilSchema),
    defaultValues: {
      nombre: usuario?.nombre ?? "",
      email: usuario?.email ?? "",
      telefono: usuario?.telefono ?? "",
    },
  });

  const onSubmit = async (datos: PerfilFormData) => {
    const formData = new FormData();
    formData.append("nombre", datos.nombre);
    formData.append("email", datos.email);
    if (datos.telefono) formData.append("telefono", datos.telefono);
    if (archivoFoto) formData.append("foto", archivoFoto);

    try {
      const usuarioActualizado = await perfilService.actualizar(formData);
      actualizarUsuario(usuarioActualizado);
      toast.success("Perfil actualizado");
    } catch (err) {
      toast.error(extraerMensajeError(err));
    }
  };

  return (
    <div className="relative mx-auto max-w-2xl px-6 py-12">
      {/* Blobs decorativos (opcional, si tu Layout ya tiene fondo oscuro, esto le da el toque) */}
      <div className="pointer-events-none absolute -top-20 right-0 size-[400px] rounded-full bg-blue-600/10 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 size-[300px] rounded-full bg-red-600/10 blur-[100px]" />

      <div className="relative mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-blue-400">
          Tu cuenta
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-white">
          Mi Perfil
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Actualizá tus datos y tu foto de perfil.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative space-y-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur sm:p-8"
      >
        <div className="flex justify-center">
          <InputFotoPerfil
            fotoActual={usuario?.avatar ?? undefined}
            onChange={setArchivoFoto}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-zinc-300">
            Nombre completo
          </label>
          <input
            {...register("nombre")}
            className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-blue-500/50 focus:bg-white/10 focus:ring-4 focus:ring-blue-500/20"
          />
          {errors.nombre && (
            <span className="mt-1 block text-xs font-medium text-red-400">
              {errors.nombre.message}
            </span>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-zinc-300">
            Correo electrónico
          </label>
          <input
            {...register("email")}
            type="email"
            className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-blue-500/50 focus:bg-white/10 focus:ring-4 focus:ring-blue-500/20"
          />
          {errors.email && (
            <span className="mt-1 block text-xs font-medium text-red-400">
              {errors.email.message}
            </span>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-zinc-300">
            Teléfono <span className="text-zinc-500">(opcional)</span>
          </label>
          <input
            {...register("telefono")}
            type="tel"
            className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-blue-500/50 focus:bg-white/10 focus:ring-4 focus:ring-blue-500/20"
          />
          {errors.telefono && (
            <span className="mt-1 block text-xs font-medium text-red-400">
              {errors.telefono.message}
            </span>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="h-11 flex-1 rounded-xl border border-white/10 bg-white/5 text-sm font-bold text-zinc-300 transition hover:bg-white/10 hover:text-white"
          >
            Volver
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-11 flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-red-600 text-sm font-bold text-white shadow-lg shadow-red-600/30 transition hover:from-blue-500 hover:to-red-500 focus:outline-none focus:ring-4 focus:ring-red-500/30 disabled:opacity-50"
          >
            {isSubmitting ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}
