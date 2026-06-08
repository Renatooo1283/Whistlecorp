import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { ServiceDetailLayout } from "@/components/blocks/ServiceDetailLayout";
import { serviceDetails } from "@/lib/content/services";

const service = serviceDetails["desarrollo-software"];

export const metadata: Metadata = buildMetadata({
  title: "Desarrollo de software a medida en Ecuador | WhistleCorp",
  rawTitle: true,
  description:
    "Creamos sistemas web empresariales, dashboards, portales de clientes y aplicaciones internas adaptadas a los procesos reales de tu empresa.",
  path: "/servicios/desarrollo-software",
});

export default function Page() {
  return (
    <ServiceDetailLayout
      service={service}
      headerBackground={{
        src: "/imagenes/desarrollo-software.webp",
        alt: "",
      }}
    />
  );
}
