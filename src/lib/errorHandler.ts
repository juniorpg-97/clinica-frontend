import axios from "axios";

export function extraerMensajeError(err: unknown): string {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.message ?? "Error del servidor";
  }
  if (err instanceof Error) return err.message;
  return "Error inesperado";
}
