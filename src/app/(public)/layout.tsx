"use client";

import React, { useEffect, useMemo, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { FRONTEND_ROUTES, AUTH_STORAGE_KEYS } from "@/lib/contants";
import { getStorageItem } from "@/lib/storage";
import { Loader2, Shield } from "lucide-react";

function PublicLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const { user, isInitializing, isAuthenticated } = useAuth();

  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
    } else if (pathname.startsWith("/deal/")) {
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
    } else if (pathname.startsWith("/deal/")) {
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

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left side: branding/marketing (desktop only) */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[50%] bg-[#0B0F19] text-white flex-col justify-between p-12 relative overflow-hidden select-none border-r border-slate-800/80">
        {/* Glow effects */}
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-gradient-to-br from-blue-600/30 to-purple-600/0 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] rounded-full bg-gradient-to-br from-indigo-600/20 to-pink-600/0 blur-[120px] pointer-events-none" />

        {/* Grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        {/* Top brand header */}
        <div className="flex items-center gap-2.5 text-white font-extrabold text-xl relative z-10">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 border border-blue-400/25">
            <Shield className="h-5.5 w-5.5 text-white" />
          </div>
          <span className="tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">TrustLayer</span>
        </div>

        {/* Hero section */}
        <div className="my-auto relative z-10 max-w-lg">
          <h2 className="text-4xl xl:text-5xl font-black tracking-tight leading-[1.1] pb-4">
            Experience the future of trust.
          </h2>
          <p className="text-slate-400 text-[15px] leading-relaxed">
            Verify item condition, lock payments, and transact with absolute confidence.
          </p>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-xs text-slate-500 relative z-10 pt-4 border-t border-slate-900/40">
          <span>&copy; {new Date().getFullYear()} TrustLayer Inc.</span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            All Systems Operational
          </span>
        </div>
      </div>

      {/* Right side: form area */}
      <div
        className="flex-1 w-full lg:w-[55%] xl:w-[50%] h-screen relative bg-background flex flex-col justify-center items-center select-text"
        style={{ transform: "translate3d(0, 0, 0)" }}
      >
        <div className="w-full h-full overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

function PublicLayoutLoader() {
  return (
    <div className="w-full min-h-dvh bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin" strokeWidth={2.5} />
        </div>
        <p className="text-sm font-semibold text-muted-foreground animate-pulse">
          Verifying secure session...
        </p>
      </div>
    </div>
  );
}

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<PublicLayoutLoader />}>
      <PublicLayoutContent>{children}</PublicLayoutContent>
    </Suspense>
  );
}

