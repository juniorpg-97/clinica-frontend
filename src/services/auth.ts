import { api } from "../lib/axios";

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  role: string;
  telefono?: string; // 👈 Agregado (opcional)
  avatar?: string; // 👈 Agregado (opcional, para la foto de perfil)
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export const login = async (datos: LoginDTO): Promise<LoginResponse> => {
  const respuesta = await api.post<LoginResponse>("/auth/login", datos);
  return respuesta.data;
};
