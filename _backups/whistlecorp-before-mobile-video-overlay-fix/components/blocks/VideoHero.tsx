"use client";

import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// ────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────

export type VideoHeroScene = {
  /** Seconds at which the overlay starts appearing. */
  start: number;
  /** Seconds at which the overlay finishes disappearing. Use a large value
   *  (e.g. 9999) to keep the scene visible after the video ends. */
  end: number;
  eyebrow?: string;
  title: string;
  text?: string;
  align?: "left" | "right" | "center";
  cta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  variant?: "hero" | "scene";
};

export type VideoHeroProps = {
  src: string;
  poster?: string;
  scenes: VideoHeroScene[];
  ariaLabel?: string;
};

// ────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────

const FADE_SEC = 0.35;

function visibility(t: number, start: number, end: number) {
  let opacity = 0;
  let translate = 14;
  if (t < start) {
    opacity = 0;
    translate = 14;
  } else if (t < start + FADE_SEC) {
    const k = (t - start) / FADE_SEC;
    opacity = k;
    translate = 14 - 14 * k;
  } else if (t < end - FADE_SEC) {
    opacity = 1;
    translate = 0;
  } else if (t < end) {
    const k = (t - (end - FADE_SEC)) / FADE_SEC;
    opacity = 1 - k;
    translate = -8 * k;
  }
  return { opacity, translate };
}

// ────────────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────────────

export function VideoHero({
  src,
  poster,
  scenes,
  ariaLabel = "Presentación visual de WhistleCorp",
}: VideoHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [time, setTime] = useState(0);
  const [autoplayFailed, setAutoplayFailed] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Wire up listeners and attempt autoplay
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onTimeUpdate = () => setTime(v.currentTime);
    const onEnded = () => {
      // Freeze on last frame. Browsers already do this when no `loop` attr.
      setTime(v.duration || v.currentTime);
    };
    const onError = () => setVideoError(true);

    v.addEventListener("timeupdate", onTimeUpdate);
    v.addEventListener("ended", onEnded);
    v.addEventListener("error", onError);

    // Attempt autoplay (muted + playsInline are the requirements).
    const playPromise = v.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        setAutoplayFailed(true);
      });
    }

    return () => {
      v.removeEventListener("timeupdate", onTimeUpdate);
      v.removeEventListener("ended", onEnded);
      v.removeEventListener("error", onError);
    };
  }, []);

  const handleManualPlay = () => {
    const v = videoRef.current;
    if (!v) return;
    v.play()
      .then(() => setAutoplayFailed(false))
      .catch(() => setAutoplayFailed(true));
  };

  return (
    <section
      aria-label={ariaLabel}
      className="relative w-full overflow-hidden bg-[var(--color-ink)] min-h-[calc(100dvh-64px)] md:min-h-[calc(100dvh-72px)]"
    >
      {/* Video (or just poster on error) */}
      {!videoError && (
        <video
          ref={videoRef}
          poster={poster}
          muted
          autoPlay
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={src} type="video/mp4" />
        </video>
      )}

      {videoError && poster && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/* Lateral gradient for legibility (does not cover the whole frame) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(5,15,25,0.82) 0%, rgba(5,15,25,0.55) 35%, rgba(5,15,25,0.12) 70%, rgba(5,15,25,0) 100%)",
        }}
      />

      {/* Scene overlays */}
      {scenes.map((scene, i) => (
        <SceneOverlay key={i} scene={scene} time={time} />
      ))}

      {/* Fallback play button when autoplay is blocked */}
      {autoplayFailed && !videoError && (
        <button
          type="button"
          onClick={handleManualPlay}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/55 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur transition-colors hover:bg-black/70"
          aria-label="Reproducir animación"
        >
          <Play className="h-3.5 w-3.5" />
          Ver animación
        </button>
      )}
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────
// SceneOverlay
// ────────────────────────────────────────────────────────────────────

function SceneOverlay({
  scene,
  time,
}: {
  scene: VideoHeroScene;
  time: number;
}) {
  const { opacity, translate } = visibility(time, scene.start, scene.end);
  const isActive = opacity > 0.01;
  const isHero = scene.variant === "hero";
  const align = scene.align ?? "left";

  // Position the overlay container
  const justifyCls =
    align === "right"
      ? "lg:justify-end"
      : align === "center"
      ? "lg:justify-center"
      : "lg:justify-start";
  const textAlignCls =
    align === "center" ? "text-center" : "lg:text-left";

  // Title size: hero is moderately larger
  const titleCls = isHero
    ? "mt-4 text-[24px] font-bold leading-[1.12] tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)] sm:text-[28px] md:text-[34px] lg:text-[40px] lg:leading-[1.08]"
    : "mt-3 text-[22px] font-bold leading-[1.15] text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)] sm:text-[26px] md:text-[30px] lg:text-[36px] lg:leading-[1.1]";

  const textCls = isHero
    ? "mx-auto mt-5 max-w-[520px] text-sm leading-relaxed text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.65)] sm:text-base"
    : "mx-auto mt-3 max-w-[480px] text-sm leading-relaxed text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.65)] sm:text-base";

  const cardCls = "w-full max-w-[640px]";

  const ctaContainerCls =
    align === "center" || isHero
      ? "mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4 lg:mt-7"
      : "mt-6 flex flex-wrap items-center gap-3 lg:mt-7";

  return (
    <div
      aria-hidden={!isActive}
      style={{
        opacity,
        transform: `translate3d(0, ${translate}px, 0)`,
        transition: "opacity 0.18s linear",
      }}
      className={`pointer-events-none absolute inset-0 flex items-center justify-center p-5 sm:p-8 lg:px-16 ${justifyCls}`}
    >
      <div
        className={`${isActive ? "pointer-events-auto" : ""} ${cardCls} ${textAlignCls}`}
      >
        {scene.eyebrow && (
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#86EFAC] lg:text-[11px]">
            {scene.eyebrow}
          </p>
        )}
        <h2 className={titleCls}>{scene.title}</h2>
        {scene.text && <p className={textCls}>{scene.text}</p>}
        {(scene.cta || scene.secondaryCta) && (
          <div className={ctaContainerCls}>
            {scene.cta && (
              <Link
                href={scene.cta.href}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-[var(--color-accent)] px-6 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)]"
              >
                {scene.cta.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
            {scene.secondaryCta && (
              <Link
                href={scene.secondaryCta.href}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-white/35 px-6 text-sm font-semibold text-white transition-colors hover:border-white/60 hover:bg-white/5"
              >
                {scene.secondaryCta.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
