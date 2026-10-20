// src/services/citas.ts
import { api } from "../lib/axios";

export type EstadoCita = "PROGRAMADA" | "COMPLETADA" | "CANCELADA";

export interface Cita {
  id: number | string;
  pacienteId: number | string;
  pacienteNombre?: string;
  fecha: string;
  motivo?: string;
  estado: EstadoCita;
}

export const create = (data: Omit<Cita, "id">) =>
  api.post<Cita>("/citas", data);

export const updateEstado = (id: number | string, estado: EstadoCita) =>
  api.patch<Cita>(`/citas/${id}/estado`, { estado });
