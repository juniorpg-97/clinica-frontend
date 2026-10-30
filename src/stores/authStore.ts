import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LoginResponse } from "../services/auth";

type Usuario = LoginResponse["usuario"];

interface AuthState {
  token: string | null;
  usuario: Usuario | null;
  isAuthenticated: boolean;
  login: (token: string, usuario: Usuario) => void;
  logout: () => void;
  actualizarUsuario: (data: Partial<Usuario>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      usuario: null,
      isAuthenticated: false,

      login: (token, usuario) => set({ token, usuario, isAuthenticated: true }),

      logout: () => set({ token: null, usuario: null, isAuthenticated: false }),

      actualizarUsuario: (data) => {
        const actual = get().usuario;
        if (!actual) return;
        set({ usuario: { ...actual, ...data } });
      },
    }),
    { name: "auth-storage" },
  ),
);
