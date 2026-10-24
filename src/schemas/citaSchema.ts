import { z } from "zod";

export const citaSchema = z.object({
  pacienteId: z.string().min(1, "Debes seleccionar un paciente"),

  medicoId: z.string().min(1, "Debes seleccionar un médico"),

  fecha: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha debe tener el formato YYYY-MM-DD")
    .refine((valor) => {
      const [anio, mes, dia] = valor.split("-").map(Number);
      const fechaIngresada = new Date(anio, mes - 1, dia);

      return (
        fechaIngresada.getFullYear() === anio &&
        fechaIngresada.getMonth() === mes - 1 &&
        fechaIngresada.getDate() === dia
      );
    }, "La fecha ingresada no es válida")
    .refine((valor) => {
      const hoy = new Date();
      const hoyISO = [
        hoy.getFullYear(),
        String(hoy.getMonth() + 1).padStart(2, "0"),
        String(hoy.getDate()).padStart(2, "0"),
      ].join("-");

      return valor >= hoyISO;
    }, "No puedes agendar una cita en una fecha pasada"),

  hora: z
    .string()
    .regex(
      /^([01]\d|2[0-3]):[0-5]\d$/,
      "La hora debe estar entre 00:00 y 23:59",
    ),

  motivo: z
    .string()
    .trim()
    .min(10, "El motivo debe tener al menos 10 caracteres")
    .max(500, "El motivo no puede superar los 500 caracteres"),

  urgencia: z.enum(["baja", "media", "alta", "critica"]),
});

export type CitaFormData = z.infer<typeof citaSchema>;
