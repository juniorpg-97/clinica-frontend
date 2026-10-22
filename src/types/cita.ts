// src/types/cita.ts

export type EstadoCita = "PROGRAMADA" | "COMPLETADA" | "CANCELADA";

export interface Cita {
  id: number;
  pacienteId: number;
  medicoId: number;
  fecha: string;
  hora: string;
  estado: EstadoCita;

  // Campos opcionales que maneja tu UI/backend
  pacienteNombre?: string;
  motivo?: string;
  urgencia?: string;
}
