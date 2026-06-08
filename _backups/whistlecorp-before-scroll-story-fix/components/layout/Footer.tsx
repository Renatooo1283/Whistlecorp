import Link from "next/link";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Logo } from "./Logo";
import { contactInfo, footerLinks } from "@/lib/content/navigation";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[var(--color-ink)] text-white">
      <Container className="py-14 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo tone="dark" size="lg" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
              Convertimos procesos manuales en soluciones digitales simples,
              seguras y automatizadas.
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/60">
              Atendemos empresas en Ecuador y ofrecemos acompañamiento remoto
              para clientes en Latinoamérica.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Servicios
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Empresa
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Contacto
            </h3>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent)]" aria-hidden />
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="hover:text-white"
                >
                  {contactInfo.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent)]" aria-hidden />
                <a
                  href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}
                  className="hover:text-white"
                >
                  {contactInfo.phone}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent)]" aria-hidden />
                <span>{contactInfo.location}</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent)]" aria-hidden />
                <span>{contactInfo.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/60 sm:flex-row sm:items-center">
          <p>
            © {year}{" "}
            <span className="font-semibold text-[var(--color-accent)]">
              WhistleCorp
            </span>
            . Todos los derechos reservados.
          </p>
          <Link
            href="/"
            className="font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
          >
            whistlecorp.com
          </Link>
        </div>
      </Container>
    </footer>
  );
}
