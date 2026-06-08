import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { ServiceDetailLayout } from "@/components/blocks/ServiceDetailLayout";
import { serviceDetails } from "@/lib/content/services";

const service = serviceDetails["automatizacion"];

export const metadata: Metadata = buildMetadata({
  title: "Automatización de procesos empresariales | WhistleCorp",
  rawTitle: true,
  description:
    "Automatizamos formularios, notificaciones, reportes y flujos de trabajo conectando herramientas como WhatsApp, Google Sheets, Supabase, Make y n8n.",
  path: "/servicios/automatizacion",
});

export default function Page() {
  return (
    <ServiceDetailLayout
      service={service}
      headerBackground={{
        src: "/imagenes/automatizacion.png",
        alt: "",
      }}
    />
  );
}
