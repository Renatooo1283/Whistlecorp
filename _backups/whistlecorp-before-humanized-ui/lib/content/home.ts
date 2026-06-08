import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  BarChart3,
  Cloud,
  Code2,
  FileSpreadsheet,
  GitBranch,
  LifeBuoy,
  Lightbulb,
  ListChecks,
  Map,
  MessageSquare,
  Send,
  Server,
  Sparkles,
  Workflow,
  Wrench,
} from "lucide-react";

export const hero = {
  eyebrow: "Tu aliado estratégico en innovación digital",
  title:
    "Convertimos procesos manuales en soluciones digitales que impulsan tu operación.",
  subtitle:
    "Conversemos sobre tu próxima solución digital. Desarrollamos software a medida, automatizamos tareas repetitivas y fortalecemos tu infraestructura tecnológica para que tu empresa trabaje con más orden, control y eficiencia.",
  primaryCta: { label: "Solicitar diagnóstico", href: "/contacto" },
  secondaryCta: { label: "Contáctanos", href: "/contacto" },
  microcopy: "Respondemos en menos de 24 horas — info@whistlecorp.com",
};

export const trustStrip = {
  title: "Diseñamos soluciones compatibles con tecnologías modernas como…",
  items: [
    "Next.js",
    "Node.js",
    "PostgreSQL",
    "Supabase",
    "Google Cloud",
    "AWS",
    "Make",
    "n8n",
  ],
};

export type Problem = {
  icon: LucideIcon;
  title: string;
};

export const problems = {
  title:
    "Cuando los procesos dependen demasiado de tareas manuales, el crecimiento se vuelve más difícil.",
  items: [
    {
      icon: FileSpreadsheet,
      title: "Información dispersa entre Excel, WhatsApp y correos.",
    },
    {
      icon: BarChart3,
      title: "Reportes manuales que consumen tiempo y llegan tarde.",
    },
    {
      icon: AlertCircle,
      title: "Sistemas inestables, desactualizados o difíciles de mantener.",
    },
    {
      icon: ListChecks,
      title:
        "Solicitudes sin seguimiento, responsables claros ni trazabilidad.",
    },
  ] satisfies Problem[],
};

export type SolutionSummary = {
  icon: LucideIcon;
  title: string;
  description: string;
  bullets: string[];
  href: string;
};

export const solutions = {
  eyebrow: "Soluciones Tecnológicas Integrales",
  title:
    "Una experiencia integral para ordenar, automatizar y escalar tu operación.",
  items: [
    {
      icon: Code2,
      title: "Desarrollo y personalización de software",
      description:
        "Soluciones adaptadas a tus procesos, objetivos y desafíos específicos. Sistemas, aplicaciones web y móviles, y bases de datos optimizadas con enfoque ágil y tecnologías contemporáneas.",
      bullets: [
        "Herramientas internas y plataformas en nube",
        "Aplicaciones empresariales escalables",
        "Productos seguros y de fácil mantenimiento",
      ],
      href: "/servicios/desarrollo-software",
    },
    {
      icon: Workflow,
      title: "Automatización de procesos",
      description:
        "Flujos digitales que conectan formularios, bases de datos, correos y herramientas externas para reducir trabajo manual.",
      bullets: [
        "Formularios inteligentes",
        "Notificaciones automáticas",
        "Conexión con Make, n8n, Supabase o Sheets",
      ],
      href: "/servicios/automatizacion",
    },
    {
      icon: Cloud,
      title: "Soporte e infraestructura informática",
      description:
        "Soporte técnico integral, mantenimiento preventivo y correctivo, recuperación ante desastres y migraciones a nube. Para que tu operación no se detenga.",
      bullets: [
        "Soluciones de respaldo y recuperación",
        "Monitoreo y seguridad de datos",
        "Migración a la nube",
      ],
      href: "/servicios/infraestructura-cloud",
    },
    {
      icon: Lightbulb,
      title: "Consultoría y gestión tecnológica",
      description:
        "Acompañamiento en transformación digital. Análisis de infraestructura, identificación de mejoras, gestión de sistemas de comunicación, redes y servicios en nube.",
      bullets: [
        "Optimización de recursos y reducción de costos",
        "Fortalecimiento de seguridad informática",
        "Asesoría en planificación e integración",
      ],
      href: "/servicios/consultoria",
    },
  ] satisfies SolutionSummary[],
};

export const philosophy = {
  eyebrow: "Nuestra filosofía",
  title:
    "La tecnología debe adaptarse a las personas, no al revés.",
  body: "En WhistleCorp impulsamos la transformación digital de las empresas con soluciones a medida que combinan innovación, eficiencia y seguridad. No solo implementamos tecnología: creamos experiencias digitales que transforman la manera en que las empresas operan, se comunican y crecen.",
  body2:
    "Acompañamos a nuestros clientes en todo el ciclo de vida de la solución, desde la planificación y el diseño hasta la implementación, el soporte y la mejora continua.",
  pillars: [
    {
      label: "Innovación",
      description: "Una buena idea con la tecnología adecuada para hacerla realidad.",
    },
    {
      label: "Eficiencia",
      description: "Procesos ordenados, menos tareas manuales, decisiones más rápidas.",
    },
    {
      label: "Seguridad",
      description: "Bases técnicas confiables, escalables y de fácil mantenimiento.",
    },
    {
      label: "Resultados medibles",
      description: "Confianza, transparencia y resultados verificables en cada entrega.",
    },
  ],
};

export type Automation = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const automations = {
  title: "Pequeñas automatizaciones que eliminan trabajo repetitivo.",
  subtitle:
    "Soluciones puntuales que adaptamos al contexto de tu empresa y entregamos en pocas semanas.",
  items: [
    {
      icon: Send,
      title: "Formularios inteligentes",
      description:
        "Captura estructurada con validación, ramificación y clasificación automática.",
    },
    {
      icon: MessageSquare,
      title: "Registro automático de leads",
      description:
        "Cada contacto entra a tu base de datos o CRM sin intervención manual.",
    },
    {
      icon: AlertCircle,
      title: "Notificaciones por correo o WhatsApp",
      description:
        "Avisos automáticos cuando ocurre un evento importante en tu operación.",
    },
    {
      icon: GitBranch,
      title: "Flujos conectados",
      description:
        "Integraciones con Google Sheets, Supabase, Make o n8n según tu stack.",
    },
  ] satisfies Automation[],
  cta: { label: "Ver casos de uso", href: "/casos-de-uso" },
};

export type ProcessStep = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const process = {
  title: "Cómo trabajamos",
  subtitle:
    "Un proceso claro, con etapas definidas y entregas frecuentes para que veas avances reales.",
  steps: [
    {
      icon: Lightbulb,
      title: "Diagnóstico",
      description:
        "Entendemos tu operación, identificamos cuellos de botella y oportunidades.",
    },
    {
      icon: ListChecks,
      title: "Diseño de solución",
      description:
        "Definimos alcance, prioridades y arquitectura técnica del proyecto.",
    },
    {
      icon: Code2,
      title: "Desarrollo",
      description:
        "Construimos con entregas iterativas y validaciones constantes con tu equipo.",
    },
    {
      icon: Workflow,
      title: "Automatización",
      description:
        "Conectamos sistemas y diseñamos flujos para reducir trabajo manual.",
    },
    {
      icon: Server,
      title: "Implementación",
      description:
        "Despliegue controlado, migración de datos y capacitación al equipo.",
    },
    {
      icon: Wrench,
      title: "Soporte",
      description:
        "Acompañamiento continuo, medición de resultados y mejoras iterativas.",
    },
  ] satisfies ProcessStep[],
};

export type WhyItem = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const whyUs = {
  eyebrow: "Por qué trabajar con WhistleCorp",
  title: "Una forma de trabajar pensada para empresas que necesitan resultados, no promesas.",
  items: [
    {
      icon: Lightbulb,
      title: "Diagnóstico antes de construir",
      description:
        "Empezamos por entender tu operación. Si una solución no aporta valor real, no la construimos.",
    },
    {
      icon: Map,
      title: "Entregas por fases",
      description:
        "Avances iterativos y validados con tu equipo, en lugar de proyectos largos sin resultados visibles.",
    },
    {
      icon: Sparkles,
      title: "Automatizaciones útiles, sin complejidad innecesaria",
      description:
        "Soluciones sostenibles que tu equipo puede operar, mantener y escalar con el tiempo.",
    },
    {
      icon: LifeBuoy,
      title: "Soporte posterior al lanzamiento",
      description:
        "Acompañamos la operación después del go-live con monitoreo, ajustes y mejoras continuas.",
    },
  ] satisfies WhyItem[],
};

export const homeCta = {
  title: "¿Tienes un proceso que quieras digitalizar o automatizar?",
  subtitle:
    "Cuéntanos cómo trabaja tu empresa hoy y te ayudamos a identificar una solución realista, útil y escalable.",
  primary: { label: "Solicitar diagnóstico", href: "/contacto" },
};
