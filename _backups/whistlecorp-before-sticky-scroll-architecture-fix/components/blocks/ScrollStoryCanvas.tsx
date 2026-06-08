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
  /**
   * Duration of the transition into the last scene (ms). Useful for holding
   * the final logo on screen longer. Defaults to `transitionMs`.
   */
  lastSceneTransitionMs?: number;
  /** Minimum time between accepted gestures (ms). Default 700. */
  cooldownMs?: number;
  /**
   * Section height. Default fills the viewport below the sticky navbar.
   * Use this when integrating in pages with different chrome.
   */
  sectionHeight?: string;
  /**
   * Exclude a range of frame numbers (1-indexed, inclusive) from the sequence.
   * Useful to skip visually-incomplete frames so the user can never stop on them.
   * Example: { start: 1, end: 40 } keeps only frames 41..frameCount.
   */
  excludeFrameRange?: { start: number; end: number };
  /**
   * Same as `excludeFrameRange` but supports multiple non-contiguous ranges.
   * If both are provided, `excludeFrameRanges` is used and `excludeFrameRange` ignored.
   * Example: [{ start:1, end:40 }, { start:59, end:70 }] keeps 41..58 + 71..frameCount.
   * When a scene transition would cross one of these "gaps", the component
   * crossfades between the last clean frame before and the first clean frame
   * after the gap instead of interpolating through skipped frames.
   */
  excludeFrameRanges?: Array<{ start: number; end: number }>;
  /**
   * Duration of the crossfade applied when a scene transition crosses a gap
   * created by excludeFrameRanges. Default 350 ms.
   */
  crossfadeMs?: number;
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
  lastSceneTransitionMs,
  cooldownMs = 700,
  sectionHeight,
  excludeFrameRange,
  excludeFrameRanges,
  crossfadeMs = 350,
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

  // === Curated frames (skip explosive/transition frames so the user
  //     can never stop on them) ============================================
  // `curatedFrames` is an array of 0-based frame indices to use, in order.
  // The component does all positional math in "curated space" so excluded
  // frames are never drawn during a transition.
  const effectiveExcludeRanges = useMemo(() => {
    if (excludeFrameRanges && excludeFrameRanges.length > 0) return excludeFrameRanges;
    if (excludeFrameRange) return [excludeFrameRange];
    return [];
  }, [excludeFrameRange, excludeFrameRanges]);

  const curatedFrames = useMemo(() => {
    const arr: number[] = [];
    if (effectiveExcludeRanges.length === 0) {
      for (let i = 0; i < frameCount; i++) arr.push(i);
      return arr;
    }
    const isExcluded = (i: number) => {
      for (const r of effectiveExcludeRanges) {
        const s = r.start - frameStart;
        const e = r.end - frameStart;
        if (i >= s && i <= e) return true;
      }
      return false;
    };
    for (let i = 0; i < frameCount; i++) {
      if (isExcluded(i)) continue;
      arr.push(i);
    }
    // Safety fallback in case all frames were excluded
    if (arr.length === 0) {
      for (let i = 0; i < frameCount; i++) arr.push(i);
    }
    return arr;
  }, [frameCount, frameStart, effectiveExcludeRanges]);

  // Positions (in curated space) immediately BEFORE a gap to a non-contiguous
  // next frame. Useful to detect when a scene transition crosses a gap so we
  // can play a crossfade instead of interpolating through skipped frames.
  const gapPositions = useMemo(() => {
    const gaps: number[] = [];
    for (let i = 0; i < curatedFrames.length - 1; i++) {
      if (curatedFrames[i + 1] - curatedFrames[i] > 1) gaps.push(i);
    }
    return gaps;
  }, [curatedFrames]);

  // Map each scene → its position within the curated sequence.
  const sceneCuratedPositions = useMemo(() => {
    const last = Math.max(0, curatedFrames.length - 1);
    return scenes.map((s) =>
      Math.min(last, Math.max(0, Math.round(s.frameProgress * last)))
    );
  }, [scenes, curatedFrames.length]);
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
    if (curatedFrames.length === 0) return;

    // ── Mutable state scoped to the effect ──
    // `images`/`loaded` are indexed by the REAL frame index (0..frameCount-1).
    // All positional math (displayedCuratedPos, scene targets, transitions)
    // happens in "curated space" so excluded frames are never rendered.
    const images: (HTMLImageElement | null)[] = new Array(frameCount).fill(
      null
    );
    const loaded: boolean[] = new Array(frameCount).fill(false);
    const lastCuratedPos = Math.max(0, curatedFrames.length - 1);

    let currentSceneIdx = Math.min(currentSceneRef.current, lastScene);
    let displayedCuratedPos =
      sceneCuratedPositions[currentSceneIdx] ?? 0;
    let lastDrawnIndex = -1;
    let transitionRaf: number | null = null;
    let lastGestureTime = 0;
    let cancelledBg = false;

    // Search nearest LOADED frame within the curated set, returning the real
    // frame index. We walk outward from a curated position so we never return
    // an excluded frame.
    const findNearestLoadedFromCuratedPos = (
      curatedPos: number
    ): number => {
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
        : findNearestLoadedFromCuratedPos(p);
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
        /* ignore */
      }
      img.onload = () => {
        loaded[realIdx] = true;
        // Mark first frame ready when the FIRST curated frame loads
        if (realIdx === curatedFrames[0]) setFirstFrameReady(true);
        // If the just-loaded frame is what we want on screen, paint it
        const wanted = curatedFrames[Math.round(displayedCuratedPos)];
        if (wanted === realIdx || lastDrawnIndex === -1) {
          drawCuratedPos(displayedCuratedPos);
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

    // Draw two frames blended with complementary alpha (used for crossfade)
    const drawCrossfade = (
      fromRealIdx: number,
      toRealIdx: number,
      t: number
    ) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      const cw = canvas.width;
      const ch = canvas.height;
      if (!cw || !ch) return;

      ctx.clearRect(0, 0, cw, ch);

      const drawCover = (img: HTMLImageElement) => {
        const iw = img.naturalWidth;
        const ih = img.naturalHeight;
        if (!iw || !ih) return;
        const scale = Math.max(cw / iw, ch / ih);
        const dw = iw * scale;
        const dh = ih * scale;
        const dx = (cw - dw) / 2;
        const dy = (ch - dh) / 2;
        ctx.drawImage(img, dx, dy, dw, dh);
      };

      const fromImg = images[fromRealIdx];
      const toImg = images[toRealIdx];

      // Draw the FROM frame full alpha first
      if (fromImg && loaded[fromRealIdx]) {
        ctx.globalAlpha = 1;
        drawCover(fromImg);
      }
      // Draw the TO frame with rising alpha on top
      if (toImg && loaded[toRealIdx]) {
        ctx.globalAlpha = t;
        drawCover(toImg);
      }
      ctx.globalAlpha = 1;
      lastDrawnIndex = t >= 0.5 ? toRealIdx : fromRealIdx;
    };

    // True if a transition between two curated positions would cross at
    // least one of the curated-space "gaps".
    const transitionCrossesGap = (a: number, b: number) => {
      const lo = Math.min(a, b);
      const hi = Math.max(a, b);
      for (const g of gapPositions) {
        if (g >= Math.floor(lo) && g < Math.ceil(hi)) return true;
      }
      return false;
    };

    // === Scene transition ===
    const goToScene = (nextScene: number) => {
      if (nextScene < 0 || nextScene > lastScene) return;
      if (nextScene === currentSceneIdx) return;
      currentSceneIdx = nextScene;
      currentSceneRef.current = nextScene;
      setCurrentScene(nextScene);

      const startPos = displayedCuratedPos;
      const endPos = sceneCuratedPositions[nextScene];

      if (transitionRaf !== null) {
        cancelAnimationFrame(transitionRaf);
        transitionRaf = null;
      }

      // ── A) Transition crosses a gap → CROSSFADE between last clean frame
      //      before the gap and first clean frame after the gap. We never
      //      render any of the skipped fragmented frames. ───────────────────
      if (transitionCrossesGap(startPos, endPos)) {
        const startRealIdx = curatedFrames[Math.round(startPos)];
        const endRealIdx = curatedFrames[Math.round(endPos)];
        loadFrame(startRealIdx, "high");
        loadFrame(endRealIdx, "high");

        const duration = crossfadeMs;
        const startTime = performance.now();

        const tick = () => {
          const elapsed = performance.now() - startTime;
          const t = Math.min(elapsed / duration, 1);
          const eased = easeInOutCubic(t);
          drawCrossfade(startRealIdx, endRealIdx, eased);
          if (t < 1) {
            transitionRaf = requestAnimationFrame(tick);
          } else {
            transitionRaf = null;
            displayedCuratedPos = endPos;
            // Final clean draw of the destination frame at full alpha
            drawCuratedPos(endPos);
          }
        };
        transitionRaf = requestAnimationFrame(tick);
        return;
      }

      // ── B) Transition stays within a contiguous range → standard eased
      //      interpolation through all curated frames between start and end.
      const lo = Math.min(startPos, endPos);
      const hi = Math.max(startPos, endPos);
      for (let p = lo; p <= hi; p++) {
        loadFrame(curatedFrames[p], "high");
      }

      const duration =
        nextScene === lastScene
          ? lastSceneTransitionMs ?? transitionMs
          : transitionMs;
      const startTime = performance.now();

      const tick = () => {
        const elapsed = performance.now() - startTime;
        const t = Math.min(elapsed / duration, 1);
        const eased = easeInOutCubic(t);
        const pos = startPos + (endPos - startPos) * eased;
        displayedCuratedPos = pos;
        const realIdx = curatedFrames[Math.round(pos)];
        if (realIdx !== lastDrawnIndex) drawCuratedPos(pos);
        if (t < 1) {
          transitionRaf = requestAnimationFrame(tick);
        } else {
          transitionRaf = null;
          displayedCuratedPos = endPos;
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

    // === Completion mode (handles scrollbar drag / programmatic skip) ======
    //
    // When the user yanks the scrollbar past the hero before all 3 scenes
    // have played, we:
    //  1) pin the viewport at the position where the hero is still flush with
    //     the bottom of the viewport;
    //  2) auto-advance through the remaining scenes with a calculated duration
    //     so the animation looks natural (never instant, never sluggish);
    //  3) remember WHERE the user wanted to scroll to;
    //  4) when the last scene finishes, release the pin and gently scroll to
    //     that remembered position.
    //
    let lastScrollY = window.scrollY;
    let isCompleting = false;
    let pinPos = 0;
    let intendedScrollY = 0;
    let completionTimer: ReturnType<typeof setTimeout> | null = null;

    const MIN_COMPLETION_MS = 900;
    const FULL_COMPLETION_MS = 2200;

    const clearCompletionTimer = () => {
      if (completionTimer) {
        clearTimeout(completionTimer);
        completionTimer = null;
      }
    };

    const finishCompletion = () => {
      isCompleting = false;
      clearCompletionTimer();
      // If the user had scrolled further down with the scrollbar, take them
      // there now with a smooth scroll (so it doesn't feel abrupt).
      if (intendedScrollY > window.scrollY + 5) {
        window.scrollTo({ top: intendedScrollY, behavior: "smooth" });
      }
    };

    const advanceUntilLast = (perSceneMs: number) => {
      if (currentSceneIdx >= lastScene) {
        // Last transition has just been launched — wait for it to finish
        // before releasing the pin, so the user actually sees the logo.
        completionTimer = setTimeout(finishCompletion, perSceneMs + 100);
        return;
      }
      goToScene(currentSceneIdx + 1);
      completionTimer = setTimeout(
        () => advanceUntilLast(perSceneMs),
        perSceneMs
      );
    };

    const startCompletion = () => {
      if (isCompleting) return;
      isCompleting = true;
      intendedScrollY = window.scrollY;

      // Pin position: place where the hero section's bottom aligns with the
      // viewport's bottom (i.e., hero still fully visible).
      const rect = section.getBoundingClientRect();
      pinPos = Math.max(
        0,
        window.scrollY + rect.bottom - window.innerHeight
      );
      window.scrollTo({ top: pinPos });

      // Choose per-scene duration based on how many scenes are pending.
      // Total spends between MIN and FULL ms, distributed evenly.
      const remaining = lastScene - currentSceneIdx;
      const totalMs = Math.max(
        MIN_COMPLETION_MS,
        Math.min(FULL_COMPLETION_MS, remaining * 800)
      );
      const perSceneMs = Math.max(transitionMs + 50, totalMs / remaining);

      advanceUntilLast(perSceneMs);
    };

    // === Master scroll handler ============================================
    const onScroll = () => {
      // While completing, ignore real scroll attempts and pin in place.
      if (isCompleting) {
        intendedScrollY = Math.max(intendedScrollY, window.scrollY);
        if (Math.abs(window.scrollY - pinPos) > 2) {
          window.scrollTo({ top: pinPos });
        }
        return;
      }

      const scrollDir =
        window.scrollY > lastScrollY ? "down" : "up";
      const previousScrollY = lastScrollY;
      lastScrollY = window.scrollY;

      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;

      // ── Detect "user is escaping the hero before completing all scenes" ──
      // This catches scrollbar drags (and any other programmatic scroll that
      // bypasses our wheel/touch/key handlers).
      if (
        scrollDir === "down" &&
        rect.bottom < vh &&
        rect.bottom > 0 &&
        currentSceneIdx < lastScene
      ) {
        startCompletion();
        return;
      }

      // ── Standard preset-on-leave for completed sections ──
      if (rect.bottom < 0) {
        if (currentSceneIdx !== lastScene) {
          currentSceneIdx = lastScene;
          currentSceneRef.current = lastScene;
          displayedCuratedPos = sceneCuratedPositions[lastScene];
          setCurrentScene(lastScene);
          drawCuratedPos(displayedCuratedPos);
        }
      } else if (rect.top > vh) {
        if (currentSceneIdx !== 0) {
          currentSceneIdx = 0;
          currentSceneRef.current = 0;
          displayedCuratedPos = sceneCuratedPositions[0];
          setCurrentScene(0);
          drawCuratedPos(displayedCuratedPos);
        }
      }

      void previousScrollY; // silence lint for unused diagnostic
    };

    // === Initial preload (curated frames only) ===
    if (curatedFrames.length > 0) {
      loadFrame(curatedFrames[0], "high");
      for (let p = 1; p < Math.min(12, curatedFrames.length); p++) {
        loadFrame(curatedFrames[p], "high");
      }
      (async () => {
        for (let p = 12; p < curatedFrames.length; p++) {
          if (cancelledBg) return;
          loadFrame(curatedFrames[p], "low");
          await new Promise<void>((r) => setTimeout(r, 12));
        }
      })();
    }

    // Setup
    resizeCanvas();
    drawCuratedPos(displayedCuratedPos);

    const onResize = () => {
      resizeCanvas();
      drawCuratedPos(displayedCuratedPos);
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
      clearCompletionTimer();
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
    curatedFrames,
    gapPositions,
    sceneCuratedPositions,
    lastScene,
    reducedMotion,
    maxDpr,
    transitionMs,
    lastSceneTransitionMs,
    crossfadeMs,
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

  // For center alignment, apply text-center on both mobile and desktop so the
  // content (eyebrow / title / text / CTA) is properly centered everywhere.
  const textAlignCls =
    align === "center" ? "text-center" : "lg:text-left";

  // Vertical alignment of the inner content
  const flexAlignCls =
    isHero || align === "center"
      ? "items-center"
      : "items-end lg:items-center";

  // CTA layout
  const ctaContainerCls =
    align === "center" || isHero
      ? "mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4 lg:mt-7"
      : "mt-6 flex flex-wrap items-center gap-3 lg:mt-7";

  // === Hero variant: NO card, text overlaid directly on the animation ===
  // Scene variant keeps a subtle card to remain readable over varying frames.
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

  // Hero gradient: subtle radial vignette centered behind the text. Keeps
  // the animation visible around it while preserving legibility.
  const heroBgStyle: React.CSSProperties | undefined = isHero
    ? {
        background:
          "radial-gradient(ellipse 60% 50% at center, rgba(5,15,25,0.55) 0%, rgba(5,15,25,0.25) 45%, rgba(5,15,25,0) 75%)",
      }
    : undefined;

  return (
    <div
      aria-hidden={!active}
      style={heroBgStyle}
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
