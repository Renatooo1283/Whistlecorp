"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

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

export type ScrollStoryCanvasProps = {
  frameCount: number;
  /** Single source — used if no desktop/mobile prefixes are provided. */
  framePrefix?: string;
  /** Path prefix for desktop frames. Used when viewport is >= mobileBreakpoint. */
  desktopFramePrefix?: string;
  /** Path prefix for mobile frames. Used when viewport is < mobileBreakpoint. */
  mobileFramePrefix?: string;
  /** Pixel width below which the mobile set is preferred. Default 768. */
  mobileBreakpoint?: number;
  /** Path suffix, e.g. ".webp" */
  frameSuffix?: string;
  /** Zero-padding length for the frame index, e.g. 4 for "0001". */
  framePadding?: number;
  /** Frame index of the first file (some sequences start at 0). Default 1. */
  frameStart?: number;
  sectionHeight?: string;
  steps: ScrollStoryStep[];
  ariaLabel?: string;
  /** Cap devicePixelRatio to avoid huge canvas buffers on retina screens. */
  maxDpr?: number;
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

function buildPaths(
  prefix: string,
  count: number,
  start: number,
  padding: number,
  suffix: string
) {
  const arr: string[] = new Array(count);
  for (let i = 0; i < count; i++) {
    arr[i] = `${prefix}${String(i + start).padStart(padding, "0")}${suffix}`;
  }
  return arr;
}

export function ScrollStoryCanvas({
  frameCount,
  framePrefix,
  desktopFramePrefix,
  mobileFramePrefix,
  mobileBreakpoint = 768,
  frameSuffix = ".webp",
  framePadding = 4,
  frameStart = 1,
  sectionHeight = "520vh",
  steps,
  ariaLabel = "Presentación visual de WhistleCorp",
  maxDpr = 2,
}: ScrollStoryCanvasProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [reducedMotion, setReducedMotion] = useState(false);
  const [progress, setProgress] = useState(0);
  const [firstFrameReady, setFirstFrameReady] = useState(false);
  // false = desktop, true = mobile. Set after mount to avoid hydration mismatch.
  const [isMobile, setIsMobile] = useState(false);

  // Resolved prefixes (with fallback to the single prop if specific ones missing)
  const dPrefix = desktopFramePrefix ?? framePrefix ?? "";
  const mPrefix = mobileFramePrefix ?? framePrefix ?? "";

  // Build paths for both sets. Memoize so identities stay stable across renders.
  const desktopPaths = useMemo(
    () => buildPaths(dPrefix, frameCount, frameStart, framePadding, frameSuffix),
    [dPrefix, frameCount, frameStart, framePadding, frameSuffix]
  );
  const mobilePaths = useMemo(
    () => buildPaths(mPrefix, frameCount, frameStart, framePadding, frameSuffix),
    [mPrefix, frameCount, frameStart, framePadding, frameSuffix]
  );

  // prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Track viewport for desktop/mobile frame set selection
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${mobileBreakpoint - 1}px)`);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [mobileBreakpoint]);

  // Active path set
  const paths = isMobile ? mobilePaths : desktopPaths;

  // Main effect: preload + scroll loop + draw.
  // Restarts when the path set changes (i.e., user crosses the mobile breakpoint).
  useEffect(() => {
    if (reducedMotion) return;
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    if (!paths[0]) return;

    // === local mutable state, scoped to this effect lifecycle ===
    const images: (HTMLImageElement | null)[] = new Array(frameCount).fill(
      null
    );
    const loaded: boolean[] = new Array(frameCount).fill(false);
    let targetIndex = 0;
    let lastDrawnIndex = -1;
    let rafId: number | null = null;
    let lastPriorityCenter = -1;
    let cancelledBg = false;

    const findNearestLoaded = (target: number): number => {
      for (let r = 0; r <= frameCount; r++) {
        const a = target - r;
        const b = target + r;
        if (a >= 0 && loaded[a]) return a;
        if (b < frameCount && loaded[b]) return b;
      }
      return -1;
    };

    const drawIndex = (i: number) => {
      const idxToDraw = loaded[i] ? i : findNearestLoaded(i);
      if (idxToDraw < 0) return;
      const img = images[idxToDraw];
      if (!img) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      // High-quality smoothing for upscaled / downscaled draws
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      if (!cw || !ch || !iw || !ih) return;
      const scale = Math.max(cw / iw, ch / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = (cw - dw) / 2;
      const dy = (ch - dh) / 2;
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, dx, dy, dw, dh);
      lastDrawnIndex = idxToDraw;
    };

    const loadFrame = (i: number, priority: "high" | "low" = "low") => {
      if (i < 0 || i >= frameCount) return;
      if (images[i]) return;
      const img = new Image();
      img.decoding = "async";
      try {
        (img as unknown as { fetchPriority?: string }).fetchPriority = priority;
      } catch {
        /* ignore */
      }
      img.onload = () => {
        loaded[i] = true;
        if (i === 0) setFirstFrameReady(true);
        if (targetIndex === i || lastDrawnIndex === -1) {
          drawIndex(targetIndex);
        }
      };
      img.onerror = () => {
        loaded[i] = false;
      };
      img.src = paths[i];
      images[i] = img;
    };

    const updatePriorityWindow = (center: number) => {
      if (Math.abs(center - lastPriorityCenter) < 4) return;
      lastPriorityCenter = center;
      for (let k = -4; k <= 8; k++) {
        loadFrame(center + k, "high");
      }
    };

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      const cssW = canvas.clientWidth;
      const cssH = canvas.clientHeight;
      const targetW = Math.round(cssW * dpr);
      const targetH = Math.round(cssH * dpr);
      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }
    };

    const update = () => {
      const s = sectionRef.current;
      if (!s) {
        rafId = null;
        return;
      }
      const rect = s.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrollable = s.offsetHeight - vh;
      const scrolled = -rect.top;
      const p =
        scrollable > 0 ? Math.max(0, Math.min(1, scrolled / scrollable)) : 0;
      const idx = Math.round(p * (frameCount - 1));
      targetIndex = idx;
      updatePriorityWindow(idx);
      if (idx !== lastDrawnIndex) {
        drawIndex(idx);
      }
      setProgress(p);
      rafId = requestAnimationFrame(update);
    };

    // Initial preload: frame 0 + first 12 frames at high priority
    loadFrame(0, "high");
    for (let i = 1; i < Math.min(12, frameCount); i++) loadFrame(i, "high");

    // Background load of the rest, throttled
    (async () => {
      for (let i = 12; i < frameCount; i++) {
        if (cancelledBg) return;
        loadFrame(i, "low");
        await new Promise<void>((r) => setTimeout(r, 12));
      }
    })();

    resizeCanvas();
    rafId = requestAnimationFrame(update);

    const onScroll = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(update);
      }
    };
    const onResize = () => {
      resizeCanvas();
      drawIndex(targetIndex);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      cancelledBg = true;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      // Reset firstFrameReady when source set changes so the loader shows briefly
      // until the first frame of the new set lands.
      // (set on next tick to avoid re-running this effect right away)
    };
  }, [frameCount, paths, reducedMotion, maxDpr]);

  return (
    <section
      ref={sectionRef}
      aria-label={ariaLabel}
      style={{ height: sectionHeight }}
      className="relative w-full bg-[var(--color-ink)]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 block h-full w-full"
        />

        {!firstFrameReady && !reducedMotion && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 animate-pulse rounded-full border border-white/20 bg-white/5" />
          </div>
        )}

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 via-black/10 to-black/40"
        />

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
