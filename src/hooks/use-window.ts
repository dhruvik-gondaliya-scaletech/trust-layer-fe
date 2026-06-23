"use client";

import { useState, useEffect } from "react";

export interface WindowState {
  width: number | undefined;
  height: number | undefined;
  scrollX: number;
  scrollY: number;
  isClient: boolean;
}

/**
 * A custom React hook to safely interact with the global window object in SSR (Next.js) environments.
 * It tracks window size, scroll positions, and hydration status reactively and efficiently.
 */
export function useWindow(): WindowState {
  const [windowState, setWindowState] = useState<WindowState>({
    width: undefined,
    height: undefined,
    scrollX: 0,
    scrollY: 0,
    isClient: false,
  });

  useEffect(() => {
    // Handler to capture size and scroll changes
    const handleUpdate = () => {
      setWindowState({
        width: window.innerWidth,
        height: window.innerHeight,
        scrollX: window.scrollX,
        scrollY: window.scrollY,
        isClient: true,
      });
    };

    // Initialize size and scroll on mount
    handleUpdate();

    // Register event listeners with passive: true for scroll performance
    window.addEventListener("resize", handleUpdate, { passive: true });
    window.addEventListener("scroll", handleUpdate, { passive: true });

    return () => {
      window.removeEventListener("resize", handleUpdate);
      window.removeEventListener("scroll", handleUpdate);
    };
  }, []);

  return windowState;
}
