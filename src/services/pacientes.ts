import { api } from "../lib/axios";
import type { Paciente } from "../types/paciente";
import type { CrearPacienteDTO, ActualizarPacienteDTO } from "../types/dtos";

interface PacienteApi {
  id: string | number;
  nombre: string;
  apellido?: string;
  apellido_paterno: string;
  apellido_materno?: string | null;
  dni: string;
  email: string;
  telefono: string;
  fecha_nacimiento: string;
  especialidad_asignada?: string;
  ultima_cita?: string;
  estado?: "activo" | "inactivo" | "en_espera";
  creacion?: string;
}

interface PacienteApiUpdate {
  nombre?: string;
  apellido?: string;
  apellido_paterno?: string;
  apellido_materno?: string | null;
  dni?: string;
  email?: string;
  telefono?: string;
  fecha_nacimiento?: string;
  especialidad_asignada?: string;
  ultima_cita?: string;
  estado?: "activo" | "inactivo" | "en_espera";
}

const convertirPaciente = (p: PacienteApi): Paciente => ({
  id: p.id,
  nombre: p.nombre,
  apellido: p.apellido,
  apellidoPaterno: p.apellido_paterno,
  apellidoMaterno: p.apellido_materno ?? null,
  dni: p.dni,
  email: p.email,
  telefono: p.telefono,
  fechaNacimiento: p.fecha_nacimiento,
  especialidadAsignada: p.especialidad_asignada,
  ultimaCita: p.ultima_cita,
  estado: p.estado,
  creacion: p.creacion,
});

const convertirDatos = (
  datos: Partial<CrearPacienteDTO>,
): PacienteApiUpdate => ({
  ...(datos.nombre !== undefined && { nombre: datos.nombre }),
  ...(datos.apellido !== undefined && { apellido: datos.apellido }),
  ...(datos.apellidoPaterno !== undefined && {
    apellido_paterno: datos.apellidoPaterno,
  }),
  ...(datos.apellidoMaterno !== undefined && {
    apellido_materno: datos.apellidoMaterno,
  }),
  ...(datos.dni !== undefined && { dni: datos.dni }),
  ...(datos.email !== undefined && { email: datos.email }),
  ...(datos.telefono !== undefined && { telefono: datos.telefono }),
  ...(datos.fechaNacimiento !== undefined && {
    fecha_nacimiento: datos.fechaNacimiento,
  }),
  ...(datos.especialidadAsignada !== undefined && {
    especialidad_asignada: datos.especialidadAsignada,
  }),
  ...(datos.ultimaCita !== undefined && { ultima_cita: datos.ultimaCita }),
  ...(datos.estado !== undefined && { estado: datos.estado }),
});

export const pacientesService = {
  getAll: async (query?: string): Promise<Paciente[]> => {
    const respuesta = await api.get<{ data: PacienteApi[] }>("/pacientes", {
      params: query ? { search: query } : {},
    });
    return respuesta.data.data.map(convertirPaciente);
  },

  create: async (datos: CrearPacienteDTO): Promise<Paciente> => {
    const respuesta = await api.post<PacienteApi>(
      "/pacientes",
      convertirDatos(datos),
    );
    return convertirPaciente(respuesta.data);
  },

  update: async (
    id: string | number,
    datos: ActualizarPacienteDTO,
  ): Promise<Paciente> => {
    const respuesta = await api.put<PacienteApi>(
      `/pacientes/${id}`,
      convertirDatos(datos),
    );
    return convertirPaciente(respuesta.data);
  },

  delete: async (id: string | number): Promise<void> => {
    await api.delete(`/pacientes/${id}`);
  },
};
