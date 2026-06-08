import type { DiagnosticData } from "./schema";
import {
  presupuestoLabels,
  tipoNecesidadLabels,
  urgenciaLabels,
} from "./labels";

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "593999420013";

export function buildWhatsAppMessage(data: DiagnosticData): string {
  const lines = [
    `Hola, soy ${data.nombre} de ${data.empresa}.`,
    "",
    "Acabo de enviar el formulario de diagnóstico desde whistlecorp.com.",
    "",
    `Tipo de necesidad: ${tipoNecesidadLabels[data.tipoNecesidad]}`,
    `Urgencia: ${urgenciaLabels[data.urgencia]}`,
    `Presupuesto aproximado: ${presupuestoLabels[data.presupuesto]}`,
    "",
    "Cómo manejo el proceso hoy:",
    data.procesoActual,
    "",
    "Principal problema:",
    data.problema,
  ];

  if (data.mensaje && data.mensaje.trim().length > 0) {
    lines.push("", "Comentario adicional:", data.mensaje.trim());
  }

  lines.push("", "Quedo atento a su respuesta. Gracias.");

  return lines.join("\n");
}

export function buildWhatsAppUrl(data: DiagnosticData): string {
  const text = encodeURIComponent(buildWhatsAppMessage(data));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

export function buildPlainWhatsAppUrl(text?: string): string {
  if (!text) return `https://wa.me/${WHATSAPP_NUMBER}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
