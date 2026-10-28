import { api } from "../lib/axios";
import type { LoginResponse } from "./auth";

type Usuario = LoginResponse["usuario"];

export const perfilService = {
  obtener: async (): Promise<Usuario> => {
    const res = await api.get<Usuario>("/auth/perfil");
    return res.data;
  },

  actualizar: async (formData: FormData): Promise<Usuario> => {
    const res = await api.put<Usuario>("/auth/perfil", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
};
