import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { ServiceDetailLayout } from "@/components/blocks/ServiceDetailLayout";
import { serviceDetails } from "@/lib/content/services";

const service = serviceDetails["consultoria"];

export const metadata: Metadata = buildMetadata({
  title: "Consultoría tecnológica para empresas | WhistleCorp",
  rawTitle: true,
  description:
    "Acompañamos a empresas en diagnóstico digital, roadmap tecnológico, levantamiento de procesos y selección de herramientas para modernizar su operación.",
  path: "/servicios/consultoria",
});

export default function Page() {
  return (
    <ServiceDetailLayout
      service={service}
      headerBackground={{
        src: "/imagenes/consultoria.jpg",
        alt: "",
      }}
    />
  );
}
