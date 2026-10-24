import type { Cita } from "./cita";
import type { Paciente } from "./paciente";

export type CrearPacienteDTO = Omit<Paciente, "id" | "creadoEn">;
export type ActualizarPacienteDTO = Partial<Omit<Paciente, "id">>;
export type ResumenPaciente = Pick<
  Paciente,
  "id" | "nombre" | "apellido" | "email"
>;

export type CrearCitaDTO = Omit<Cita, "id" | "estado">;
export type ActualizarCitaDTO = Partial<Omit<Cita, "id">>;
