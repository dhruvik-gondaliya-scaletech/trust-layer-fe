"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { type AppTheme } from "./theme-provider";
import { Role } from "@/types/enums";

export type UserRole = AppTheme;

/**
 * Domain-specific wrapper around next-themes' useTheme(). Keeps `useRole()`
 * as the call site API everywhere in the app, while ThemeProvider (backed by
 * next-themes) does the actual persistence + no-flash attribute switching.
 */
export const useRole = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const role = (theme as UserRole) ?? Role.SELLER;

  const setRole = (newRole: UserRole) => setTheme(newRole);
  const toggleRole = () => setRole(role === Role.SELLER ? Role.BUYER : Role.SELLER);

  return { role: mounted ? role : Role.SELLER, setRole, toggleRole, mounted };
};
