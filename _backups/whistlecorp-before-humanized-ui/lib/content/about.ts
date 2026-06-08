import type { LucideIcon } from "lucide-react";
import { Compass, Code2, Users, Target } from "lucide-react";

export type Differentiator = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const aboutPage = {
  eyebrow: "Nosotros",
  title: "Un equipo técnico que entiende de negocio.",
  subtitle:
    "En WhistleCorp contamos con varios años de experiencia impulsando la transformación digital de empresas de distintos sectores. Nuestro equipo multidisciplinario combina conocimiento técnico, visión estratégica y creatividad para ofrecer soluciones tecnológicas que realmente generan valor.",
  differentiatorsTitle: "Qué nos diferencia",
  differentiators: [
    {
      icon: Compass,
      title: "Enfoque consultivo",
      description:
        "Antes de proponer una solución, entendemos el problema. Nos especializamos en escuchar y traducir el contexto real del negocio.",
    },
    {
      icon: Code2,
      title: "Experiencia técnica real",
      description:
        "Trabajamos con tecnologías contemporáneas, enfoque ágil, control de versiones, entregas iterativas y documentación clara.",
    },
    {
      icon: Users,
      title: "Acompañamiento de ciclo completo",
      description:
        "Te acompañamos desde la planificación y el diseño hasta la implementación, el soporte y la mejora continua.",
    },
    {
      icon: Target,
      title: "Compromiso con el impacto",
      description:
        "Creamos experiencias digitales que transforman cómo las empresas operan, se comunican y crecen.",
    },
  ] satisfies Differentiator[],
  howTitle: "Cómo trabajamos",
  howSteps: [
    "Escuchamos primero el contexto real del negocio.",
    "Definimos un alcance corto, claro y medible.",
    "Iteramos con tu equipo en entregas frecuentes.",
    "Acompañamos con soporte y mejora continua después del lanzamiento.",
  ],
  valuesTitle: "Valores",
  values: ["Confianza", "Transparencia", "Resultados"],
  ctaTitle: "¿Trabajamos juntos?",
  image: {
    src: "/imagenes/Imagen (2).png",
    alt: "Equipo de WhistleCorp en sesión de trabajo",
  },
};
