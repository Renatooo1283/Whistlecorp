"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

// ────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────

export type ScrollStorySceneText = {
  eyebrow?: string;
  title: string;
  text?: string;
  align?: "left" | "right" | "center";
  cta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  /** "hero" uses larger typography and no card. */
  variant?: "scene" | "hero";
};

export type ScrollStoryScene = {
  /** Progress [0..1] at which this scene's overlay starts appearing. */
  start: number;
  /** Progress [0..1] at which this scene's overlay disappears. */
  end: number;
  /** Optional overlay; omit for pure frame-only sections. */
  step?: ScrollStorySceneText;
};

export type ScrollStoryCanvasProps = {
  frameCount: number;
  scenes: ScrollStoryScene[];
  desktopFramePrefix?: string;
  mobileFramePrefix?: string;
  framePrefix?: string;
  mobileBreakpoint?: number;
  frameSuffix?: string;
  framePadding?: number;
  frameStart?: number;
  ariaLabel?: string;
  /** Cap devicePixelRatio to avoid huge canvas buffers on retina screens. */
  maxDpr?: number;
  /**
   * Total scrollable section height. The actual scroll range that drives
   * the animation is `sectionHeight - viewport_height`.
   */
  sectionHeight?: string;
  /** Exclude a frame range (1-indexed, inclusive). */
  excludeFrameRange?: { start: number; end: number };
  /**
   * Above this progress value the canvas freezes at the last curated frame.
   * Default 0.78 → the last 22% of the scroll holds the final logo on screen.
   */
  finalFreezeAt?: number;
};

// ────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────

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

const FADE_WINDOW = 0.025;

function overlayVisibility(progress: number, start: number, end: number) {
  let opacity = 0;
  let translate = 16;
  if (progress < start) {
    opacity = 0;
    translate = 16;
  } else if (progress < start + FADE_WINDOW) {
    const t = (progress - start) / FADE_WINDOW;
    opacity = t;
    translate = 16 - 16 * t;
  } else if (progress < end - FADE_WINDOW) {
    opacity = 1;
    translate = 0;
  } else if (progress < end) {
    const t = (progress - (end - FADE_WINDOW)) / FADE_WINDOW;
    opacity = 1 - t;
    translate = -10 * t;
  }
  return { opacity, translate };
}

// ────────────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────────────

export function ScrollStoryCanvas({
  frameCount,
  scenes,
  framePrefix,
  desktopFramePrefix,
  mobileFramePrefix,
  mobileBreakpoint = 768,
  frameSuffix = ".webp",
  framePadding = 4,
  frameStart = 1,
  ariaLabel = "Presentación visual de WhistleCorp",
  maxDpr = 2,
  sectionHeight = "360vh",
  excludeFrameRange,
  finalFreezeAt = 0.78,
}: ScrollStoryCanvasProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [firstFrameReady, setFirstFrameReady] = useState(false);
  const [progress, setProgress] = useState(0);

  // === Build paths ====================================================
  const dPrefix = desktopFramePrefix ?? framePrefix ?? "";
  const mPrefix = mobileFramePrefix ?? framePrefix ?? "";
  const desktopPaths = useMemo(
    () => buildPaths(dPrefix, frameCount, frameStart, framePadding, frameSuffix),
    [dPrefix, frameCount, frameStart, framePadding, frameSuffix]
  );
  const mobilePaths = useMemo(
    () => buildPaths(mPrefix, frameCount, frameStart, framePadding, frameSuffix),
    [mPrefix, frameCount, frameStart, framePadding, frameSuffix]
  );
  const paths = isMobile ? mobilePaths : desktopPaths;

  // === Curated frames =================================================
  const curatedFrames = useMemo(() => {
    const arr: number[] = [];
    if (!excludeFrameRange) {
      for (let i = 0; i < frameCount; i++) arr.push(i);
      return arr;
    }
    const sIdx = excludeFrameRange.start - frameStart;
    const eIdx = excludeFrameRange.end - frameStart;
    for (let i = 0; i < frameCount; i++) {
      if (i >= sIdx && i <= eIdx) continue;
      arr.push(i);
    }
    if (arr.length === 0) {
      for (let i = 0; i < frameCount; i++) arr.push(i);
    }
    return arr;
  }, [frameCount, frameStart, excludeFrameRange]);

  // === prefers-reduced-motion =========================================
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // === Viewport breakpoint ============================================
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${mobileBreakpoint - 1}px)`);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [mobileBreakpoint]);

  // === Main effect: passive scroll → frame ============================
  useEffect(() => {
    if (reducedMotion) return;
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    if (!paths[0] || curatedFrames.length === 0) return;

    const images: (HTMLImageElement | null)[] = new Array(frameCount).fill(
      null
    );
    const loaded: boolean[] = new Array(frameCount).fill(false);
    let lastDrawnIndex = -1;
    let rafScheduled = false;
    let cancelledBg = false;

    const lastCuratedPos = Math.max(0, curatedFrames.length - 1);

    // ── Find nearest already-loaded frame as fallback ──
    const findNearestLoaded = (curatedPos: number) => {
      const p = Math.max(0, Math.min(lastCuratedPos, Math.round(curatedPos)));
      for (let r = 0; r <= curatedFrames.length; r++) {
        const a = p - r;
        const b = p + r;
        if (a >= 0) {
          const fi = curatedFrames[a];
          if (loaded[fi]) return fi;
        }
        if (b <= lastCuratedPos) {
          const fi = curatedFrames[b];
          if (loaded[fi]) return fi;
        }
      }
      return -1;
    };

    const drawCuratedPos = (curatedPos: number) => {
      const p = Math.max(0, Math.min(lastCuratedPos, Math.round(curatedPos)));
      const realIdx = curatedFrames[p];
      const idxToDraw = loaded[realIdx]
        ? realIdx
        : findNearestLoaded(p);
      if (idxToDraw < 0) return;
      const img = images[idxToDraw];
      if (!img) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
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

    const loadFrame = (realIdx: number, priority: "high" | "low" = "low") => {
      if (realIdx < 0 || realIdx >= frameCount) return;
      if (images[realIdx]) return;
      const img = new Image();
      img.decoding = "async";
      try {
        (img as unknown as { fetchPriority?: string }).fetchPriority = priority;
      } catch {
        /* noop */
      }
      img.onload = () => {
        loaded[realIdx] = true;
        if (realIdx === curatedFrames[0]) setFirstFrameReady(true);
        // If the just-loaded frame is the one we wanted, paint it
        if (lastDrawnIndex === -1 || realIdx === lastDrawnIndex) {
          requestTick();
        }
      };
      img.onerror = () => {
        loaded[realIdx] = false;
      };
      img.src = paths[realIdx];
      images[realIdx] = img;
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

    // ── Scroll-driven progress (single source of truth) ──
    const computeProgress = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const navbarH = window.innerWidth >= mobileBreakpoint ? 72 : 64;
      const scrollable = Math.max(1, section.offsetHeight - (vh - navbarH));
      // sticky activates when rect.top crosses navbarH (going up)
      const scrolled = Math.max(0, navbarH - rect.top);
      return Math.max(0, Math.min(1, scrolled / scrollable));
    };

    // ── RAF tick: read progress, paint, update overlays ──
    const tick = () => {
      rafScheduled = false;
      const p = computeProgress();
      // Frame mapping: linear up to finalFreezeAt, then frozen at last frame.
      const frameProgress = Math.min(p / finalFreezeAt, 1);
      const targetPos = Math.round(frameProgress * lastCuratedPos);

      // Preload window around target (4 back, 8 ahead) — keeps it smooth on
      // fast drags without hammering the network upfront.
      const lo = Math.max(0, targetPos - 4);
      const hi = Math.min(lastCuratedPos, targetPos + 8);
      for (let i = lo; i <= hi; i++) {
        loadFrame(curatedFrames[i], "high");
      }

      const realIdx = curatedFrames[targetPos];
      if (realIdx !== lastDrawnIndex) {
        drawCuratedPos(targetPos);
      }

      setProgress(p);
    };

    const requestTick = () => {
      if (!rafScheduled) {
        rafScheduled = true;
        requestAnimationFrame(tick);
      }
    };

    const onScroll = () => requestTick();
    const onResize = () => {
      resizeCanvas();
      requestTick();
    };

    // ── Initial preload ──
    if (curatedFrames.length > 0) {
      // First 12 frames + last frame (logo) with high priority
      for (let p = 0; p < Math.min(12, curatedFrames.length); p++) {
        loadFrame(curatedFrames[p], "high");
      }
      loadFrame(curatedFrames[lastCuratedPos], "high");
      // Background load the rest
      (async () => {
        for (let p = 12; p < curatedFrames.length - 1; p++) {
          if (cancelledBg) return;
          loadFrame(curatedFrames[p], "low");
          await new Promise<void>((r) => setTimeout(r, 12));
        }
      })();
    }

    resizeCanvas();
    requestTick();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      cancelledBg = true;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [
    frameCount,
    paths,
    curatedFrames,
    reducedMotion,
    maxDpr,
    mobileBreakpoint,
    finalFreezeAt,
  ]);

  return (
    <section
      ref={sectionRef}
      aria-label={ariaLabel}
      style={{ height: sectionHeight }}
      className="relative w-full bg-[var(--color-ink)]"
    >
      {/* Sticky inner: lives inside the tall section. Top offset matches the
          navbar (h-16 on mobile, h-[72px] from md). */}
      <div className="sticky top-16 h-[calc(100dvh-64px)] w-full overflow-hidden md:top-[72px] md:h-[calc(100dvh-72px)]">
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
              {scenes
                .filter((s) => s.step)
                .map((s, i) => (
                  <div
                    key={i}
                    className={i > 0 ? "mt-6 border-t border-white/10 pt-6" : ""}
                  >
                    {s.step!.eyebrow && (
                      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#86EFAC]">
                        {s.step!.eyebrow}
                      </p>
                    )}
                    <h2 className="mt-2 text-xl font-semibold leading-snug text-white sm:text-2xl">
                      {s.step!.title}
                    </h2>
                    {s.step!.text && (
                      <p className="mt-2 text-sm leading-relaxed text-white/75">
                        {s.step!.text}
                      </p>
                    )}
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      {s.step!.cta && (
                        <Link
                          href={s.step!.cta.href}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#86EFAC] hover:text-white"
                        >
                          {s.step!.cta.label}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      )}
                      {s.step!.secondaryCta && (
                        <Link
                          href={s.step!.secondaryCta.href}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/75 hover:text-white"
                        >
                          {s.step!.secondaryCta.label}
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          scenes.map((s, i) =>
            s.step ? (
              <SceneOverlay
                key={i}
                step={s.step}
                start={s.start}
                end={s.end}
                progress={progress}
              />
            ) : null
          )
        )}
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────
// SceneOverlay — driven by `progress` against `start`/`end`
// ────────────────────────────────────────────────────────────────────

function SceneOverlay({
  step,
  start,
  end,
  progress,
}: {
  step: ScrollStorySceneText;
  start: number;
  end: number;
  progress: number;
}) {
  const align = step.align ?? "left";
  const isHero = step.variant === "hero";
  const { opacity, translate } = overlayVisibility(progress, start, end);
  const isActive = opacity > 0.01;

  const alignCls =
    align === "right"
      ? "lg:justify-end"
      : align === "center"
      ? "lg:justify-center"
      : "lg:justify-start";

  const textAlignCls =
    align === "center" ? "text-center" : "lg:text-left";

  const flexAlignCls =
    isHero || align === "center"
      ? "items-center"
      : "items-end lg:items-center";

  const ctaContainerCls =
    align === "center" || isHero
      ? "mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4 lg:mt-7"
      : "mt-6 flex flex-wrap items-center gap-3 lg:mt-7";

  const cardCls = isHero
    ? "w-full max-w-[640px] text-center"
    : "w-full max-w-md rounded-2xl border border-white/10 bg-black/45 p-5 backdrop-blur-md sm:p-6 lg:max-w-lg lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none";

  const titleCls = isHero
    ? "mt-4 text-[24px] font-bold leading-[1.12] tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)] sm:text-[28px] md:text-[34px] lg:text-[40px] lg:leading-[1.08]"
    : "mt-3 text-xl font-bold leading-[1.15] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] sm:text-2xl lg:text-[2.25rem] lg:leading-[1.1]";

  const textCls = isHero
    ? "mx-auto mt-5 max-w-[520px] text-sm leading-relaxed text-white/85 drop-shadow-[0_1px_3px_rgba(0,0,0,0.65)] sm:text-base"
    : align === "center"
    ? "mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/85 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] sm:text-base lg:mt-4 lg:text-lg"
    : "mt-3 text-sm leading-relaxed text-white/85 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] sm:text-base lg:mt-4 lg:max-w-md lg:text-lg";

  const heroBgStyle: React.CSSProperties | undefined = isHero
    ? {
        background:
          "radial-gradient(ellipse 60% 50% at center, rgba(5,15,25,0.55) 0%, rgba(5,15,25,0.25) 45%, rgba(5,15,25,0) 75%)",
      }
    : undefined;

  return (
    <div
      aria-hidden={!isActive}
      style={{
        opacity,
        transform: `translate3d(0, ${translate}px, 0)`,
        transition: "opacity 0.1s linear",
        ...heroBgStyle,
      }}
      className={`pointer-events-none absolute inset-0 flex ${flexAlignCls} justify-center p-5 sm:p-8 lg:px-16 ${alignCls}`}
    >
      <div
        className={`${isActive ? "pointer-events-auto" : ""} ${cardCls} ${textAlignCls}`}
      >
        {step.eyebrow && (
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#86EFAC] lg:text-[11px]">
            {step.eyebrow}
          </p>
        )}
        <h2 className={titleCls}>{step.title}</h2>
        {step.text && <p className={textCls}>{step.text}</p>}
        {(step.cta || step.secondaryCta) && (
          <div className={ctaContainerCls}>
            {step.cta && (
              <Link
                href={step.cta.href}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-[var(--color-accent)] px-6 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)]"
              >
                {step.cta.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
            {step.secondaryCta && (
              <Link
                href={step.secondaryCta.href}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-white/35 px-6 text-sm font-semibold text-white transition-colors hover:border-white/60 hover:bg-white/5"
              >
                {step.secondaryCta.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
