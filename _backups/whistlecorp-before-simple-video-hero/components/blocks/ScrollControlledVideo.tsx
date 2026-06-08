"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  /** Video source served from /public (e.g. "/videos/whistlecorp-scroll.mp4"). */
  src: string;
  /** Optional WebM source for better compression on supporting browsers. */
  webmSrc?: string;
  /** Total scrollable height of the section. Larger value = slower scrub. */
  sectionHeight?: string;
  /** Poster shown until metadata loads (and for prefers-reduced-motion). */
  poster?: string;
  /** Accessible label for the section. */
  ariaLabel?: string;
};

/**
 * Video controlado por scroll.
 *
 * El elemento <section> tiene altura `sectionHeight` (mayor que el viewport).
 * Dentro hay un wrapper sticky de 100vh que mantiene el video fijo mientras
 * el usuario recorre la sección. Mapea el progreso del scroll dentro de la
 * sección al `currentTime` del video, con interpolación suave vía RAF.
 *
 * - `muted`, `playsInline`, `preload="metadata"`, sin autoplay ni controles.
 * - Respeta `prefers-reduced-motion`: si está activo, no hace scrubbing y
 *   muestra el primer frame estático.
 * - Aria-hidden en el <video> porque es decorativo; la sección tiene label.
 */
export function ScrollControlledVideo({
  src,
  webmSrc,
  sectionHeight = "320vh",
  poster,
  ariaLabel = "Presentación visual de WhistleCorp",
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafId = useRef<number | null>(null);
  const targetTime = useRef(0);
  const [duration, setDuration] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  // prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Read duration once metadata is loaded
  function handleLoadedMetadata() {
    const v = videoRef.current;
    if (v && Number.isFinite(v.duration) && v.duration > 0) {
      setDuration(v.duration);
    }
  }

  // Scroll → currentTime, smoothed with RAF
  useEffect(() => {
    if (reducedMotion) return;
    if (!duration) return;
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    let lastTarget = 0;
    let active = false;

    const tick = () => {
      const v = videoRef.current;
      if (!v) {
        rafId.current = null;
        return;
      }
      const current = v.currentTime;
      const diff = targetTime.current - current;
      if (Math.abs(diff) > 0.025) {
        try {
          // Tween toward target — softer than direct assignment
          v.currentTime = current + diff * 0.18;
        } catch {
          /* seek errors are non-fatal */
        }
        rafId.current = requestAnimationFrame(tick);
      } else {
        // Settled
        active = false;
        rafId.current = null;
      }
    };

    const updateTarget = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrollable = section.offsetHeight - vh;
      if (scrollable <= 0) return;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollable));
      targetTime.current = progress * duration;
      if (Math.abs(targetTime.current - lastTarget) < 0.01) return;
      lastTarget = targetTime.current;
      if (!active) {
        active = true;
        rafId.current = requestAnimationFrame(tick);
      }
    };

    window.addEventListener("scroll", updateTarget, { passive: true });
    window.addEventListener("resize", updateTarget);
    updateTarget();

    return () => {
      window.removeEventListener("scroll", updateTarget);
      window.removeEventListener("resize", updateTarget);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [duration, reducedMotion]);

  return (
    <section
      ref={sectionRef}
      aria-label={ariaLabel}
      style={{ height: sectionHeight }}
      className="relative w-full bg-[var(--color-ink)]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <video
          ref={videoRef}
          poster={poster}
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
          onLoadedMetadata={handleLoadedMetadata}
          className="absolute inset-0 h-full w-full object-cover"
        >
          {webmSrc && <source src={webmSrc} type="video/webm" />}
          <source src={src} type="video/mp4" />
        </video>
        {/* Overlay sutil para integrar con el resto del sitio */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/25"
        />
      </div>
    </section>
  );
}
