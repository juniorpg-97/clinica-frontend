import { api } from "../lib/axios"; // O donde tengas configurado Axios

export const pacientesService = {
  getAll: async (query?: string) => {
    const respuesta = await api.get("/pacientes", {
      params: query ? { search: query } : {},
    });
    // Axios ya guarda todo en respuesta.data, así que devolvemos eso
    return respuesta.data;
  },
};
