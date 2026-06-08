import type {
  DiagnosticData,
} from "./schema";

export const tipoNecesidadLabels: Record<DiagnosticData["tipoNecesidad"], string> = {
  desarrollo: "Desarrollo de software",
  automatizacion: "Automatización de procesos",
  infraestructura: "Infraestructura y nube",
  consultoria: "Consultoría tecnológica",
  no_estoy_seguro: "No estoy seguro",
};

export const urgenciaLabels: Record<DiagnosticData["urgencia"], string> = {
  lo_antes_posible: "Lo antes posible",
  "1_3_meses": "En 1 a 3 meses",
  explorando: "Solo estoy explorando",
};

export const presupuestoLabels: Record<DiagnosticData["presupuesto"], string> = {
  menos_1k: "Menos de $1.000",
  "1k_5k": "$1.000 a $5.000",
  "5k_15k": "$5.000 a $15.000",
  no_definido: "Aún no definido",
};
