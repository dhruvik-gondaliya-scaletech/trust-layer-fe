"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes";

/**
 * TrustLayer doesn't use light/dark mode — the "theme" is which side of the
 * marketplace is active. next-themes drives this the same way it drives
 * dark/light: it flips an html[data-role] attribute and persists the choice,
 * we just point it at our own theme names and brand colors instead.
 */
export const APP_THEMES = ["seller", "buyer"] as const;
export type AppTheme = (typeof APP_THEMES)[number];

export const THEME_STORAGE_KEY = "tl_user_role";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="data-role"
      defaultTheme="seller"
      themes={[...APP_THEMES]}
      storageKey={THEME_STORAGE_KEY}
      enableSystem={false}
      enableColorScheme={false}
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
