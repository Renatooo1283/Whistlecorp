import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Solicitud recibida | WhistleCorp",
  rawTitle: true,
  description:
    "Recibimos tu solicitud de diagnóstico. Nuestro equipo revisará la información y te contactará con una primera orientación.",
  path: "/gracias",
  noindex: true,
});

export default function GraciasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
