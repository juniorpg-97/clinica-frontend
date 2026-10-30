import { z } from "zod";

export const perfilSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().email("Ingresa un email válido"),
  telefono: z
    .string()
    .optional()
    .refine((val) => !val || /^\d{8,15}$/.test(val), {
      message: "Ingresa un teléfono válido (8-15 dígitos)",
    }),
});

export type PerfilFormData = z.infer<typeof perfilSchema>;
