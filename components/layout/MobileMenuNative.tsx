import Link from "next/link";
import { Menu } from "lucide-react";

const links: { label: string; href: string }[] = [
  { label: "Inicio", href: "/" },
  { label: "Servicios", href: "/servicios" },
  { label: "Desarrollo de software", href: "/servicios/desarrollo-software" },
  { label: "Automatización", href: "/servicios/automatizacion" },
  { label: "Infraestructura cloud", href: "/servicios/infraestructura-cloud" },
  { label: "Consultoría", href: "/servicios/consultoria" },
  { label: "Casos de uso", href: "/casos-de-uso" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Contacto", href: "/contacto" },
];

export function MobileMenuNative() {
  return (
    <details className="relative md:hidden">
      <summary
        aria-label="Abrir menú"
        className="inline-flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-lg text-slate-900 hover:bg-slate-100 [&::-webkit-details-marker]:hidden"
      >
        <Menu className="h-5 w-5" aria-hidden />
      </summary>
      <div className="absolute right-0 top-full z-[100] mt-2 w-[88vw] max-w-sm overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
        <nav aria-label="Menú móvil" className="max-h-[80vh] overflow-y-auto p-2">
          <ul className="space-y-1">
            {links.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-lg px-3 py-2.5 text-base font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-2 border-t border-slate-200 p-2">
            <Link
              href="/contacto"
              className="flex w-full items-center justify-center rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--color-accent-hover)]"
            >
              Solicitar diagnóstico
            </Link>
          </div>
        </nav>
      </div>
    </details>
  );
}
