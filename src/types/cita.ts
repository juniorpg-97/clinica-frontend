export type EstadoCita = "PROGRAMADA" | "COMPLETADA" | "CANCELADA";

export interface Cita {
  id: number;
  pacienteId: number;
  medicoId: number;
  fecha: string;
  hora: string;
  estado: EstadoCita;
  creacion?: string;
  paciente?: {
    nombre: string;
    apellidoPaterno: string;
  };
  medico?: {
    nombre: string;
    apellidoPaterno: string;
  };
}
