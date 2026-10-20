export type EstadoPaciente = "activo" | "inactivo" | "en_espera";

export interface Paciente {
  id: string | number;
  nombre: string;
  apellido?: string;
  apellidoPaterno: string;
  apellidoMaterno?: string | null;
  dni: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
  especialidadAsignada?: string;
  ultimaCita?: string;
  estado?: EstadoPaciente;
  creacion?: string;
}
