"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getLastSubmission } from "@/lib/forms/submit";
import {
  buildPlainWhatsAppUrl,
  buildWhatsAppUrl,
} from "@/lib/forms/whatsapp";
import { thanksPage } from "@/lib/content/contact";

export default function GraciasPage() {
  const [whatsappUrl, setWhatsappUrl] = useState<string>(
    buildPlainWhatsAppUrl()
  );

  useEffect(() => {
    const last = getLastSubmission();
    if (last) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setWhatsappUrl(buildWhatsAppUrl(last));
    }
  }, []);

  return (
    <section className="bg-[var(--color-bg-alt)] py-20 sm:py-28">
      <Container className="flex flex-col items-center text-center">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-accent)] text-white shadow-lg">
          <Check className="h-8 w-8" strokeWidth={3} />
        </span>

        <h1 className="mt-6 max-w-2xl text-4xl font-bold text-[var(--color-text-strong)] sm:text-5xl">
          {thanksPage.title}
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--color-text)] sm:text-lg">
          {thanksPage.subtitle}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button href={whatsappUrl} variant="whatsapp" size="lg" external>
            <MessageCircle className="h-5 w-5" />
            {thanksPage.primaryCta}
          </Button>
          <Button href="/" variant="secondary" size="lg">
            {thanksPage.secondaryCta}
          </Button>
        </div>

        <p className="mt-10 text-sm text-[var(--color-text)]">
          Mientras tanto,{" "}
          <Link
            href="/casos-de-uso"
            className="font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
          >
            {thanksPage.secondaryLink}
          </Link>
          .
        </p>
      </Container>
    </section>
  );
}
