import { api } from "../lib/axios";
import type { Cita, EstadoCita } from "../types/cita";
import type { CrearCitaDTO } from "../types/dtos";

interface CitaApi {
  id: number | string;
  paciente_id: number | string;
  medico_id: number | string;
  fecha: string;
  hora: string;
  paciente_nombre?: string;
  motivo?: string;
  urgencia?: string;
  estado: EstadoCita;
}

interface CitaApiUpdate {
  paciente_id?: number | string;
  medico_id?: number | string;
  fecha?: string;
  hora?: string;
  motivo?: string;
  urgencia?: string;
}

const convertirCita = (cita: CitaApi): Cita => ({
  id: Number(cita.id),
  pacienteId: Number(cita.paciente_id),
  medicoId: Number(cita.medico_id),
  fecha: cita.fecha,
  hora: cita.hora,
  estado: cita.estado,
  pacienteNombre: cita.paciente_nombre ?? "",
  motivo: cita.motivo ?? "",
  urgencia: cita.urgencia ?? "",
});

const convertirDatos = (datos: Partial<CrearCitaDTO>): CitaApiUpdate => ({
  ...(datos.pacienteId !== undefined && { paciente_id: datos.pacienteId }),
  ...(datos.medicoId !== undefined && { medico_id: datos.medicoId }),
  ...(datos.fecha !== undefined && { fecha: datos.fecha }),
  ...(datos.hora !== undefined && { hora: datos.hora }),
  ...(datos.motivo !== undefined && { motivo: datos.motivo }),
  ...(datos.urgencia !== undefined && { urgencia: datos.urgencia }),
});

export const citasService = {
  getAll: async (): Promise<Cita[]> => {
    const respuesta = await api.get<{ data: CitaApi[] }>("/citas");
    return respuesta.data.data.map(convertirCita);
  },

  create: async (datos: CrearCitaDTO): Promise<Cita> => {
    const respuesta = await api.post<CitaApi>("/citas", convertirDatos(datos));
    return convertirCita(respuesta.data);
  },

  updateEstado: async (
    id: number | string,
    estado: EstadoCita,
  ): Promise<Cita> => {
    const respuesta = await api.patch<CitaApi>(`/citas/${id}/estado`, {
      estado,
    });
    return convertirCita(respuesta.data);
  },
};
