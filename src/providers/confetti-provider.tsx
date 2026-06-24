"use client";

import React, { createContext, useContext, useCallback } from "react";
import confetti from "canvas-confetti";

// ─── Types ──────────────────────────────────────────────────────────────────

/** Where the burst originates from. */
export type ConfettiOrigin = "sides" | "left" | "right" | "center";

export interface ConfettiOptions {
  /** Burst origin. Defaults to "sides" (bottom-left + bottom-right). */
  origin?: ConfettiOrigin;
  /** Custom hex/CSS colors. Defaults to the brand palette. */
  colors?: string[];
  /** Number of particles per burst. Defaults to 90. */
  particleCount?: number;
  /** Spread angle in degrees. Defaults to 60. */
  spread?: number;
  /** Whether to fire a follow-up burst ~350ms later. Defaults to true for "sides". */
  followUp?: boolean;
}

interface ConfettiContextValue {
  /** Fire confetti with optional customisation. */
  fire: (options?: ConfettiOptions) => void;
}

// ─── Defaults ────────────────────────────────────────────────────────────────

const DEFAULT_COLORS = [
  "#3b82f6", // blue-500
  "#6366f1", // indigo-500
  "#8b5cf6", // violet-500
  "#ec4899", // pink-500
  "#f59e0b", // amber-500
  "#10b981", // emerald-500
];

// ─── Context ─────────────────────────────────────────────────────────────────

const ConfettiContext = createContext<ConfettiContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

export function ConfettiProvider({ children }: { children: React.ReactNode }) {
  const fire = useCallback((options: ConfettiOptions = {}) => {
    const {
      origin = "sides",
      colors = DEFAULT_COLORS,
      particleCount = 90,
      spread = 60,
      followUp = origin === "sides",
    } = options;

    const shared: confetti.Options = { colors, zIndex: 9999, spread };

    const burst = (angle: number, x: number, y: number, count: number) =>
      confetti({ ...shared, particleCount: count, angle, origin: { x, y } });

    switch (origin) {
      case "sides":
        burst(60, 0, 1, particleCount);
        burst(120, 1, 1, particleCount);
        break;
      case "left":
        burst(60, 0, 1, particleCount);
        break;
      case "right":
        burst(120, 1, 1, particleCount);
        break;
      case "center":
        burst(90, 0.5, 0.7, particleCount);
        break;
    }

    if (followUp) {
      const followCount = Math.round(particleCount * 0.6);
      const followSpread = spread + 20;
      setTimeout(() => {
        confetti({ ...shared, spread: followSpread, particleCount: followCount, angle: 60, origin: { x: 0, y: 1 } });
        confetti({ ...shared, spread: followSpread, particleCount: followCount, angle: 120, origin: { x: 1, y: 1 } });
      }, 350);
    }
  }, []);

  return (
    <ConfettiContext.Provider value={{ fire }}>
      {children}
    </ConfettiContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * Returns `{ fire }` to trigger a confetti burst anywhere in the tree.
 *
 * @example
 * const { fire } = useConfetti();
 * fire();                                    // both sides celebration (default)
 * fire({ origin: "center" });               // center pop
 * fire({ origin: "left", particleCount: 50 });
 */
export function useConfetti(): ConfettiContextValue {
  const ctx = useContext(ConfettiContext);
  if (!ctx) {
    throw new Error("useConfetti must be used inside <ConfettiProvider>.");
  }
  return ctx;
}
