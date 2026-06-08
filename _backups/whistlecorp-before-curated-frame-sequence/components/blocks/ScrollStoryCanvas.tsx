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
  /** Optional second CTA, rendered as an outline button next to the primary. */
  secondaryCta?: { label: string; href: string };
  /**
   * Visual treatment. "hero" uses a larger title + body and shows the CTAs
   * even when the scene is the intro of the section. Default is "scene".
   */
  variant?: "scene" | "hero";
};

export type ScrollStoryScene = {
  /** Frame progress this scene maps to, in [0, 1]. */
  frameProgress: number;
  /** Optional overlay text for this scene. The intro scene can omit it. */
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
  /** Duration of the eased frame transition between scenes (ms). Default 600. */
  transitionMs?: number;
  /** Minimum time between accepted gestures (ms). Default 700. */
  cooldownMs?: number;
  /**
   * Section height. Default fills the viewport below the sticky navbar.
   * Use this when integrating in pages with different chrome.
   */
  sectionHeight?: string;
};

// ────────────────────────────────────────────────────────────────────
// Constants
// ────────────────────────────────────────────────────────────────────

const WHEEL_THRESHOLD = 8; // ignore micro trackpad movements
const TOUCH_THRESHOLD = 40; // minimum swipe distance in px
const PIN_ZONE_TOP = 0.3; // section top within 30% of viewport height = "pinned"
const PIN_ZONE_BOTTOM = 0.5; // section bottom needs to extend past 50% of viewport

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

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
  transitionMs = 600,
  cooldownMs = 700,
  sectionHeight,
}: ScrollStoryCanvasProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  /** Persists current scene index across effect re-runs (e.g. viewport switch). */
  const currentSceneRef = useRef(0);

  const [reducedMotion, setReducedMotion] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [firstFrameReady, setFirstFrameReady] = useState(false);

  // Path sets ─ build once per prop set
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

  // Map each scene → target frame index (computed once)
  const sceneFrames = useMemo(
    () =>
      scenes.map((s) =>
        Math.min(
          frameCount - 1,
          Math.max(0, Math.round(s.frameProgress * (frameCount - 1)))
        )
      ),
    [scenes, frameCount]
  );
  const lastScene = scenes.length - 1;

  // prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Viewport breakpoint
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${mobileBreakpoint - 1}px)`);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [mobileBreakpoint]);

  // === Main effect: image loading + scene transitions + gesture capture ===
  useEffect(() => {
    if (reducedMotion) return;
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    if (!paths[0]) return;

    // ── Mutable state scoped to the effect ──
    const images: (HTMLImageElement | null)[] = new Array(frameCount).fill(
      null
    );
    const loaded: boolean[] = new Array(frameCount).fill(false);
    // Restore from previous run (e.g. viewport switch); default to 0 on mount.
    let currentSceneIdx = Math.min(currentSceneRef.current, lastScene);
    let displayedFrame = sceneFrames[currentSceneIdx] ?? 0;
    let lastDrawnIndex = -1;
    let transitionRaf: number | null = null;
    let lastGestureTime = 0;
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
        if (Math.round(displayedFrame) === i || lastDrawnIndex === -1) {
          drawIndex(Math.round(displayedFrame));
        }
      };
      img.onerror = () => {
        loaded[i] = false;
      };
      img.src = paths[i];
      images[i] = img;
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

    // === scene transition (eased frame interpolation) ===
    const goToScene = (nextScene: number) => {
      if (nextScene < 0 || nextScene > lastScene) return;
      if (nextScene === currentSceneIdx) return;
      currentSceneIdx = nextScene;
      currentSceneRef.current = nextScene;
      setCurrentScene(nextScene);

      // Preload frames in the upcoming range with high priority
      const fromFrame = displayedFrame;
      const toFrame = sceneFrames[nextScene];
      const lo = Math.min(fromFrame, toFrame);
      const hi = Math.max(fromFrame, toFrame);
      for (let i = lo; i <= hi; i++) loadFrame(i, "high");

      // Cancel any running transition and start a new one
      if (transitionRaf !== null) {
        cancelAnimationFrame(transitionRaf);
        transitionRaf = null;
      }
      const startTime = performance.now();
      const startFrame = displayedFrame;
      const endFrame = toFrame;

      const tick = () => {
        const elapsed = performance.now() - startTime;
        const t = Math.min(elapsed / transitionMs, 1);
        const eased = easeInOutCubic(t);
        const frame = startFrame + (endFrame - startFrame) * eased;
        displayedFrame = frame;
        const rounded = Math.round(frame);
        if (rounded !== lastDrawnIndex) drawIndex(rounded);
        if (t < 1) {
          transitionRaf = requestAnimationFrame(tick);
        } else {
          transitionRaf = null;
          displayedFrame = endFrame;
        }
      };
      transitionRaf = requestAnimationFrame(tick);
    };

    // === Pin zone check (is the section centered enough to capture gestures?) ===
    const isPinned = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      return rect.top <= vh * PIN_ZONE_TOP && rect.bottom >= vh * PIN_ZONE_BOTTOM;
    };

    const snapToSection = () => {
      const rect = section.getBoundingClientRect();
      if (Math.abs(rect.top) > 8) {
        window.scrollTo({
          top: window.scrollY + rect.top,
          behavior: "smooth",
        });
      }
    };

    // === Wheel handler ===
    const onWheel = (e: WheelEvent) => {
      if (!isPinned()) return;
      if (Math.abs(e.deltaY) < WHEEL_THRESHOLD) return;

      const dir = e.deltaY > 0 ? 1 : -1;
      const canConsume =
        (dir > 0 && currentSceneIdx < lastScene) ||
        (dir < 0 && currentSceneIdx > 0);

      if (!canConsume) {
        // Let scroll pass naturally → user exits the section
        return;
      }

      // Always preventDefault when we can consume, even during cooldown,
      // so multiple small wheel ticks don't accidentally scroll the page.
      e.preventDefault();

      const now = performance.now();
      if (now - lastGestureTime < cooldownMs) return;
      lastGestureTime = now;

      snapToSection();
      goToScene(currentSceneIdx + dir);
    };

    // === Touch handlers ===
    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (!isPinned()) return;
      touchStartY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isPinned()) return;
      const deltaY = touchStartY - e.touches[0].clientY;
      const dir = deltaY > 0 ? 1 : -1;
      const canConsume =
        (dir > 0 && currentSceneIdx < lastScene) ||
        (dir < 0 && currentSceneIdx > 0);
      if (canConsume && Math.abs(deltaY) > 6) e.preventDefault();
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (!isPinned()) return;
      const endY = e.changedTouches[0]?.clientY ?? touchStartY;
      const deltaY = touchStartY - endY;
      if (Math.abs(deltaY) < TOUCH_THRESHOLD) return;

      const now = performance.now();
      if (now - lastGestureTime < cooldownMs) return;

      const dir = deltaY > 0 ? 1 : -1;
      const canConsume =
        (dir > 0 && currentSceneIdx < lastScene) ||
        (dir < 0 && currentSceneIdx > 0);
      if (!canConsume) return;

      lastGestureTime = now;
      snapToSection();
      goToScene(currentSceneIdx + dir);
    };

    // === Keyboard handler ===
    const onKey = (e: KeyboardEvent) => {
      if (!isPinned()) return;
      const isNext = e.key === "ArrowDown" || e.key === "PageDown";
      const isPrev = e.key === "ArrowUp" || e.key === "PageUp";
      if (!isNext && !isPrev) return;

      const dir = isNext ? 1 : -1;
      const canConsume =
        (dir > 0 && currentSceneIdx < lastScene) ||
        (dir < 0 && currentSceneIdx > 0);
      if (!canConsume) return;

      e.preventDefault();
      const now = performance.now();
      if (now - lastGestureTime < cooldownMs) return;
      lastGestureTime = now;
      snapToSection();
      goToScene(currentSceneIdx + dir);
    };

    // === When the section leaves the viewport, preset scene for re-entry ===
    let lastScrollY = window.scrollY;
    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrollDir = window.scrollY > lastScrollY ? "down" : "up";
      lastScrollY = window.scrollY;

      if (rect.bottom < 0) {
        // User has passed the section completely going down → preset to last scene
        if (currentSceneIdx !== lastScene) {
          currentSceneIdx = lastScene;
          currentSceneRef.current = lastScene;
          displayedFrame = sceneFrames[lastScene];
          setCurrentScene(lastScene);
          drawIndex(sceneFrames[lastScene]);
        }
      } else if (rect.top > vh) {
        // User above the section → preset to first scene
        if (currentSceneIdx !== 0) {
          currentSceneIdx = 0;
          currentSceneRef.current = 0;
          displayedFrame = sceneFrames[0];
          setCurrentScene(0);
          drawIndex(sceneFrames[0]);
        }
      }
      // Avoid unused-variable lint without changing behavior
      void scrollDir;
    };

    // === Initial preload ===
    loadFrame(0, "high");
    for (let i = 1; i < Math.min(12, frameCount); i++) loadFrame(i, "high");
    (async () => {
      for (let i = 12; i < frameCount; i++) {
        if (cancelledBg) return;
        loadFrame(i, "low");
        await new Promise<void>((r) => setTimeout(r, 12));
      }
    })();

    // Setup
    resizeCanvas();
    drawIndex(Math.round(displayedFrame));

    const onResize = () => {
      resizeCanvas();
      drawIndex(Math.round(displayedFrame));
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      cancelledBg = true;
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (transitionRaf !== null) {
        cancelAnimationFrame(transitionRaf);
        transitionRaf = null;
      }
    };
  }, [
    frameCount,
    paths,
    sceneFrames,
    lastScene,
    reducedMotion,
    maxDpr,
    transitionMs,
    cooldownMs,
  ]);

  return (
    <section
      ref={sectionRef}
      aria-label={ariaLabel}
      style={sectionHeight ? { height: sectionHeight } : undefined}
      className={`relative w-full overflow-hidden bg-[var(--color-ink)] ${
        sectionHeight
          ? ""
          : "h-[calc(100dvh-64px)] md:h-[calc(100dvh-72px)]"
      }`}
    >
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
              active={i === currentScene}
            />
          ) : null
        )
      )}

      {/* Scroll hint — only on the intro scene and only if scene 0 has no overlay */}
      {!scenes[0]?.step && (
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-center transition-opacity duration-500"
          style={{ opacity: currentScene === 0 ? 1 : 0 }}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/55">
            Desplazate
          </span>
          <div className="mx-auto mt-2 h-6 w-px bg-white/30" />
        </div>
      )}
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────
// SceneOverlay — CSS-animated entry/exit per scene
// ────────────────────────────────────────────────────────────────────

function SceneOverlay({
  step,
  active,
}: {
  step: ScrollStorySceneText;
  active: boolean;
}) {
  const align = step.align ?? "left";
  const isHero = step.variant === "hero";

  const alignCls =
    align === "right"
      ? "lg:justify-end"
      : align === "center"
      ? "lg:justify-center"
      : "lg:justify-start";

  const textAlignCls =
    align === "center" ? "lg:text-center" : "lg:text-left";

  const flexAlignCls = isHero ? "items-center" : "items-end lg:items-center";

  // For hero variant, the card stays even on desktop (over a denser gradient)
  // and uses a bigger container width.
  const cardCls = isHero
    ? "w-full max-w-xl rounded-2xl border border-white/10 bg-black/55 p-6 backdrop-blur-md sm:p-8 lg:max-w-2xl lg:bg-black/40 lg:p-10"
    : "w-full max-w-md rounded-2xl border border-white/10 bg-black/45 p-5 backdrop-blur-md sm:p-6 lg:max-w-lg lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none";

  const titleCls = isHero
    ? "mt-4 text-3xl font-bold leading-[1.05] tracking-tight text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)] sm:text-4xl lg:text-[3rem]"
    : "mt-3 text-xl font-bold leading-[1.15] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] sm:text-2xl lg:text-[2.25rem] lg:leading-[1.1]";

  const textCls = isHero
    ? "mt-4 text-base leading-relaxed text-white/85 drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)] sm:text-lg lg:mt-5 lg:max-w-xl lg:text-lg"
    : "mt-3 text-sm leading-relaxed text-white/85 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] sm:text-base lg:mt-4 lg:max-w-md lg:text-lg";

  return (
    <div
      aria-hidden={!active}
      className={`pointer-events-none absolute inset-0 flex ${flexAlignCls} justify-center p-5 transition-all duration-500 ease-out sm:p-8 lg:px-16 ${alignCls} ${
        active
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <div
        className={`${active ? "pointer-events-auto" : ""} ${cardCls} ${textAlignCls}`}
      >
        {step.eyebrow && (
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#86EFAC] lg:text-[11px]">
            {step.eyebrow}
          </p>
        )}
        <h2 className={titleCls}>{step.title}</h2>
        {step.text && <p className={textCls}>{step.text}</p>}
        {(step.cta || step.secondaryCta) && (
          <div className="mt-6 flex flex-wrap items-center gap-3 lg:mt-7">
            {step.cta && (
              <Link
                href={step.cta.href}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(22,163,74,0.3)] transition-colors hover:bg-[var(--color-accent-hover)]"
              >
                {step.cta.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
            {step.secondaryCta && (
              <Link
                href={step.secondaryCta.href}
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:border-white/50 hover:bg-white/10"
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
