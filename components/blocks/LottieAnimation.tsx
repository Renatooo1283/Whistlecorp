"use client";

import { useEffect, useRef, useState } from "react";
import Lottie, { type LottieRefCurrentProps } from "lottie-react";

type Props = {
  /** Path served from /public, e.g. "/animations/programming.json" */
  src: string;
  /** Accessible label for screen readers; the canvas is decorative by default */
  ariaLabel?: string;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
};

/**
 * Lazy-loaded Lottie player.
 * Fetches the JSON at runtime so it doesn't inflate the route bundle.
 */
export function LottieAnimation({
  src,
  ariaLabel,
  className,
  loop = true,
  autoplay = true,
}: Props) {
  const [data, setData] = useState<unknown | null>(null);
  const ref = useRef<LottieRefCurrentProps | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(src)
      .then((r) => r.json())
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {
        if (!cancelled) setData(null);
      });
    return () => {
      cancelled = true;
    };
  }, [src]);

  if (!data) {
    return (
      <div
        className={className}
        role="img"
        aria-label={ariaLabel ?? "Cargando animación"}
      />
    );
  }

  return (
    <div
      className={className}
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
    >
      <Lottie
        lottieRef={ref}
        animationData={data}
        loop={loop}
        autoplay={autoplay}
        rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
