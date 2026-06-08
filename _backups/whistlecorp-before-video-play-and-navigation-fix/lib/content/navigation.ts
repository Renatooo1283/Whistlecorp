export type NavLink = {
  label: string;
  href: string;
};

export type NavItem = NavLink & {
  children?: NavLink[];
};

export const navItems: NavItem[] = [
  { label: "Inicio", href: "/" },
  {
    label: "Servicios",
    href: "/servicios",
    children: [
      {
        label: "Desarrollo y personalización de software",
        href: "/servicios/desarrollo-software",
      },
      {
        label: "Automatización de procesos",
        href: "/servicios/automatizacion",
      },
      {
        label: "Soporte e infraestructura informática",
        href: "/servicios/infraestructura-cloud",
      },
      {
        label: "Consultoría y gestión tecnológica",
        href: "/servicios/consultoria",
      },
    ],
  },
  { label: "Automatización", href: "/servicios/automatizacion" },
  { label: "Casos de uso", href: "/casos-de-uso" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Contáctanos", href: "/contacto" },
];

export const footerLinks = {
  services: [
    {
      label: "Desarrollo y personalización de software",
      href: "/servicios/desarrollo-software",
    },
    { label: "Automatización de procesos", href: "/servicios/automatizacion" },
    {
      label: "Soporte e infraestructura informática",
      href: "/servicios/infraestructura-cloud",
    },
    {
      label: "Consultoría y gestión tecnológica",
      href: "/servicios/consultoria",
    },
  ],
  company: [
    { label: "Nosotros", href: "/nosotros" },
    { label: "Casos de uso", href: "/casos-de-uso" },
    { label: "Contáctanos", href: "/contacto" },
  ],
};

export const contactInfo = {
  email: "info@whistlecorp.com",
  phone: "+593 999 420 013",
  whatsappNumber:
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "593999420013",
  location: "Milagro, Ecuador",
  hours: "Lunes a viernes, 9:00 – 18:00",
};
