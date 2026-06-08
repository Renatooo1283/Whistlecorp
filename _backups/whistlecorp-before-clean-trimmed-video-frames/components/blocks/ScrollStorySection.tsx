"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export type ScrollStoryStep = {
  /** Progress [0..1] at which the step starts appearing. */
  start: number;
  /** Progress [0..1] at which the step disappears. */
  end: number;
  eyebrow?: string;
  title: string;
  text?: string;
  align?: "left" | "right" | "center";
  cta?: { label: string; href: string };
};

export type ScrollStorySectionProps = {
  /** MP4 path served from /public. */
  src: string;
  /** Optional fallback / poster path. */
  poster?: string;
  /** Total scrollable height for the section. Bigger = slower scrub. */
  sectionHeight?: string;
  steps: ScrollStoryStep[];
  /** Aria label for the outer section. */
  ariaLabel?: string;
};

const FADE_WINDOW = 0.04;

function stepVisibility(progress: number, start: number, end: number) {
  const fadeInEnd = start + FADE_WINDOW;
  const fadeOutStart = end - FADE_WINDOW;
  let opacity = 0;
  let translate = 24;
  if (progress < start) {
    opacity = 0;
    translate = 24;
  } else if (progress < fadeInEnd) {
    const t = (progress - start) / FADE_WINDOW;
    opacity = t;
    translate = 24 - 24 * t;
  } else if (progress < fadeOutStart) {
    opacity = 1;
    translate = 0;
  } else if (progress < end) {
    const t = (progress - fadeOutStart) / FADE_WINDOW;
    opacity = 1 - t;
    translate = -16 * t;
  }
  return { opacity, translate };
}

export function ScrollStorySection({
  src,
  poster,
  sectionHeight = "520vh",
  steps,
  ariaLabel = "Presentación visual de WhistleCorp",
}: ScrollStorySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafId = useRef<number | null>(null);
  const targetTime = useRef(0);
  const lastUpdate = useRef(0);

  const [duration, setDuration] = useState(0);
  const [ready, setReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [progress, setProgress] = useState(0);

  // prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    const v = videoRef.current;
    if (v && Number.isFinite(v.duration) && v.duration > 0) {
      setDuration(v.duration);
    }
  }, []);

  const handleCanPlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    // Initial kick so the first frame is decoded and ready to seek from.
    try {
      v.currentTime = 0.01;
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  // Scroll → currentTime, smoothed with RAF
  useEffect(() => {
    if (reducedMotion || !ready || !duration) return;
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const maxTime = Math.max(0, duration - 0.05);

    const update = () => {
      const v = videoRef.current;
      const s = sectionRef.current;
      if (!v || !s) {
        rafId.current = null;
        return;
      }

      // Compute current progress from scroll
      const rect = s.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrollable = s.offsetHeight - vh;
      const scrolled = -rect.top;
      const p =
        scrollable > 0
          ? Math.max(0, Math.min(1, scrolled / scrollable))
          : 0;
      targetTime.current = Math.max(0, Math.min(maxTime, p * duration));

      // Update React-driven step overlay state at modest rate
      const now = performance.now();
      if (now - lastUpdate.current > 16) {
        setProgress(p);
        lastUpdate.current = now;
      }

      // Smooth scrub toward target
      const cur = v.currentTime;
      const diff = targetTime.current - cur;
      if (Math.abs(diff) > 0.012) {
        try {
          v.currentTime = cur + diff * 0.2;
        } catch {
          /* non-fatal */
        }
      }

      rafId.current = requestAnimationFrame(update);
    };

    rafId.current = requestAnimationFrame(update);

    // Resize triggers re-measurement on the next frame naturally.
    const onResize = () => {
      if (rafId.current === null) {
        rafId.current = requestAnimationFrame(update);
      }
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
    };
  }, [duration, ready, reducedMotion]);

  return (
    <section
      ref={sectionRef}
      aria-label={ariaLabel}
      style={{ height: sectionHeight }}
      className="relative w-full bg-[var(--color-ink)]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Video */}
        <video
          ref={videoRef}
          poster={poster}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          onLoadedMetadata={handleLoadedMetadata}
          onCanPlay={handleCanPlay}
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={src} type="video/mp4" />
        </video>

        {/* Global subtle overlay for legibility */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 via-black/10 to-black/40"
        />

        {/* Reduced-motion: show all steps stacked in a single readable panel */}
        {reducedMotion ? (
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div className="max-w-2xl rounded-2xl border border-white/10 bg-black/55 p-8 backdrop-blur-md">
              {steps.map((s, i) => (
                <div
                  key={i}
                  className={i > 0 ? "mt-6 border-t border-white/10 pt-6" : ""}
                >
                  {s.eyebrow && (
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#86EFAC]">
                      {s.eyebrow}
                    </p>
                  )}
                  <h2 className="mt-2 text-xl font-semibold leading-snug text-white sm:text-2xl">
                    {s.title}
                  </h2>
                  {s.text && (
                    <p className="mt-2 text-sm leading-relaxed text-white/75">
                      {s.text}
                    </p>
                  )}
                  {s.cta && (
                    <Link
                      href={s.cta.href}
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#86EFAC] hover:text-white"
                    >
                      {s.cta.label}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          steps.map((s, i) => (
            <StepOverlay key={i} step={s} progress={progress} />
          ))
        )}

        {/* Scroll hint — fades out after first scroll */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-center transition-opacity duration-500"
          style={{ opacity: progress < 0.04 ? 1 : 0 }}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/55">
            Desplazate
          </span>
          <div className="mx-auto mt-2 h-6 w-px bg-white/30" />
        </div>
      </div>
    </section>
  );
}

function StepOverlay({
  step,
  progress,
}: {
  step: ScrollStoryStep;
  progress: number;
}) {
  const { opacity, translate } = stepVisibility(progress, step.start, step.end);
  const align = step.align ?? "left";

  // Desktop alignment classes — vertical center, horizontal per align
  const alignCls =
    align === "right"
      ? "lg:justify-end"
      : align === "center"
      ? "lg:justify-center"
      : "lg:justify-start";

  const textAlignCls =
    align === "center" ? "lg:text-center" : "lg:text-left";

  return (
    <div
      className={`pointer-events-none absolute inset-0 flex items-end justify-center p-5 sm:p-8 lg:items-center lg:px-16 ${alignCls}`}
      style={{
        opacity,
        transform: `translate3d(0, ${translate}px, 0)`,
        transition: "opacity 0.1s linear",
      }}
    >
      <div
        className={`pointer-events-auto w-full max-w-md rounded-2xl border border-white/10 bg-black/45 p-5 backdrop-blur-md sm:p-6 lg:max-w-lg lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none ${textAlignCls}`}
        style={{
          // Soft local radial gradient under the text on desktop for readability
          backgroundImage:
            opacity > 0
              ? "radial-gradient(circle at 30% 40%, rgba(0,0,0,0.0), rgba(0,0,0,0.0))"
              : undefined,
        }}
      >
        {step.eyebrow && (
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#86EFAC] lg:text-[11px]">
            {step.eyebrow}
          </p>
        )}
        <h2 className="mt-3 text-xl font-bold leading-[1.15] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] sm:text-2xl lg:text-[2.25rem] lg:leading-[1.1]">
          {step.title}
        </h2>
        {step.text && (
          <p className="mt-3 text-sm leading-relaxed text-white/85 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] sm:text-base lg:mt-4 lg:max-w-md lg:text-lg">
            {step.text}
          </p>
        )}
        {step.cta && (
          <Link
            href={step.cta.href}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(22,163,74,0.3)] transition-colors hover:bg-[var(--color-accent-hover)]"
          >
            {step.cta.label}
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
