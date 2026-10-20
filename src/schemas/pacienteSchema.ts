// src/schemas/pacienteSchema.ts
import { z } from "zod";

export const pacienteSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  apellido: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  email: z.string().email("Ingresa un correo electrónico válido"),
  estado: z.enum(["activo", "inactivo", "en_espera"]).default("activo"),
});

export type PacienteFormData = z.infer<typeof pacienteSchema>;
