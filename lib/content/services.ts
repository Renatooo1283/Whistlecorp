import type { LucideIcon } from "lucide-react";
import {
  Cloud,
  Code2,
  Lightbulb,
  Workflow,
} from "lucide-react";

export type ServiceSummary = {
  slug: string;
  icon: LucideIcon;
  title: string;
  description: string;
  bullets: string[];
  href: string;
};

export const servicesIndex = {
  eyebrow: "Soluciones Tecnológicas Integrales",
  title: "Cuatro formas de transformar tu operación con tecnología.",
  subtitle:
    "Cada línea de servicio resuelve un tipo distinto de problema. Podemos trabajar una solución puntual o combinar varias capacidades según lo que tu empresa necesita.",
  items: [
    {
      slug: "desarrollo-software",
      icon: Code2,
      title: "Desarrollo y personalización de software",
      description:
        "Creamos sistemas web, aplicaciones internas, dashboards, portales de clientes y paneles administrativos adaptados a la forma real en que opera tu empresa.",
      bullets: [
        "Sistemas con login, roles y permisos.",
        "Paneles administrativos y dashboards.",
        "Portales internos o para clientes.",
      ],
      href: "/servicios/desarrollo-software",
    },
    {
      slug: "automatizacion",
      icon: Workflow,
      title: "Automatización de procesos",
      description:
        "Diseñamos flujos que conectan formularios, bases de datos, correos, WhatsApp y herramientas externas para reducir tareas manuales.",
      bullets: [
        "Formularios inteligentes.",
        "Notificaciones automáticas.",
        "Conexión con Make, n8n, Supabase o Google Sheets.",
      ],
      href: "/servicios/automatizacion",
    },
    {
      slug: "infraestructura-cloud",
      icon: Cloud,
      title: "Soporte e infraestructura informática",
      description:
        "Ayudamos a mantener sistemas disponibles, seguros y mejor preparados para crecer.",
      bullets: [
        "Backups y recuperación.",
        "Migración cloud.",
        "Monitoreo y soporte.",
      ],
      href: "/servicios/infraestructura-cloud",
    },
    {
      slug: "consultoria",
      icon: Lightbulb,
      title: "Consultoría y gestión tecnológica",
      description:
        "Te ayudamos a decidir qué construir, qué automatizar y qué herramientas usar antes de invertir tiempo y dinero en una solución.",
      bullets: [
        "Diagnóstico digital.",
        "Roadmap tecnológico.",
        "Levantamiento de procesos.",
      ],
      href: "/servicios/consultoria",
    },
  ] satisfies ServiceSummary[],
  closingTitle: "¿No estás seguro de qué servicio necesitas?",
  closingSubtitle: "Empieza por un diagnóstico inicial.",
};

export type ServiceDetail = {
  slug: string;
  breadcrumbLabel: string;
  title: string;
  subtitle: string;
  forWhat: string;
  whatWeDoTitle: string;
  whatWeDo: string[];
  toolsTitle?: string;
  tools?: string[];
  howTitle: string;
  how: string;
  image: { src: string; alt: string };
};

export const serviceDetails: Record<string, ServiceDetail> = {
  "desarrollo-software": {
    slug: "desarrollo-software",
    breadcrumbLabel: "Desarrollo y personalización de software",
    title: "Software hecho a la medida de tu operación real.",
    subtitle:
      "Construimos sistemas web, aplicaciones internas, dashboards y portales diseñados para resolver problemas concretos, no para parecerse a otra herramienta genérica del mercado.",
    forWhat:
      "Cuando una hoja de cálculo se queda corta, cuando ninguna herramienta se adapta a tu forma de trabajar o cuando necesitas un sistema propio para tu equipo, tus clientes o tus operaciones internas.",
    whatWeDoTitle: "Qué construimos",
    whatWeDo: [
      "Sistemas web a medida.",
      "Aplicaciones internas.",
      "Dashboards.",
      "Portales de clientes.",
      "Paneles administrativos.",
      "Soluciones con login, roles y permisos.",
    ],
    howTitle: "Cómo lo hacemos",
    how: "Trabajamos con tecnologías modernas, entregas iterativas y validaciones frecuentes. El objetivo es que veas avances reales durante el proceso y no solamente al final del proyecto.",
    image: {
      src: "/imagenes/compagnons-Im_cQ6hQo10-unsplash.jpg",
      alt: "Equipo de desarrolladores trabajando en código frente a múltiples monitores",
    },
  },
  automatizacion: {
    slug: "automatizacion",
    breadcrumbLabel: "Automatización",
    title:
      "Automatizamos tareas repetitivas para que tu equipo se enfoque en lo importante.",
    subtitle:
      "Conectamos los sistemas que ya usas y diseñamos flujos digitales que reducen trabajo manual, errores y pérdida de información.",
    forWhat:
      "Cuando tu equipo copia datos entre herramientas, cuando los leads se pierden entre correos y WhatsApp, cuando los reportes manuales consumen demasiado tiempo o cuando una solicitud necesita pasar por varios responsables sin trazabilidad.",
    whatWeDoTitle: "Qué automatizamos",
    whatWeDo: [
      "Formularios inteligentes.",
      "Flujos automáticos.",
      "Notificaciones por correo, WhatsApp o herramientas internas.",
      "Registro automático de leads.",
      "Conexión con herramientas externas.",
      "Reportes programados.",
      "Flujos de aprobación.",
    ],
    howTitle: "Cómo lo hacemos",
    how: "Levantamos el proceso actual, identificamos los pasos repetitivos y empezamos por la automatización que pueda generar mayor impacto en menos tiempo.",
    image: {
      src: "/imagenes/Imagen (5).png",
      alt: "Workflow de automatización de procesos",
    },
  },
  "infraestructura-cloud": {
    slug: "infraestructura-cloud",
    breadcrumbLabel: "Soporte e infraestructura informática",
    title: "Infraestructura confiable para que tu operación no se detenga.",
    subtitle:
      "Migramos, monitoreamos y mantenemos sistemas tecnológicos con un enfoque práctico en disponibilidad, seguridad y continuidad operativa.",
    forWhat:
      "Cuando tus sistemas presentan fallas frecuentes, cuando no tienes respaldos confiables, cuando quieres migrar a la nube o cuando necesitas soporte técnico para mantener la operación funcionando.",
    whatWeDoTitle: "Qué hacemos",
    whatWeDo: [
      "Soporte tecnológico.",
      "Backups y recuperación.",
      "Monitoreo.",
      "Migración a la nube.",
      "Seguridad básica.",
      "Continuidad operativa.",
    ],
    howTitle: "Cómo lo hacemos",
    how: "Empezamos por entender qué sistemas tienes hoy, cuáles son críticos para el negocio y qué riesgos necesitan atención inmediata. Luego diseñamos un plan por fases, evitando cambios bruscos que puedan afectar la operación.",
    image: {
      src: "/imagenes/Imagen (4).png",
      alt: "Infraestructura cloud y conectividad",
    },
  },
  consultoria: {
    slug: "consultoria",
    breadcrumbLabel: "Consultoría y gestión tecnológica",
    title: "Antes de construir, decidimos juntos qué vale la pena construir.",
    subtitle:
      "Te acompañamos a tomar decisiones tecnológicas con claridad, priorizando soluciones útiles y evitando inversiones innecesarias.",
    forWhat:
      "Cuando tienes muchas ideas y poco tiempo, cuando estás evaluando una herramienta nueva, cuando quieres modernizar la operación pero no sabes por dónde empezar o cuando necesitas una mirada técnica antes de invertir.",
    whatWeDoTitle: "Qué hacemos",
    whatWeDo: [
      "Diagnóstico digital.",
      "Roadmap tecnológico.",
      "Levantamiento de procesos.",
      "Selección de herramientas.",
      "Mejora operativa.",
    ],
    howTitle: "Cómo lo hacemos",
    how: "Trabajamos en sesiones concretas con tu equipo para entender la operación, identificar oportunidades y entregar recomendaciones accionables con próximos pasos claros.",
    image: {
      src: "/imagenes/Imagen (7).png",
      alt: "Equipo de consultoría tecnológica",
    },
  },
};
