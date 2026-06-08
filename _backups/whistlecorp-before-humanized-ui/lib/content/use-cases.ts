import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  CalendarClock,
  ClipboardList,
  FileText,
  Link2,
  Send,
  UserCheck,
} from "lucide-react";

export type UseCase = {
  icon: LucideIcon;
  title: string;
  description: string;
  includes: string;
};

export const useCasesPage = {
  eyebrow: "Casos de uso",
  title: "Ejemplos de soluciones que podemos construir para tu empresa.",
  subtitle:
    "No son clientes ni métricas inventadas. Son patrones reales de problemas que muchas empresas enfrentan y que pueden resolverse con software, automatización o integración.",
  items: [
    {
      icon: Send,
      title: "Formulario inteligente de diagnóstico",
      description:
        "Captura información estructurada, clasifica solicitudes y evita que tu equipo reciba mensajes incompletos.",
      includes:
        "Validación, preguntas condicionales, envío automático y notificación al equipo.",
    },
    {
      icon: CalendarClock,
      title: "Sistema de reservas",
      description:
        "Plataforma para gestionar citas, servicios, disponibilidad o recursos.",
      includes:
        "Calendario, confirmaciones automáticas, recordatorios y panel administrativo.",
    },
    {
      icon: UserCheck,
      title: "Portal de clientes",
      description:
        "Espacio privado donde cada cliente puede consultar información, subir documentos o hacer solicitudes.",
      includes: "Login, roles, historial y descarga de documentos.",
    },
    {
      icon: BarChart3,
      title: "Dashboard administrativo",
      description:
        "Vista centralizada de indicadores, solicitudes, estados o información crítica del negocio.",
      includes: "Gráficos, filtros, exportación y control de accesos.",
    },
    {
      icon: FileText,
      title: "Automatización de reportes",
      description:
        "Generación y envío automático de reportes a las personas correctas.",
      includes: "Conexión a fuentes de datos, plantillas y envío programado.",
    },
    {
      icon: ClipboardList,
      title: "Control de solicitudes internas",
      description:
        "Flujo digital para solicitudes de compras, soporte, permisos o aprobaciones internas.",
      includes:
        "Formularios, estados, asignaciones, historial y trazabilidad.",
    },
    {
      icon: Link2,
      title: "Integración entre sistemas",
      description:
        "Sincronización automática entre herramientas que la empresa ya usa.",
      includes: "Mapeo de datos, conectores, validaciones y alertas.",
    },
  ] satisfies UseCase[],
  ctaTitle: "¿Reconoces tu caso en alguno de estos ejemplos?",
  ctaSubtitle:
    "Adaptamos cada solución al contexto real de tu empresa, su equipo y sus herramientas actuales.",
};
