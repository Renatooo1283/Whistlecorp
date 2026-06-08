import { z } from "zod";

export const tipoNecesidadOptions = [
  "desarrollo",
  "automatizacion",
  "infraestructura",
  "consultoria",
  "no_estoy_seguro",
] as const;

export const urgenciaOptions = [
  "lo_antes_posible",
  "1_3_meses",
  "explorando",
] as const;

export const presupuestoOptions = [
  "menos_1k",
  "1k_5k",
  "5k_15k",
  "no_definido",
] as const;

export const diagnosticSchema = z.object({
  nombre: z.string().min(2, "Ingresa tu nombre (mínimo 2 caracteres)."),
  empresa: z.string().min(2, "Ingresa el nombre de tu empresa."),
  whatsapp: z
    .string()
    .regex(
      /^\+?[0-9\s\-()]{7,}$/,
      "Ingresa un número válido. Puedes usar +, espacios, guiones o paréntesis."
    ),
  correo: z.string().email("Ingresa un correo electrónico válido."),
  tipoNecesidad: z.enum(tipoNecesidadOptions, {
    message: "Selecciona el tipo de necesidad.",
  }),
  procesoActual: z
    .string()
    .min(10, "Cuéntanos un poco más (mínimo 10 caracteres)."),
  problema: z
    .string()
    .min(10, "Describe el problema con un poco más de detalle."),
  urgencia: z.enum(urgenciaOptions, {
    message: "Selecciona el nivel de urgencia.",
  }),
  presupuesto: z.enum(presupuestoOptions, {
    message: "Selecciona un rango de presupuesto.",
  }),
  mensaje: z.string().optional(),
});

export type DiagnosticData = z.infer<typeof diagnosticSchema>;

export const stepFields: Record<1 | 2 | 3, (keyof DiagnosticData)[]> = {
  1: ["nombre", "empresa", "whatsapp", "correo"],
  2: ["tipoNecesidad", "procesoActual", "problema"],
  3: ["urgencia", "presupuesto", "mensaje"],
};
