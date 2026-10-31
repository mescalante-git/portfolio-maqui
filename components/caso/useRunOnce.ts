"use client";

import { useEffect, useRef } from "react";

/**
 * Corre las animaciones e interacciones de un caso una sola vez,
 * después de que su HTML ya está en la página. Cada caso lo usa desde su propio Script.tsx.
 */
export function useRunOnce(run: () => void) {
  const done = useRef(false);
  useEffect(() => {
    if (done.current) return;
    done.current = true;
    run();
  }, [run]);
}
