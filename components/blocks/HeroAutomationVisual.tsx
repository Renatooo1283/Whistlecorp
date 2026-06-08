"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  Bell,
  CalendarCheck,
  CheckCircle2,
  Database,
  FileText,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Step = {
  icon: LucideIcon;
  label: string;
  caption: string;
};

const steps: Step[] = [
  {
    icon: FileText,
    label: "Formulario recibido",
    caption: "Captura validada y estructurada",
  },
  {
    icon: Database,
    label: "Lead clasificado",
    caption: "Asignado a la base correcta",
  },
  {
    icon: Bell,
    label: "Notificación enviada",
    caption: "Aviso al responsable",
  },
  {
    icon: CalendarCheck,
    label: "Seguimiento agendado",
    caption: "Próximo contacto programado",
  },
];

type StatusItem = {
  label: string;
  value: string;
  tone: "ink" | "amber" | "accent";
};

const dashboardStatuses: StatusItem[] = [
  { label: "Nuevo", value: "12", tone: "ink" },
  { label: "En revisión", value: "5", tone: "amber" },
  { label: "Agendado", value: "8", tone: "accent" },
];

const toneClasses: Record<StatusItem["tone"], string> = {
  ink: "bg-[var(--color-ink-soft)]/15 text-white",
  amber: "bg-amber-400/15 text-amber-200",
  accent: "bg-[var(--color-accent)]/20 text-[var(--color-accent)]",
};

export function HeroAutomationVisual() {
  return (
    <div className="relative w-full" aria-hidden>
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-2xl backdrop-blur-sm sm:p-6">
        {/* Glow */}
        <div
          className="pointer-events-none absolute -top-20 -right-16 h-48 w-48 rounded-full bg-[var(--color-accent)]/20 blur-3xl"
          aria-hidden
        />

        <div className="relative grid gap-5">
          {/* Header chip */}
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-[11px] font-medium text-white/80 ring-1 ring-white/10">
              <Workflow className="h-3.5 w-3.5 text-[var(--color-accent)]" />
              Flujo automatizado
            </span>
            <span className="text-[11px] font-medium text-white/40">
              Tiempo real
            </span>
          </div>

          {/* Flow cards */}
          <ol className="relative flex flex-col gap-3">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.li
                  key={step.label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.2 + i * 0.35,
                    ease: "easeOut",
                  }}
                  className="relative flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3 ring-1 ring-inset ring-white/5"
                >
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent)]/15 text-[var(--color-accent)]">
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white">
                      {step.label}
                    </p>
                    <p className="truncate text-[12px] text-white/60">
                      {step.caption}
                    </p>
                  </div>
                  <motion.span
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.45 + i * 0.35, duration: 0.4 }}
                    className="inline-flex items-center gap-1 rounded-full bg-[var(--color-accent)]/15 px-2 py-0.5 text-[11px] font-medium text-[var(--color-accent)]"
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    OK
                  </motion.span>

                  {/* connector */}
                  {i < steps.length - 1 && (
                    <span
                      aria-hidden
                      className="absolute left-[26px] top-full block h-3 w-px bg-gradient-to-b from-white/20 to-transparent"
                    />
                  )}
                </motion.li>
              );
            })}
          </ol>

          {/* Mini dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.5, ease: "easeOut" }}
            className="rounded-xl border border-white/10 bg-[var(--color-ink-soft)]/40 p-4"
          >
            <div className="mb-3 flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[var(--color-accent)]/15 text-[var(--color-accent)]">
                <BarChart3 className="h-3.5 w-3.5" />
              </span>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
                Dashboard actualizado
              </p>
              <motion.span
                aria-hidden
                className="ml-auto inline-block h-2 w-2 rounded-full bg-[var(--color-accent)]"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              {dashboardStatuses.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.8 + i * 0.15, duration: 0.4 }}
                  className={`flex flex-col rounded-lg px-3 py-2.5 ${toneClasses[s.tone]}`}
                >
                  <span className="text-[10px] font-medium uppercase tracking-wider opacity-80">
                    {s.label}
                  </span>
                  <span className="mt-1 text-lg font-bold leading-none">
                    {s.value}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative glow under card */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-6 -right-6 hidden h-32 w-32 rounded-2xl bg-[var(--color-accent)]/20 blur-2xl lg:block"
      />
    </div>
  );
}
