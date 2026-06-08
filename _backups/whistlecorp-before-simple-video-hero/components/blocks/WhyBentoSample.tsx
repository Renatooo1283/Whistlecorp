"use client";

import { memo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Bell,
  CheckCircle2,
  Database,
  Gauge,
  LifeBuoy,
  Lightbulb,
  Map as MapIcon,
  ShieldCheck,
  Sparkles,
  Workflow,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * "Por qué trabajar con WhistleCorp" — Bento sample
 * Aplica la skill design-taste-frontend (DESIGN_VARIANCE=8, MOTION_INTENSITY=6, VISUAL_DENSITY=4)
 * manteniendo el stack actual (Lucide icons, paleta WhistleCorp).
 *
 * Composición asimétrica 6 cols × 3 rows en md+:
 *   ┌──────────────────────┬──────────────┐
 *   │                      │  Card 2      │
 *   │  Card 1 (grande)     ├──────────────┤
 *   │                      │  Card 3      │
 *   ├──────────────────────┴──────────────┤
 *   │  Card 4 (full width)                │
 *   └─────────────────────────────────────┘
 */

const SPRING = { type: "spring", stiffness: 100, damping: 20 } as const;

// ────────────────────────────────────────────────────────────────────
// Card 1 — Diagnóstico antes de construir
// Archetype: The Live Status + Contextual Focus (stagger highlight)
// ────────────────────────────────────────────────────────────────────

const auditAreas = [
  "Mapa de operación",
  "Stack actual",
  "Calidad de datos",
  "Costos operativos",
];

const DiagnosticVisual = memo(function DiagnosticVisual() {
  return (
    <div className="relative mt-7 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white p-5">
      {/* Top: scan progress + live dot */}
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)]/10 px-2.5 py-1 text-[11px] font-medium text-[var(--color-accent)]">
          <motion.span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]"
            animate={{ opacity: [0.35, 1, 0.35], scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          Scan en curso
        </span>
        <span className="ml-auto font-mono text-[11px] text-[var(--color-text)]">
          04:32
        </span>
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-bg-alt)]">
        <motion.div
          className="h-full rounded-full bg-[var(--color-accent)]"
          initial={{ width: "10%" }}
          animate={{ width: ["10%", "92%", "10%"] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.7, 1],
          }}
        />
      </div>

      {/* Audit items staggered highlight */}
      <ul className="mt-5 space-y-2.5">
        {auditAreas.map((label, i) => (
          <motion.li
            key={label}
            className="flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm text-[var(--color-text-strong)]"
            initial={{ backgroundColor: "rgba(0,0,0,0)" }}
            animate={{
              backgroundColor: [
                "rgba(0,0,0,0)",
                "rgba(22,163,74,0.06)",
                "rgba(0,0,0,0)",
              ],
            }}
            transition={{
              duration: 1.4,
              delay: 0.6 + i * 0.55,
              repeat: Infinity,
              repeatDelay: 4.2,
              ease: "easeInOut",
            }}
          >
            <CheckCircle2
              className="h-4 w-4 shrink-0 text-[var(--color-accent)]"
              strokeWidth={1.5}
            />
            <span className="flex-1">{label}</span>
            <span className="font-mono text-[10px] text-[var(--color-text)]">
              OK
            </span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
});

// ────────────────────────────────────────────────────────────────────
// Card 2 — Entregas por fases
// Archetype: The Live Status — fase activa que se desplaza en loop
// ────────────────────────────────────────────────────────────────────

const phases = ["Fase 01", "Fase 02", "Fase 03"];

const PhasesVisual = memo(function PhasesVisual() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const id = setInterval(
      () => setActive((p) => (p + 1) % phases.length),
      2200
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mt-6">
      <div className="relative flex items-center justify-between">
        {/* connecting line */}
        <span
          aria-hidden
          className="absolute left-3 right-3 top-1/2 -z-0 h-px -translate-y-1/2 bg-[var(--color-border)]"
        />
        {phases.map((p, i) => {
          const isActive = i === active;
          const isPast = i < active;
          return (
            <div
              key={p}
              className="relative z-10 flex flex-col items-center gap-1.5"
            >
              <motion.span
                layout
                transition={SPRING}
                className={`relative inline-flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                  isActive
                    ? "border-[var(--color-accent)] bg-white"
                    : isPast
                    ? "border-[var(--color-accent)] bg-[var(--color-accent)]"
                    : "border-[var(--color-border)] bg-white"
                }`}
              >
                {isActive && (
                  <motion.span
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-[var(--color-accent)]/30"
                    initial={{ scale: 1, opacity: 0.6 }}
                    animate={{ scale: 1.8, opacity: 0 }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                  />
                )}
                {isPast && (
                  <CheckCircle2
                    className="h-3.5 w-3.5 text-white"
                    strokeWidth={2}
                  />
                )}
              </motion.span>
              <span
                className={`font-mono text-[10px] tracking-wider ${
                  isActive
                    ? "text-[var(--color-text-strong)]"
                    : "text-[var(--color-text)]"
                }`}
              >
                {p}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
});

// ────────────────────────────────────────────────────────────────────
// Card 3 — Automatizaciones útiles
// Archetype: The Intelligent List — items que se reordenan en loop
// ────────────────────────────────────────────────────────────────────

type AutoItem = { id: string; label: string; icon: LucideIcon };

const baseAutoItems: AutoItem[] = [
  { id: "form", label: "Formulario", icon: Sparkles },
  { id: "db", label: "Base de datos", icon: Database },
  { id: "notify", label: "Notificación", icon: Bell },
];

const AutomationsVisual = memo(function AutomationsVisual() {
  const [items, setItems] = useState(baseAutoItems);
  useEffect(() => {
    const id = setInterval(() => {
      setItems((prev) => {
        const next = [...prev];
        next.unshift(next.pop()!);
        return next;
      });
    }, 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <ul className="mt-6 space-y-2">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <motion.li
            key={item.id}
            layout
            transition={SPRING}
            className="flex items-center gap-2.5 rounded-lg border border-[var(--color-border)]/60 bg-white px-3 py-2 text-xs font-medium text-[var(--color-text-strong)] shadow-[0_1px_2px_rgba(11,27,43,0.04)]"
          >
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
              <Icon className="h-3 w-3" strokeWidth={1.5} />
            </span>
            <span>{item.label}</span>
          </motion.li>
        );
      })}
    </ul>
  );
});

// ────────────────────────────────────────────────────────────────────
// Card 4 — Soporte posterior al lanzamiento
// Archetype: The Wide Data Stream — pulsos secuenciales + métricas
// ────────────────────────────────────────────────────────────────────

const supportMetrics = [
  { label: "Uptime", value: "99.92%", icon: ShieldCheck },
  { label: "Respuesta media", value: "38 min", icon: Gauge },
  { label: "Ajustes aplicados", value: "142", icon: Activity },
];

const PulseLine = memo(function PulseLine() {
  const dots = Array.from({ length: 9 });
  return (
    <div className="relative mt-5 h-9 w-full overflow-hidden rounded-full border border-[var(--color-border)]/60 bg-white px-4">
      <div className="flex h-full items-center justify-between">
        {dots.map((_, i) => (
          <motion.span
            key={i}
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]/30"
            animate={{
              backgroundColor: [
                "rgba(22,163,74,0.25)",
                "rgba(22,163,74,1)",
                "rgba(22,163,74,0.25)",
              ],
              scale: [1, 1.6, 1],
            }}
            transition={{
              duration: 1.8,
              delay: i * 0.18,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
});

const SupportVisual = memo(function SupportVisual() {
  return (
    <div className="mt-5 grid gap-5 sm:grid-cols-[1.4fr_1fr] sm:items-center">
      <PulseLine />
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-1">
        {supportMetrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING, delay: 0.2 + i * 0.1 }}
              className="flex items-center gap-2.5"
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
              </span>
              <div className="min-w-0">
                <p className="font-mono text-sm font-semibold leading-none text-[var(--color-text-strong)]">
                  {m.value}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-[var(--color-text)]">
                  {m.label}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});

// ────────────────────────────────────────────────────────────────────
// Bento Card primitive
// ────────────────────────────────────────────────────────────────────

type CardProps = {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  className?: string;
  children?: React.ReactNode;
  delay?: number;
};

const BentoCard = memo(function BentoCard({
  icon: Icon,
  eyebrow,
  title,
  description,
  className,
  children,
  delay = 0,
}: CardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ ...SPRING, delay }}
      className={`group relative flex flex-col overflow-hidden rounded-3xl border border-white/15 bg-white/[0.06] p-7 ring-1 ring-inset ring-white/[0.04] backdrop-blur-md transition-colors hover:bg-white/[0.09] sm:p-8 ${
        className ?? ""
      }`}
    >
      <div className="flex items-center gap-2.5">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-accent)]/20 text-[#4ADE80] ring-1 ring-inset ring-[var(--color-accent)]/30">
          <Icon className="h-4.5 w-4.5" strokeWidth={1.75} />
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#7DD3A0]">
          {eyebrow}
        </span>
      </div>

      <h3 className="mt-5 text-lg font-bold leading-snug tracking-tight text-[#FDE68A] sm:text-xl">
        {title}
      </h3>
      <p className="mt-2 max-w-[42ch] text-sm leading-relaxed text-white/80">
        {description}
      </p>

      {children}
    </motion.article>
  );
});

// ────────────────────────────────────────────────────────────────────
// Main export
// ────────────────────────────────────────────────────────────────────

export function WhyBentoSample() {
  return (
    <section className="relative overflow-hidden bg-[var(--color-ink)] py-20 sm:py-24 lg:py-28">
      {/* Ambient background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle at 12% 8%, rgba(22,163,74,0.16), transparent 38%), radial-gradient(circle at 88% 92%, rgba(30,58,95,0.55), transparent 50%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header — left aligned, no centered hero */}
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/70">
              Por qué{" "}
              <span className="font-bold text-[#4ADE80]">WhistleCorp</span>
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-bold leading-[1.08] tracking-tight text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.35)] sm:text-4xl lg:text-[2.75rem]">
              Una forma de trabajar pensada para empresas que necesitan
              resultados, <span className="text-[#FCD34D]">no promesas</span>.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-white/75 md:col-span-4">
            Cuatro principios que se ven en cada proyecto. Diseñados para que el
            valor llegue por fases, no al final.
          </p>
        </div>

        {/* Bento grid */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-6 md:grid-rows-[auto_auto_auto] lg:gap-6">
          {/* Card 1 — Diagnóstico (grande) */}
          <BentoCard
            icon={Lightbulb}
            eyebrow="01 · Diagnóstico"
            title="Diagnóstico antes de construir"
            description="Mapeamos tu operación real antes de proponer una solución. Si algo no aporta valor verificable, no se construye."
            className="md:col-span-4 md:row-span-2 md:row-start-1 md:col-start-1"
            delay={0}
          >
            <DiagnosticVisual />
          </BentoCard>

          {/* Card 2 — Fases */}
          <BentoCard
            icon={MapIcon}
            eyebrow="02 · Entregas"
            title="Entregas por fases"
            description="Avances iterativos y validados con tu equipo, en vez de un proyecto largo sin resultados visibles."
            className="md:col-span-2 md:row-start-1 md:col-start-5"
            delay={0.08}
          >
            <PhasesVisual />
          </BentoCard>

          {/* Card 3 — Automatizaciones útiles */}
          <BentoCard
            icon={Sparkles}
            eyebrow="03 · Automatización"
            title="Útil, no complejo"
            description="Automatizaciones sostenibles que tu equipo puede operar, mantener y escalar con el tiempo."
            className="md:col-span-2 md:row-start-2 md:col-start-5"
            delay={0.16}
          >
            <AutomationsVisual />
          </BentoCard>

          {/* Card 4 — Soporte (full width) */}
          <BentoCard
            icon={LifeBuoy}
            eyebrow="04 · Soporte"
            title="Acompañamiento posterior al lanzamiento"
            description="Monitoreo, ajustes y mejoras continuas. El go-live es el inicio, no el final."
            className="md:col-span-6 md:row-start-3"
            delay={0.24}
          >
            <SupportVisual />
          </BentoCard>
        </div>

        {/* Footer micro-line */}
        <div className="mt-10 flex items-center gap-3 text-[11px] text-white/55">
          <Workflow className="h-3.5 w-3.5" strokeWidth={1.5} />
          <span className="font-mono uppercase tracking-[0.18em]">
            Vista interactiva — datos ilustrativos
          </span>
          <span aria-hidden className="h-px flex-1 bg-white/15" />
          <Zap className="h-3.5 w-3.5 text-[#4ADE80]" strokeWidth={1.5} />
        </div>
      </div>
    </section>
  );
}
