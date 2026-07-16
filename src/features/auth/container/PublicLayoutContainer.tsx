"use client";

import React, { useEffect, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { FRONTEND_ROUTES, AUTH_STORAGE_KEYS } from "@/lib/contants";
import { getStorageItem } from "@/lib/storage";
import { PublicLayoutPresenter } from "../components/PublicLayoutPresenter";
import { PublicLayoutLoader } from "../components/PublicLayoutLoader";

interface PublicLayoutContainerProps {
  children: React.ReactNode;
}

export const PublicLayoutContainer: React.FC<PublicLayoutContainerProps> = ({
  children,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const { user, isInitializing, isAuthenticated } = useAuth();

  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || isInitializing) return;

    if (pathname === FRONTEND_ROUTES.VERIFY) {
      // /verify is an authenticated page (but for unverified users or users with registration token)
      const hasRegToken = !!getStorageItem(AUTH_STORAGE_KEYS.REGISTRATION_TOKEN);
      if (!isAuthenticated && !hasRegToken) {
        if (redirect) {
          router.replace(`${FRONTEND_ROUTES.LOGIN}?redirect=${encodeURIComponent(redirect)}`);
        } else {
          router.replace(FRONTEND_ROUTES.LOGIN);
        }
      } else if (user) {
        const emailVerified = !!user.emailVerifiedAt;
        const phoneVerified = !!user.phoneVerifiedAt;
        const profileComplete = !!user.username;

        if (emailVerified && phoneVerified && profileComplete) {
          if (redirect) {
            router.replace(redirect);
          } else {
            router.replace(FRONTEND_ROUTES.DASHBOARD);
          }
        }
      }
    } else if (pathname.startsWith("/deal/") || pathname.startsWith("/open-deal/")) {
      // Allow authenticated or unauthenticated users to view public deals without redirect
      return;
    } else {
      // /login or /register (strictly public pages)
      if (isAuthenticated) {
        if (redirect) {
          router.replace(redirect);
        } else {
          router.replace(FRONTEND_ROUTES.DASHBOARD);
        }
      }
    }
  }, [user, isInitializing, isAuthenticated, pathname, router, mounted, redirect]);

  // Show a loading indicator during initialization, or during redirects to avoid flashing
  const isRedirecting = useMemo(() => {
    if (!mounted) {
      // During SSR and initial mount, we must match server-side HTML.
      // Server is unauthenticated, so /verify renders the loader, but others render children.
      return pathname === FRONTEND_ROUTES.VERIFY;
    }

    if (isInitializing) return true;
    if (pathname === FRONTEND_ROUTES.VERIFY) {
      const hasRegToken = !!getStorageItem(AUTH_STORAGE_KEYS.REGISTRATION_TOKEN);
      if (!isAuthenticated && !hasRegToken) return true;
      if (user) {
        const emailVerified = !!user.emailVerifiedAt;
        const phoneVerified = !!user.phoneVerifiedAt;
        const profileComplete = !!user.username;
        if (emailVerified && phoneVerified && profileComplete) return true;
      }
    } else if (pathname.startsWith("/deal/") || pathname.startsWith("/open-deal/")) {
      // Never force redirect/loading state for deals based on auth status
      return false;
    } else {
      if (isAuthenticated) return true;
    }
    return false;
  }, [mounted, isInitializing, pathname, isAuthenticated, user]);

  if (isRedirecting) {
    return <PublicLayoutLoader />;
  }

  return <PublicLayoutPresenter>{children}</PublicLayoutPresenter>;
};
