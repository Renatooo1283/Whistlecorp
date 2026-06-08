"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  LifeBuoy,
  Lightbulb,
  Map as MapIcon,
  Shield,
  Sparkles,
  Workflow,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * "Por qué WhistleCorp" — Bento variant SPLIT MIXTO (Home version)
 *
 * Versión sobria: mezcla 2 cards navy + 2 cards white en el mismo grid.
 * Solo entrada inicial (whileInView). Sin animaciones perpetuas.
 *
 *   ┌────────────────────┬──────────────┐
 *   │  Card 1 — NAVY     │  Card 2 — W  │
 *   │  (anchor, grande)  ├──────────────┤
 *   │                    │  Card 3 — W  │
 *   ├────────────────────┴──────────────┤
 *   │  Card 4 — NAVY (anchor full-w)    │
 *   └───────────────────────────────────┘
 */

const SPRING = { type: "spring", stiffness: 100, damping: 20 } as const;

// ────────────────────────────────────────────────────────────────────
// Card visuals — estáticos, informativos
// ────────────────────────────────────────────────────────────────────

const auditAreas = [
  "Mapa de operación",
  "Stack actual",
  "Calidad de datos",
  "Costos operativos",
];

const DiagnosticVisualDark = memo(function DiagnosticVisualDark() {
  return (
    <div className="relative mt-7 rounded-2xl border border-white/10 bg-white/[0.05] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#86EFAC]">
        Qué revisamos
      </p>
      <ul className="mt-4 grid gap-2.5">
        {auditAreas.map((label) => (
          <li
            key={label}
            className="flex items-center gap-3 text-sm text-white/90"
          >
            <CheckCircle2
              className="h-4 w-4 shrink-0 text-[#4ADE80]"
              strokeWidth={1.5}
            />
            <span>{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
});

const phases: { label: string; description: string }[] = [
  { label: "Planificación", description: "Alcance y objetivos." },
  { label: "Diseño", description: "Solución y arquitectura." },
  { label: "Implementación", description: "Desarrollo y entrega." },
];

const PhasesVisualLight = memo(function PhasesVisualLight() {
  return (
    <ol className="mt-6 space-y-3">
      {phases.map((p, i) => (
        <li key={p.label} className="flex items-start gap-3">
          <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--color-accent)] bg-[var(--color-accent)] text-[10px] font-bold text-white">
            {i + 1}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[var(--color-text-strong)]">
              {p.label}
            </p>
            <p className="text-xs text-[var(--color-text)]">{p.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
});

const automations = [
  "Formularios con validación",
  "Notificaciones automáticas",
  "Conexión con Make / n8n",
  "Reportes programados",
];

const AutomationsVisualLight = memo(function AutomationsVisualLight() {
  return (
    <ul className="mt-6 space-y-2">
      {automations.map((label) => (
        <li
          key={label}
          className="flex items-center gap-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-alt)] px-3 py-2 text-xs font-medium text-[var(--color-text-strong)]"
        >
          <Sparkles
            className="h-3.5 w-3.5 shrink-0 text-[var(--color-accent-hover)]"
            strokeWidth={1.5}
          />
          <span>{label}</span>
        </li>
      ))}
    </ul>
  );
});

const supportPillars: { label: string; icon: LucideIcon; description: string }[] = [
  {
    icon: Shield,
    label: "Mantenimiento",
    description: "Preventivo y correctivo continuo.",
  },
  {
    icon: Workflow,
    label: "Monitoreo",
    description: "Disponibilidad y rendimiento.",
  },
  {
    icon: Zap,
    label: "Mejora continua",
    description: "Ajustes y nuevas versiones.",
  },
];

const SupportVisualDark = memo(function SupportVisualDark() {
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-3">
      {supportPillars.map((p) => {
        const Icon = p.icon;
        return (
          <div
            key={p.label}
            className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4"
          >
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent)]/20 text-[#4ADE80] ring-1 ring-inset ring-[var(--color-accent)]/30">
              <Icon className="h-4 w-4" strokeWidth={1.5} />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#FDE68A]">{p.label}</p>
              <p className="mt-1 text-xs text-white/70">{p.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
});

// ────────────────────────────────────────────────────────────────────
// Card primitives
// ────────────────────────────────────────────────────────────────────

type CommonCardProps = {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  className?: string;
  children?: React.ReactNode;
  delay?: number;
};

const NavyCard = memo(function NavyCard({
  icon: Icon,
  eyebrow,
  title,
  description,
  className,
  children,
  delay = 0,
}: CommonCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ ...SPRING, delay }}
      className={`group relative flex flex-col overflow-hidden rounded-3xl border border-[var(--color-ink-soft)]/40 bg-[var(--color-ink)] p-7 shadow-[0_24px_48px_-20px_rgba(11,27,43,0.35)] ring-1 ring-inset ring-white/5 sm:p-8 ${
        className ?? ""
      }`}
    >
      <div className="relative flex items-center gap-2.5">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-accent)]/20 text-[#4ADE80] ring-1 ring-inset ring-[var(--color-accent)]/30">
          <Icon className="h-4.5 w-4.5" strokeWidth={1.75} />
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#86EFAC]">
          {eyebrow}
        </span>
      </div>

      <h3 className="relative mt-5 text-lg font-bold leading-snug tracking-tight text-[#FDE68A] sm:text-xl">
        {title}
      </h3>
      <p className="relative mt-2 max-w-[46ch] text-sm leading-relaxed text-white/80">
        {description}
      </p>

      <div className="relative">{children}</div>
    </motion.article>
  );
});

const WhiteCard = memo(function WhiteCard({
  icon: Icon,
  eyebrow,
  title,
  description,
  className,
  children,
  delay = 0,
}: CommonCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ ...SPRING, delay }}
      className={`group relative flex flex-col overflow-hidden rounded-3xl border border-[var(--color-border)] bg-white p-7 shadow-[0_24px_48px_-24px_rgba(11,27,43,0.12)] transition-shadow hover:shadow-[0_28px_56px_-22px_rgba(11,27,43,0.18)] sm:p-8 ${
        className ?? ""
      }`}
    >
      <div className="flex items-center gap-2.5">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-ink)]/8 text-[var(--color-ink)] ring-1 ring-inset ring-[var(--color-ink)]/15">
          <Icon className="h-4.5 w-4.5" strokeWidth={1.75} />
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
          {eyebrow}
        </span>
      </div>

      <h3 className="mt-5 text-lg font-bold leading-snug tracking-tight text-[var(--color-text-strong)] sm:text-xl">
        {title}
      </h3>
      <p className="mt-2 max-w-[46ch] text-sm leading-relaxed text-[var(--color-text)]">
        {description}
      </p>

      {children}
    </motion.article>
  );
});

// ────────────────────────────────────────────────────────────────────
// Main export — SPLIT MIXTO (static / informativo)
// ────────────────────────────────────────────────────────────────────

export function WhyBentoSampleSplit() {
  return (
    <section className="relative overflow-hidden bg-[var(--color-bg-alt)] py-20 sm:py-24 lg:py-28">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header — asymmetric split */}
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-text)]">
              Por qué{" "}
              <span className="font-bold text-[var(--color-accent-hover)]">
                WhistleCorp
              </span>
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-bold leading-[1.08] tracking-tight text-[var(--color-text-strong)] sm:text-4xl lg:text-[2.75rem]">
              Una forma de trabajar pensada para empresas que necesitan
              resultados,{" "}
              <span className="text-[var(--color-accent-hover)]">
                no promesas
              </span>
              .
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-[var(--color-text)] md:col-span-4">
            Acompañamos a nuestros clientes en todo el ciclo de vida de la
            solución: planificación, diseño, implementación, soporte y mejora
            continua.
          </p>
        </div>

        {/* Bento grid */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-6 md:grid-rows-[auto_auto_auto] lg:gap-6">
          <NavyCard
            icon={Lightbulb}
            eyebrow="01 · Diagnóstico"
            title="Diagnóstico antes de construir"
            description="Mapeamos tu operación real antes de proponer una solución. Si algo no aporta valor verificable, no se construye."
            className="md:col-span-4 md:row-span-2 md:row-start-1 md:col-start-1"
            delay={0}
          >
            <DiagnosticVisualDark />
          </NavyCard>

          <WhiteCard
            icon={MapIcon}
            eyebrow="02 · Entregas"
            title="Entregas por fases"
            description="Planificación, diseño e implementación con validaciones constantes en cada etapa."
            className="md:col-span-2 md:row-start-1 md:col-start-5"
            delay={0.08}
          >
            <PhasesVisualLight />
          </WhiteCard>

          <WhiteCard
            icon={Sparkles}
            eyebrow="03 · Automatización"
            title="Útil, no complejo"
            description="Automatizaciones sostenibles que tu equipo puede operar y escalar con el tiempo."
            className="md:col-span-2 md:row-start-2 md:col-start-5"
            delay={0.16}
          >
            <AutomationsVisualLight />
          </WhiteCard>

          <NavyCard
            icon={LifeBuoy}
            eyebrow="04 · Soporte"
            title="Acompañamiento posterior al lanzamiento"
            description="Mantenimiento preventivo y correctivo, monitoreo y mejora continua. El go-live es el inicio, no el final."
            className="md:col-span-6 md:row-start-3"
            delay={0.24}
          >
            <SupportVisualDark />
          </NavyCard>
        </div>
      </div>
    </section>
  );
}
