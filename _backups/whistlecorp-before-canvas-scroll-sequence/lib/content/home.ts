import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  BarChart3,
  Cloud,
  Code2,
  FileSpreadsheet,
  GitBranch,
  Lightbulb,
  ListChecks,
  MessageSquare,
  Send,
  Server,
  Workflow,
  Wrench,
} from "lucide-react";

export const hero = {
  eyebrow: "Software · Automatización · Cloud",
  title:
    "Si tu equipo todavía depende de Excel, WhatsApp y correos para operar, podemos ayudarte a ordenarlo.",
  subtitle:
    "Diseñamos sistemas a medida, automatizamos tareas que hoy alguien hace a mano y mantenemos la infraestructura que sostiene tu operación. Sin proyectos largos, sin promesas grandes.",
  primaryCta: { label: "Solicitar diagnóstico", href: "/contacto" },
  secondaryCta: { label: "Ver servicios", href: "/servicios" },
  microcopy: "Respondemos en menos de 24 horas — info@whistlecorp.com",
};

export const trustStrip = {
  title: "Trabajamos con tecnologías comunes y bien soportadas",
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

export const editorialQuote = {
  eyebrow: "El problema",
  body: "No necesitas más herramientas. Necesitas que las herramientas que ya usas trabajen mejor juntas.",
  body2:
    "La mayoría de empresas no fallan por falta de tecnología. Fallan porque la información vive en lugares distintos, las decisiones llegan tarde y cada persona del equipo repite tareas que una máquina podría resolver una sola vez.",
};

export type Problem = {
  icon: LucideIcon;
  title: string;
  example: string;
};

export const problems = {
  eyebrow: "Síntomas que reconocemos",
  title:
    "Si alguno de estos ejemplos te suena, no estás solo.",
  intro:
    "Son patrones que vemos en empresas que arrancaron rápido y crecieron sin tiempo para ordenar la operación. No son problemas de personas: son problemas de proceso.",
  items: [
    {
      icon: FileSpreadsheet,
      title: "Excel para todo",
      example:
        "Inventario en una hoja, clientes en otra, pedidos en un tercer archivo. Si alguien edita la versión vieja, se pierde el cambio.",
    },
    {
      icon: MessageSquare,
      title: "WhatsApp como CRM",
      example:
        "Los clientes escriben por WhatsApp y el seguimiento depende de que la persona que lo atendió se acuerde de hacerlo.",
    },
    {
      icon: BarChart3,
      title: "Reportes hechos a mano",
      example:
        "Cada lunes alguien dedica 2 horas a copiar números de un sistema a otro para armar un reporte que llega tarde.",
    },
    {
      icon: AlertCircle,
      title: "Solicitudes sin estado",
      example:
        "Una petición llega por correo, alguien la pasa a un compañero, y dos semanas después nadie sabe en qué quedó.",
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
  eyebrow: "Lo que hacemos",
  title:
    "Cuatro líneas de servicio. Las combinamos o trabajamos solo la que necesitas.",
  items: [
    {
      icon: Code2,
      title: "Desarrollo y personalización de software",
      description:
        "Construimos sistemas que se adaptan a cómo trabaja tu empresa hoy. Pequeños al inicio, útiles desde el primer día y preparados para crecer.",
      bullets: [
        "Sistemas internos y portales para clientes",
        "Paneles administrativos y dashboards",
        "Roles, permisos y trazabilidad",
      ],
      href: "/servicios/desarrollo-software",
    },
    {
      icon: Workflow,
      title: "Automatización de procesos",
      description:
        "Tomamos tareas que hoy alguien hace a mano y las convertimos en flujos que se ejecutan solos. WhatsApp, Sheets, correo, base de datos: lo conectamos.",
      bullets: [
        "Formularios con validación y ramificación",
        "Notificaciones por correo o WhatsApp",
        "Conexión con Make, n8n, Supabase",
      ],
      href: "/servicios/automatizacion",
    },
    {
      icon: Cloud,
      title: "Soporte e infraestructura informática",
      description:
        "Acompañamos la operación después del lanzamiento: monitoreo, backups, migraciones y resolución de incidentes cuando algo se cae.",
      bullets: [
        "Soporte técnico continuo",
        "Backups y plan de recuperación",
        "Migración cloud por fases",
      ],
      href: "/servicios/infraestructura-cloud",
    },
    {
      icon: Lightbulb,
      title: "Consultoría y gestión tecnológica",
      description:
        "Antes de construir, te ayudamos a decidir qué construir. Diagnóstico, priorización y roadmap basado en lo que realmente mueve la operación.",
      bullets: [
        "Levantamiento de procesos",
        "Diagnóstico digital",
        "Selección de herramientas",
      ],
      href: "/servicios/consultoria",
    },
  ] satisfies SolutionSummary[],
};

export const howWeThink = {
  eyebrow: "Cómo pensamos",
  title:
    "No empezamos por la tecnología. Empezamos por entender cómo trabaja tu empresa.",
  body: "Antes de proponer una plataforma, revisamos qué tareas se repiten, dónde se pierde información y qué decisiones llegan tarde. A partir de eso diseñamos una solución simple, útil y sostenible.",
  body2:
    "Preferimos entregar algo pequeño que funcione esta semana antes que un proyecto grande que tarde seis meses en ver la luz. Si una solución no aporta valor verificable, no la construimos.",
  pillars: [
    {
      label: "01",
      title: "Escuchamos primero",
      description:
        "Una hora de conversación con el equipo que opera el proceso vale más que cualquier wireframe.",
    },
    {
      label: "02",
      title: "Alcance pequeño y claro",
      description:
        "Definimos un primer entregable corto, con un objetivo concreto que se pueda medir.",
    },
    {
      label: "03",
      title: "Iteramos con tu gente",
      description:
        "Validamos en cada entrega con quien va a usar el sistema, no solo con quien lo aprueba.",
    },
    {
      label: "04",
      title: "Acompañamos después",
      description:
        "El go-live es el inicio. Mantenemos, ajustamos y mejoramos sobre uso real.",
    },
  ],
};

export type Automation = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const automationStory = {
  eyebrow: "Un ejemplo concreto",
  title: "Así se ve un flujo manual antes de automatizarse.",
  steps: [
    "Un cliente escribe por WhatsApp.",
    "Alguien copia sus datos a un Excel.",
    "Otro envía un correo al área correspondiente.",
    "Después, nadie sabe en qué estado quedó.",
  ],
  closer: "Ese mismo flujo, conectado y automatizado, libera al equipo y deja registro de cada paso.",
  cta: { label: "Cómo lo abordamos", href: "/servicios/automatizacion" },
};

export const automations = {
  title: "Lo que sí se puede automatizar.",
  subtitle:
    "Cuatro ejemplos puntuales que entregamos en semanas, no en trimestres.",
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
    "Etapas claras, entregas frecuentes y validaciones constantes con tu equipo.",
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

export const finalCta = {
  eyebrow: "Conversemos",
  title: "Si reconociste tu operación en alguno de los ejemplos, escribinos.",
  body: "Una primera conversación de 30 minutos es suficiente para entender si tiene sentido seguir. Si no es lo que necesitas, te lo decimos.",
  email: "info@whistlecorp.com",
  emailLabel: "Escribinos directo",
  primary: { label: "Solicitar diagnóstico", href: "/contacto" },
  secondary: { label: "Ver casos de uso", href: "/casos-de-uso" },
};
