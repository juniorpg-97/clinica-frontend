import axios from "axios";

export function extraerMensajeError(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data: unknown = err.response?.data;
    if (data && typeof data === "object") {
      const obj = data as Record<string, unknown>;
      if (typeof obj.message === "string") return obj.message;
      if (typeof obj.error === "string") return obj.error;
    }
    return err.message || "Error inesperado";
  }
  if (err instanceof Error) return err.message;
  return "Error inesperado";
}
