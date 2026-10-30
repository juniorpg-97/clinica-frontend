// src/lib/formato.ts

export function formatearFecha(fechaISO: string): string {
  if (!fechaISO) return "Sin fecha";
  try {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return fechaISO;
  }
}

export function formatearHora(horaISO: string): string {
  if (!horaISO) return "Sin hora";
  try {
    const fecha = new Date(horaISO);
    if (!isNaN(fecha.getTime())) {
      return fecha.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return horaISO.slice(0, 5);
  } catch {
    return horaISO;
  }
}
