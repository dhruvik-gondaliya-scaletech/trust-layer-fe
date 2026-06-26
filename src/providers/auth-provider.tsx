"use client";

import React, {
  createContext,
  useContext,
  useMemo,
} from "react";
import {
  useCurrentUser,
  userKeys,
} from "@/hooks/queries/useUsers";
import {
  useLoginMutation,
  useRegisterMutation,
  useLogout,
} from "@/hooks/queries/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { AUTH_STORAGE_KEYS } from "@/lib/contants";
import { getStorageItem, setStorageItems } from "@/lib/storage";
import type { User } from "@/types/api.types";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AuthStatus =
  | "loading"       // initial token-check / fetching user
  | "authenticated" // user is signed in
  | "unauthenticated"; // no valid session

export interface AuthContextValue {
  /** Full profile of the authenticated user, or null */
  user: User | null | undefined;
  /** Auth lifecycle status derived from useCurrentUser */
  status: AuthStatus;
  /** True while the session is being established on mount */
  isInitializing: boolean;
  /** True only when the user is fully authenticated */
  isAuthenticated: boolean;
  /** React Query mutation — call .mutate(dto) to log in */
  loginMutation: ReturnType<typeof useLoginMutation>;
  /** React Query mutation — call .mutate(dto) to register */
  registerMutation: ReturnType<typeof useRegisterMutation>;
  /** Clears tokens, resets the RQ cache, and redirects to /login */
  logout: () => void;
  /** Force a fresh fetch of /users/me (e.g. after OTP verification) */
  refreshUser: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Storage Helper ───────────────────────────────────────────────────────────

function hasStoredToken(): boolean {
  try {
    return (
      typeof window !== "undefined" &&
      !!getStorageItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN)
    );
  } catch {
    return false;
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  // ── Derive user + status from the RQ cache / network ─────────────────────────
  // `useCurrentUser` only fires when there is a stored access token.
  // If no token exists we skip the network call entirely.
  const {
    data: user,
    isPending,
    isError,
  } = useCurrentUser();

  // useCurrentUser runs regardless; we gate "authenticated" on whether the
  // query succeeded AND we actually have a user object back.
  const tokenExists = hasStoredToken();

  const status: AuthStatus = useMemo(() => {
    if (isPending && tokenExists) return "loading";
    if (user) return "authenticated";
    if (isError || !tokenExists) return "unauthenticated";
    return "loading";
  }, [isPending, user, isError, tokenExists]);

  const isInitializing = status === "loading";
  const isAuthenticated = status === "authenticated";

  // ── Auth mutations — wired to existing hooks ──────────────────────────────────
  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  const logoutFn = useLogout();

  // ── refreshUser: invalidates the me-query and lets RQ re-fetch ───────────────
  const refreshUser = async () => {
    await queryClient.invalidateQueries({ queryKey: userKeys.me() });
  };

  // Synchronize user verification flags with localStorage on load/change
  React.useEffect(() => {
    if (user) {
      setStorageItems({
        [AUTH_STORAGE_KEYS.EMAIL_VERIFIED]: String(!!user.emailVerifiedAt),
        [AUTH_STORAGE_KEYS.PHONE_VERIFIED]: String(!!user.phoneVerifiedAt),
        [AUTH_STORAGE_KEYS.PROFILE_COMPLETE]: String(!!user.username),
      });
    }
  }, [user]);

  // ── Context value ─────────────────────────────────────────────────────────────
  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      isInitializing,
      isAuthenticated,
      loginMutation,
      registerMutation,
      logout: logoutFn,
      refreshUser,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, status, isInitializing, isAuthenticated, loginMutation, registerMutation, logoutFn]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Access the auth context anywhere in the app.
 *
 * @example
 * const { user, isAuthenticated, loginMutation, logout } = useAuth();
 *
 * // Trigger login:
 * loginMutation.mutate({ email, password });
 *
 * // Trigger register:
 * registerMutation.mutate({ firstName, lastName, email, password });
 */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error(
      "useAuth must be used inside <AuthProvider>. " +
      "Make sure <AuthProvider> is present in your providers tree."
    );
  }
  return ctx;
}
