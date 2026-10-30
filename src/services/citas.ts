import { api } from "../lib/axios";
import type { Cita, EstadoCita } from "../types/cita";
import type { CrearCitaDTO } from "../types/dtos";
import type { RespuestaPaginada } from "../types/api";

// 1. Interfaz ajustada a la respuesta REAL de tu backend
interface CitaApi {
  id: number;
  pacienteId: number;
  medicoId: number;
  fecha: string;
  hora: string;
  estado: EstadoCita;
  creacion: string;
  paciente?: {
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string | null;
  };
  medico?: {
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string | null;
  };
}

interface CitaApiUpdate {
  pacienteId?: number;
  medicoId?: number;
  fecha?: string;
  hora?: string;
  motivo?: string;
  urgencia?: string;
}

// 2. Función de conversión actualizada para unir nombre + apellido
const convertirCita = (cita: CitaApi): Cita => {
  const nombrePaciente = cita.paciente
    ? `${cita.paciente.nombre} ${cita.paciente.apellidoPaterno} ${cita.paciente.apellidoMaterno || ""}`.trim()
    : `Paciente ID: ${cita.pacienteId}`;

  return {
    id: cita.id,
    pacienteId: cita.pacienteId,
    medicoId: cita.medicoId,
    fecha: cita.fecha,
    hora: cita.hora,
    estado: cita.estado,
    pacienteNombre: nombrePaciente,
    motivo: "", // Tu backend no lo envía en esta lista, lo dejamos vacío o lo agregas si existe
    urgencia: "",
  };
};

const convertirDatos = (datos: Partial<CrearCitaDTO>): CitaApiUpdate => ({
  ...(datos.pacienteId !== undefined && { pacienteId: datos.pacienteId }),
  ...(datos.medicoId !== undefined && { medicoId: datos.medicoId }),
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

  // 3. Método de paginación con los nombres de parámetros correctos
  getPaginadas: async (params: {
    pagina: number;
    estado: string;
    signal?: AbortSignal;
  }): Promise<RespuestaPaginada<Cita>> => {
    const queryParams: Record<string, string | number> = {
      pagina: params.pagina,
      limite: 10,
    };

    // Enviamos el estado solo si no es "Todos"
    if (params.estado !== "Todos") {
      queryParams.estado = params.estado;
      // NOTA: Si tu backend no filtra, prueba cambiar 'estado' por 'status' o 'estado' en minúsculas
    }

    console.log("📤 Enviando petición con params:", queryParams);

    const respuesta = await api.get<RespuestaPaginada<CitaApi>>("/citas", {
      params: queryParams,
      signal: params.signal,
    });

    return {
      data: respuesta.data.data.map(convertirCita),
      total: respuesta.data.total,
      pagina: respuesta.data.pagina,
      totalPaginas: respuesta.data.totalPaginas,
    };
  },
};
