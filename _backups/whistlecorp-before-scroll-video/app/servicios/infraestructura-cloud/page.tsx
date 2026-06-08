import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { ServiceDetailLayout } from "@/components/blocks/ServiceDetailLayout";
import { serviceDetails } from "@/lib/content/services";

const service = serviceDetails["infraestructura-cloud"];

export const metadata: Metadata = buildMetadata({
  title: "Infraestructura cloud y soporte tecnológico | WhistleCorp",
  rawTitle: true,
  description:
    "Ayudamos a empresas con soporte tecnológico, backups, monitoreo, migración cloud, seguridad básica y continuidad operativa.",
  path: "/servicios/infraestructura-cloud",
});

export default function Page() {
  return (
    <ServiceDetailLayout
      service={service}
      headerBackground={{
        src: "/imagenes/infraestructura.jpg",
        alt: "",
      }}
    />
  );
}
