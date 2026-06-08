import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock, MessageCircle } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DiagnosticForm } from "@/components/form/DiagnosticForm";
import { contactPage } from "@/lib/content/contact";
import { contactInfo } from "@/lib/content/navigation";
import { buildPlainWhatsAppUrl } from "@/lib/forms/whatsapp";

export const metadata: Metadata = buildMetadata({
  title: "Solicitar diagnóstico tecnológico | WhistleCorp",
  rawTitle: true,
  description:
    "Cuéntanos tu proceso y te ayudamos a identificar una solución de software, automatización o infraestructura para mejorar tu operación.",
  path: "/contacto",
});

export default function ContactoPage() {
  const whatsappUrl = buildPlainWhatsAppUrl(
    "Hola, vengo desde whistlecorp.com y me gustaría conocer más sobre sus servicios."
  );

  return (
    <>
      <PageHeader
        eyebrow={contactPage.eyebrow}
        title={contactPage.title}
        subtitle={contactPage.subtitle}
      />

      <Section tone="alt">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
              {contactPage.formTitle}
            </h2>
            <DiagnosticForm />
          </div>

          <aside>
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
              {contactPage.contactBlockTitle}
            </h2>
            <Card className="space-y-5">
              <ContactRow
                icon={<Mail className="h-5 w-5 text-[var(--color-accent)]" />}
                label="Correo"
                value={contactInfo.email}
                href={`mailto:${contactInfo.email}`}
              />
              <ContactRow
                icon={<Phone className="h-5 w-5 text-[var(--color-accent)]" />}
                label="Teléfono"
                value={contactInfo.phone}
                href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}
              />
              <ContactRow
                icon={<MapPin className="h-5 w-5 text-[var(--color-accent)]" />}
                label="Ubicación"
                value={contactInfo.location}
              />
              <ContactRow
                icon={<Clock className="h-5 w-5 text-[var(--color-accent)]" />}
                label="Horario"
                value={contactInfo.hours}
              />

              <div className="space-y-2 border-t border-[var(--color-border)] pt-5">
                <Button
                  href={whatsappUrl}
                  variant="whatsapp"
                  size="md"
                  external
                  className="w-full"
                >
                  <MessageCircle className="h-4 w-4" />
                  Escribir por WhatsApp
                </Button>
                <Button
                  href={`mailto:${contactInfo.email}`}
                  variant="secondary"
                  size="md"
                  className="w-full"
                >
                  Enviar correo
                </Button>
              </div>
            </Card>
          </aside>
        </div>
      </Section>
    </>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5">{icon}</span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text)]">
          {label}
        </p>
        {href ? (
          <a
            href={href}
            className="text-sm font-medium text-[var(--color-text-strong)] hover:text-[var(--color-accent)]"
          >
            {value}
          </a>
        ) : (
          <p className="text-sm font-medium text-[var(--color-text-strong)]">
            {value}
          </p>
        )}
      </div>
    </div>
  );
}
