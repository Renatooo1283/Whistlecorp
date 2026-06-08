"use client";

import { useEffect, useState } from "react";

export function ClientHydrationDebug() {
  const [hydrated, setHydrated] = useState(false);
  const [clicks, setClicks] = useState(0);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <div className="fixed bottom-2 left-2 z-[9999] rounded-lg bg-black/90 px-3 py-2 text-xs text-white shadow-xl">
      <div>hydrated: {hydrated ? "yes" : "no"}</div>
      <button
        type="button"
        onClick={() => setClicks((value) => value + 1)}
        className="mt-2 rounded bg-white px-2 py-1 text-black"
      >
        test click: {clicks}
      </button>
    </div>
  );
}
