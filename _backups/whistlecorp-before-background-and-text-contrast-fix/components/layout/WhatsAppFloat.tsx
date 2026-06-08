"use client";

import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { buildPlainWhatsAppUrl } from "@/lib/forms/whatsapp";

export function WhatsAppFloat() {
  const pathname = usePathname();

  if (pathname === "/gracias") return null;

  const url = buildPlainWhatsAppUrl(
    "Hola, vengo desde whistlecorp.com y me gustaría conocer más sobre sus servicios."
  );

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp"
      className="fixed bottom-5 right-5 z-30 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition-transform hover:scale-105 hover:bg-[#1FB958] sm:bottom-6 sm:right-6"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
