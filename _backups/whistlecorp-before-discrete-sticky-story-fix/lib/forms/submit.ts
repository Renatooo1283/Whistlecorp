import type { DiagnosticData } from "./schema";

export type SubmitResult = { ok: true } | { ok: false; error: string };

/**
 * Único punto de integración del formulario de diagnóstico.
 *
 * En esta fase: persiste la última solicitud en sessionStorage para que
 * /gracias pueda construir el mensaje de WhatsApp prellenado.
 *
 * Para conectar el backend más adelante, reemplazar el cuerpo de esta
 * función con una de las opciones de abajo. La UI no necesita cambios.
 *
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ Opción A — Supabase                                              │
 * │ import { createClient } from "@supabase/supabase-js";            │
 * │ const supabase = createClient(URL, KEY);                         │
 * │ const { error } = await supabase                                 │
 * │   .from("diagnostics").insert(data);                             │
 * │ if (error) return { ok: false, error: error.message };           │
 * └─────────────────────────────────────────────────────────────────┘
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ Opción B — Webhook (Make / n8n / Google Apps Script)             │
 * │ const url = process.env.NEXT_PUBLIC_DIAGNOSTIC_WEBHOOK_URL;      │
 * │ const res = await fetch(url, {                                   │
 * │   method: "POST",                                                │
 * │   headers: { "Content-Type": "application/json" },               │
 * │   body: JSON.stringify(data),                                    │
 * │ });                                                              │
 * │ if (!res.ok) return { ok: false, error: "Error en webhook" };    │
 * └─────────────────────────────────────────────────────────────────┘
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ Opción C — Envío de correo (vía API route /api/contact)          │
 * │ const res = await fetch("/api/contact", {                        │
 * │   method: "POST",                                                │
 * │   body: JSON.stringify(data),                                    │
 * │ });                                                              │
 * │ if (!res.ok) return { ok: false, error: "Error al enviar" };     │
 * └─────────────────────────────────────────────────────────────────┘
 */
export async function submitDiagnostic(
  data: DiagnosticData
): Promise<SubmitResult> {
  try {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(
        "diagnostic.lastSubmission",
        JSON.stringify(data)
      );
    }

    if (process.env.NODE_ENV !== "production") {
      console.log("[submitDiagnostic]", data);
    }

    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Error desconocido",
    };
  }
}

export function getLastSubmission(): DiagnosticData | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem("diagnostic.lastSubmission");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DiagnosticData;
  } catch {
    return null;
  }
}
