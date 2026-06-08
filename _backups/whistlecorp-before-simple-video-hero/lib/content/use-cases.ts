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

export type UseCaseGroup = {
  eyebrow: string;
  title: string;
  description: string;
  items: UseCase[];
};

export const useCasesPage = {
  eyebrow: "Casos de uso",
  title: "Ejemplos reales de problemas que resolvemos con software.",
  subtitle:
    "No son clientes ni métricas inventadas. Son patrones que vemos en empresas que crecieron rápido y no tuvieron tiempo de ordenar la operación. Agrupados por el tipo de problema que resuelven.",
  groups: [
    {
      eyebrow: "01",
      title: "Captar y ordenar solicitudes",
      description:
        "Cuando el equipo recibe pedidos por canales dispersos y se pierde información en el camino.",
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
          icon: ClipboardList,
          title: "Control de solicitudes internas",
          description:
            "Flujo digital para solicitudes de compras, soporte, permisos o aprobaciones internas.",
          includes:
            "Formularios, estados, asignaciones, historial y trazabilidad.",
        },
      ],
    },
    {
      eyebrow: "02",
      title: "Dar seguimiento",
      description:
        "Cuando se necesita saber en qué estado quedó cada pedido, cita o cliente sin depender de la memoria de alguien.",
      items: [
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
      ],
    },
    {
      eyebrow: "03",
      title: "Visualizar información",
      description:
        "Cuando los datos existen pero llegan tarde, dispersos o requieren horas de trabajo manual para presentarlos.",
      items: [
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
          includes:
            "Conexión a fuentes de datos, plantillas y envío programado.",
        },
      ],
    },
    {
      eyebrow: "04",
      title: "Conectar herramientas",
      description:
        "Cuando los sistemas que ya usas no se hablan entre sí y alguien tiene que copiar datos manualmente.",
      items: [
        {
          icon: Link2,
          title: "Integración entre sistemas",
          description:
            "Sincronización automática entre herramientas que la empresa ya usa.",
          includes: "Mapeo de datos, conectores, validaciones y alertas.",
        },
      ],
    },
  ] satisfies UseCaseGroup[],
  ctaTitle: "¿Reconoces tu caso en alguno de estos ejemplos?",
  ctaSubtitle:
    "Adaptamos cada solución al contexto real de tu empresa, su equipo y sus herramientas actuales.",
};
