import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { ClientHydrationDebug } from "@/components/debug/ClientHydrationDebug";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.whistlecorp.com"),
  title: {
    default: "WhistleCorp | Software, automatización y cloud para empresas",
    template: "%s | WhistleCorp",
  },
  description:
    "Desarrollamos software a medida, automatizamos procesos empresariales y fortalecemos infraestructura tecnológica para empresas en Ecuador y Latinoamérica.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={manrope.variable}
      suppressHydrationWarning
    >
      <body className="min-h-screen text-[var(--color-text)] antialiased flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFloat />
        {process.env.NODE_ENV === "development" && <ClientHydrationDebug />}
      </body>
    </html>
  );
}
