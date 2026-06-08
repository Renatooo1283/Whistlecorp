import type { LucideIcon } from "lucide-react";
import { Compass, Code2, Users, Target } from "lucide-react";

export type Differentiator = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const aboutPage = {
  eyebrow: "Nosotros",
  title: "Entendemos tecnología. También entendemos operación.",
  subtitle:
    "Somos un equipo técnico que trabaja con empresas pequeñas y medianas que quieren ordenar su operación sin parar la operación. Hablamos en código cuando hace falta y en castellano cuando hace más falta.",
  differentiatorsTitle: "Cómo nos diferenciamos",
  differentiators: [
    {
      icon: Compass,
      title: "Antes de construir, escuchamos",
      description:
        "Una hora con la persona que vive el proceso vale más que cualquier reunión de kickoff. Si no entendemos la operación real, no proponemos solución.",
    },
    {
      icon: Code2,
      title: "Soluciones pequeñas que funcionan",
      description:
        "Preferimos entregar algo útil en dos semanas a un sistema gigante en seis meses. Si no aporta valor verificable, no se construye.",
    },
    {
      icon: Users,
      title: "Validamos con quien usa, no solo con quien aprueba",
      description:
        "Iteramos con el equipo que opera el día a día. Es la única forma de evitar sistemas que en papel funcionan pero en la oficina no.",
    },
    {
      icon: Target,
      title: "Acompañamos después del go-live",
      description:
        "Mantenemos, ajustamos y mejoramos sobre uso real. El proyecto termina cuando deja de generar valor, no cuando se entrega.",
    },
  ] satisfies Differentiator[],
  howTitle: "Cómo trabajamos",
  howSteps: [
    "Una conversación corta para entender el contexto.",
    "Diagnóstico del proceso y propuesta acotada.",
    "Entrega por fases con validaciones constantes.",
    "Soporte y mejora continua después del lanzamiento.",
  ],
  valuesTitle: "Lo que valoramos",
  values: ["Confianza", "Transparencia", "Resultados"],
  ctaTitle: "Si lo anterior te suena, escribinos.",
  image: {
    src: "/imagenes/Imagen (2).png",
    alt: "Equipo de WhistleCorp en sesión de trabajo",
  },
};
