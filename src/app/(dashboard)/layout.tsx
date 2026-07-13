"use client";

import { Spinner } from "@/components/ui/spinner";
import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { FRONTEND_ROUTES, AUTH_STORAGE_KEYS } from "@/lib/contants";
import {
  LayoutDashboard,
  PlusCircle,
  LogOut,
  Shield,
  Check,
  Bell,
  Store,
  ShoppingCart,
  User,
} from "lucide-react";
import { setStorageItems } from "@/lib/storage";
import { useRole } from "@/providers/role-provider";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useUnreadNotificationsCount } from "@/hooks/queries/useNotifications";
import { cn } from "@/lib/utils";
import { ProfileSheet } from "@/components/shared/ProfileSheet";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isInitializing, isAuthenticated, logout } = useAuth();
  const { role, setRole } = useRole();
  const { data: unreadNotificationsCount = 0 } = useUnreadNotificationsCount({
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      const redirectUrl = encodeURIComponent(window.location.pathname + window.location.search);
      router.replace(`${FRONTEND_ROUTES.LOGIN}?redirect=${redirectUrl}`);
      return;
    }

    if (isAuthenticated && user) {
      const emailVerified = !!user.emailVerifiedAt;
      const phoneVerified = !!user.phoneVerifiedAt;
      const profileComplete = !!user.username;

      if (!emailVerified || !phoneVerified || !profileComplete) {
        setStorageItems({
          [AUTH_STORAGE_KEYS.EMAIL_VERIFIED]: String(emailVerified),
          [AUTH_STORAGE_KEYS.PHONE_VERIFIED]: String(phoneVerified),
          [AUTH_STORAGE_KEYS.PROFILE_COMPLETE]: String(profileComplete),
        });
        const redirectUrl = encodeURIComponent(window.location.pathname + window.location.search);
        router.replace(`${FRONTEND_ROUTES.VERIFY}?email=${encodeURIComponent(user.email)}&redirect=${redirectUrl}`);
      }
    }
  }, [user, isInitializing, isAuthenticated, router]);

  if (isInitializing || !isAuthenticated) {
    return (
      <div className="w-full min-h-dvh bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex items-center justify-center">
            <Spinner className="w-10 h-10 text-primary" strokeWidth={2.5} />
          </div>
          <p className="text-sm font-semibold text-muted-foreground animate-pulse">
            Verifying secure session...
          </p>
        </div>
      </div>
    );
  }

  if (user) {
    const emailVerified = !!user.emailVerifiedAt;
    const phoneVerified = !!user.phoneVerifiedAt;
    const profileComplete = !!user.username;

    if (!emailVerified || !phoneVerified || !profileComplete) {
      return (
        <div className="w-full min-h-dvh bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
          <div className="flex flex-col items-center gap-4">
            <Spinner className="w-10 h-10 text-primary" strokeWidth={2.5} />
            <p className="text-sm font-semibold text-muted-foreground animate-pulse">
              Redirecting to verification...
            </p>
          </div>
        </div>
      );
    }
  }

  const isDashboardActive = pathname === FRONTEND_ROUTES.DASHBOARD;
  const isCreateDealActive = pathname === FRONTEND_ROUTES.CREATE_DEAL;
  const isTimelineActive = pathname.startsWith(FRONTEND_ROUTES.TIMELINE);

  const isBuyer = role === "buyer";

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row text-left">
      {/* ─── DESKTOP LEFT SIDEBAR ────────────────────────────────────────────── */}
      <aside className="hidden md:flex md:flex-col md:w-64 md:shrink-0 bg-card border-r border-border/40 h-screen sticky top-0 z-30 select-none">
        {/* Brand Header */}
        <div className="px-6 h-16 flex items-center gap-2 border-b border-border/30">
          <Shield className="w-6 h-6 text-primary fill-primary/10 stroke-[2.5]" />
          <span className="font-black text-lg text-foreground tracking-tight">
            Trust<span className="text-primary">Layer</span>
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          <button
            onClick={() => router.push(FRONTEND_ROUTES.DASHBOARD)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all",
              isDashboardActive || isTimelineActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            )}
          >
            <LayoutDashboard className="w-4.5 h-4.5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => router.push(FRONTEND_ROUTES.CREATE_DEAL)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all",
              isCreateDealActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            )}
          >
            <PlusCircle className="w-4.5 h-4.5" />
            <span>Create New Deal</span>
          </button>
        </nav>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-border/40 bg-muted/20">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-extrabold text-foreground truncate">
                {user?.username || "alex"}
              </span>
              <div className="flex gap-1 items-center mt-0.5">
                <Check className="w-3 h-3 text-emerald-500 stroke-[3]" />
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                  Verified
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold text-destructive hover:bg-destructive/10 transition-all active:scale-[0.98]"
          >
            <LogOut className="w-4 h-4" />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* ─── RIGHT SIDE: FIXED TOP NAVBAR + CONTENT ────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* ── DESKTOP FIXED TOP NAVBAR (hidden on mobile) ─────────────────── */}
        <header className="hidden md:flex sticky top-0 z-40 w-full h-16 bg-card/95 backdrop-blur-md border-b border-border/40 shadow-sm items-center justify-between px-6 shrink-0">
          {/* Left: Page title or breadcrumb */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
              {isDashboardActive
                ? "Dashboard"
                : isCreateDealActive
                  ? "Create Deal"
                  : isTimelineActive
                    ? "Deals Timeline"
                    : "TrustLayer"}
            </span>
          </div>

          {/* Center: Role Switcher */}
          <div className="flex items-center">
            <div className="flex bg-muted/60 p-1 rounded-xl w-[220px] relative select-none">
              <motion.div
                className={cn(
                  "absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg transition-colors duration-300",
                  role === "seller" ? "bg-primary" : "bg-emerald-500"
                )}
                animate={{
                  left: role === "seller" ? "4px" : "calc(50% + 2px)",
                }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              />

              <button
                onClick={() => setRole("seller")}
                className={cn(
                  "flex-1 py-1.5 text-[12px] font-bold rounded-lg transition-colors relative z-10 flex items-center justify-center gap-1.5",
                  role === "seller" ? "text-white" : "text-muted-foreground hover:text-foreground"
                )}
                aria-pressed={role === "seller"}
              >
                <Store className="w-3.5 h-3.5" />
                SELLER
              </button>

              <button
                onClick={() => setRole("buyer")}
                className={cn(
                  "flex-1 py-1.5 text-[12px] font-bold rounded-lg transition-colors relative z-10 flex items-center justify-center gap-1.5",
                  role === "buyer" ? "text-white" : "text-muted-foreground hover:text-foreground"
                )}
                aria-pressed={role === "buyer"}
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                BUYER
              </button>
            </div>
          </div>

          {/* Right: Notifications + User avatar */}
          <div className="flex items-center gap-3">
            {/* Notification bell */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push(FRONTEND_ROUTES.NOTIFICATIONS)}
                className="h-10 w-10 bg-muted/40 rounded-full border border-border/40 text-foreground hover:bg-muted/60 transition-all"
                aria-label="Notifications"
              >
                <Bell className="h-[18px] w-[18px]" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-[18px] w-[18px] bg-rose-500 text-[9px] font-extrabold text-white rounded-full border-2 border-card flex items-center justify-center">
                    {unreadNotificationsCount}
                  </span>
                )}
              </Button>
            </div>

            {/* User avatar */}
            <ProfileSheet>
              <button
                className={cn(
                  "h-9 w-9 rounded-full flex items-center justify-center border-2 shadow-sm cursor-pointer hover:scale-105 active:scale-95 transition-all outline-none",
                  isBuyer
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                    : "bg-primary/10 border-primary/20 text-primary"
                )}
              >
                <User className="w-4.5 h-4.5" />
              </button>
            </ProfileSheet>
          </div>
        </header>

        {/* ── PAGE CONTENT ─────────────────────────────────────────────────── */}
        <main className="flex-1 flex flex-col min-h-0">
          {children}
        </main>
      </div>
    </div>
  );
}
