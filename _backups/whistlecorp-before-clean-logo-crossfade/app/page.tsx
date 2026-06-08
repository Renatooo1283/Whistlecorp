import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Mail } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { TrustStrip } from "@/components/blocks/TrustStrip";
import { ScrollStoryCanvas } from "@/components/blocks/ScrollStoryCanvas";
import {
  trustStrip,
  problems,
  solutions,
  howWeThink,
  finalCta,
} from "@/lib/content/home";
import type { ScrollStoryScene } from "@/components/blocks/ScrollStoryCanvas";

const FRAME_COUNT = 109;

export const metadata: Metadata = buildMetadata({
  title: "WhistleCorp | Software, automatización y cloud para empresas",
  description:
    "Desarrollamos software a medida, automatizamos procesos empresariales y fortalecemos infraestructura tecnológica para empresas en Ecuador y Latinoamérica.",
  path: "/",
});

// Tres escenas narrativas:
//   1) Hero (introducción + CTAs)            → frame curado 0   = frame real 41
//   2) Propuesta de valor (automatización)    → frame curado ~32 = frame real ~73
//   3) Cierre con logo + CTA centrado         → frame curado 68  = frame real 109
// Los frames intermedios entre escena 2 y escena 3 se atraviesan rápido
// (lastSceneTransitionMs ≈ 350 ms) para que el usuario no pueda detenerse
// en composiciones con fragmentos flotando.
const storyScenes: ScrollStoryScene[] = [
  // ESCENA 1 — Introducción / Hero principal
  {
    frameProgress: 0.0,
    step: {
      variant: "hero",
      align: "left",
      eyebrow: "SOFTWARE · AUTOMATIZACIÓN · CLOUD",
      title:
        "Si tu equipo todavía depende de Excel, WhatsApp y correos para operar, podemos ayudarte a ordenarlo.",
      text: "Diseñamos sistemas a medida, automatizamos tareas manuales y mantenemos la infraestructura que sostiene tu operación.",
      cta: { label: "Solicitar diagnóstico", href: "/contacto" },
      secondaryCta: { label: "Ver servicios", href: "/servicios" },
    },
  },
  // ESCENA 2 — Propuesta de valor
  {
    frameProgress: 0.47,
    step: {
      align: "right",
      eyebrow: "AUTOMATIZACIÓN ÚTIL",
      title:
        "Tomamos tareas repetitivas y las convertimos en procesos que se ejecutan solos.",
      text: "Menos tareas manuales. Más orden y control sobre tu operación.",
    },
  },
  // ESCENA 3 — Cierre, logo completo + CTA centrado
  {
    frameProgress: 1.0,
    step: {
      align: "center",
      eyebrow: "WHISTLECORP",
      title: "Construyamos una solución útil desde el primer día.",
      cta: { label: "Solicitar diagnóstico", href: "/contacto" },
    },
  },
];

export default function HomePage() {
  return (
    <>
      {/* ─── HERO: scrollytelling con canvas, primer bloque debajo del navbar ─── */}
      {/*
        Curado y timings:
        - frames 1–40 son la "explosión" inicial (fragmentos verdes flotando)
          y se excluyen del recorrido (el usuario nunca puede detenerse ahí).
        - frames 41–109 = 69 frames limpios usables.
        - 3 escenas narrativas en lugar de 6.
        - transitionMs = 600 ms (escena 1 → 2).
        - lastSceneTransitionMs = 350 ms (escena 2 → 3): pasa rápido por los
          frames intermedios para que el usuario no pueda detenerse en un
          estado con fragmentos flotando entre la propuesta de valor y el logo.
      */}
      <ScrollStoryCanvas
        frameCount={FRAME_COUNT}
        desktopFramePrefix="/scroll-frames/whistlecorp-desktop/frame-"
        mobileFramePrefix="/scroll-frames/whistlecorp-mobile/frame-"
        mobileBreakpoint={768}
        frameSuffix=".webp"
        framePadding={4}
        scenes={storyScenes}
        excludeFrameRange={{ start: 1, end: 40 }}
        transitionMs={600}
        lastSceneTransitionMs={350}
      />

      <TrustStrip title={trustStrip.title} items={trustStrip.items} />

      {/* ─── Problemas (lista editorial con ejemplos concretos) ─────── */}
      <section className="bg-[var(--color-bg-alt)]">
        <Container className="py-20 sm:py-24 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-accent-hover)]">
                {problems.eyebrow}
              </p>
              <h2 className="mt-4 text-3xl font-bold leading-tight text-[var(--color-text-strong)] sm:text-4xl">
                {problems.title}
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-[var(--color-text)]">
                {problems.intro}
              </p>
            </div>

            <ol className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
              {problems.items.map((item, i) => (
                <li
                  key={item.title}
                  className="grid gap-4 py-7 sm:grid-cols-[auto_1fr] sm:items-baseline sm:gap-8"
                >
                  <span className="font-mono text-sm font-medium text-[var(--color-accent-hover)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--color-text-strong)]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--color-text)]">
                      {item.example}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* ─── Servicios ─────────────────────────────────────────────── */}
      <section className="bg-white">
        <Container className="py-20 sm:py-24 lg:py-28">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-accent-hover)]">
              {solutions.eyebrow}
            </p>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-[var(--color-text-strong)] sm:text-4xl">
              {solutions.title}
            </h2>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:gap-8">
            {solutions.items.map((s, i) => (
              <article
                key={s.title}
                className="group relative flex flex-col rounded-2xl border border-[var(--color-border)] bg-white p-7 transition-colors hover:border-[var(--color-accent)]/40 sm:p-8"
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs font-medium text-[var(--color-accent-hover)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-xl font-bold leading-snug text-[var(--color-text-strong)]">
                    {s.title}
                  </h3>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-[var(--color-text)]">
                  {s.description}
                </p>
                <ul className="mt-5 space-y-1.5 border-t border-[var(--color-border)] pt-4">
                  {s.bullets.map((b) => (
                    <li
                      key={b}
                      className="text-[13px] leading-relaxed text-[var(--color-text)]"
                    >
                      — {b}
                    </li>
                  ))}
                </ul>
                <Link
                  href={s.href}
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-accent-hover)] hover:text-[var(--color-accent)]"
                >
                  Conocer más
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── Cómo pensamos ────────────────────────────────────────── */}
      <section className="bg-[var(--color-ink)] text-white">
        <Container className="py-20 sm:py-24 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86EFAC]">
                {howWeThink.eyebrow}
              </p>
              <h2 className="mt-4 text-3xl font-bold leading-[1.12] text-white sm:text-4xl lg:text-[2.5rem]">
                {howWeThink.title}
              </h2>
              <p className="mt-6 text-base leading-relaxed text-white/75">
                {howWeThink.body}
              </p>
              <p className="mt-4 text-base leading-relaxed text-white/75">
                {howWeThink.body2}
              </p>
            </div>

            <ol className="space-y-0">
              {howWeThink.pillars.map((p, i) => (
                <li
                  key={p.label}
                  className={`grid gap-4 py-6 sm:grid-cols-[auto_1fr] sm:gap-8 ${
                    i < howWeThink.pillars.length - 1
                      ? "border-b border-white/10"
                      : ""
                  }`}
                >
                  <span className="font-mono text-xs font-medium tracking-wider text-[#86EFAC]">
                    {p.label}
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-white">
                      {p.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/65">
                      {p.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* ─── CTA final humano ─────────────────────────────────────── */}
      <section className="bg-[var(--color-bg-alt)]">
        <Container className="py-20 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-accent-hover)]">
              {finalCta.eyebrow}
            </p>
            <h2 className="mt-4 text-3xl font-bold leading-[1.15] text-[var(--color-text-strong)] sm:text-4xl">
              {finalCta.title}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-[var(--color-text)]">
              {finalCta.body}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button
                href={finalCta.primary.href}
                variant="primary"
                size="lg"
              >
                {finalCta.primary.label}
              </Button>
              <Button
                href={finalCta.secondary.href}
                variant="secondary"
                size="lg"
              >
                {finalCta.secondary.label}
              </Button>
            </div>

            <div className="mt-10 flex items-center gap-3 border-t border-[var(--color-border)] pt-6">
              <Mail
                className="h-4 w-4 text-[var(--color-accent)]"
                strokeWidth={1.75}
              />
              <span className="text-sm text-[var(--color-text)]">
                {finalCta.emailLabel}:
              </span>
              <a
                href={`mailto:${finalCta.email}`}
                className="text-sm font-semibold text-[var(--color-accent-hover)] hover:text-[var(--color-accent)]"
              >
                {finalCta.email}
              </a>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
