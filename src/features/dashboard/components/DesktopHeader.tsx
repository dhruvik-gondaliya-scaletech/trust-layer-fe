"use client";

import React from "react";
import { Bell, Store, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Role } from "@/types/enums";
import { FRONTEND_ROUTES } from "@/lib/contants";

interface DesktopHeaderProps {
  pathname: string;
  role: any;
  setRole: (role: any) => void;
  unreadNotificationsCount: number;
}

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({
  pathname,
  role,
  setRole,
  unreadNotificationsCount,
}) => {
  const isDashboardActive = pathname === FRONTEND_ROUTES.DASHBOARD;
  const isCreateDealActive = pathname === FRONTEND_ROUTES.CREATE_DEAL;
  const isTimelineActive = pathname.startsWith(FRONTEND_ROUTES.TIMELINE);

  return (
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

      {/* Right: Role Switcher & Notifications */}
      <div className="flex items-center gap-3">
        {/* Role Switcher */}
        <div className="flex bg-muted/60 p-1 rounded-xl w-[220px] relative select-none">
          <motion.div
            className={cn(
              "absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg transition-colors duration-300",
              role === Role.SELLER ? "bg-primary" : "bg-emerald-500"
            )}
            animate={{
              left: role === Role.SELLER ? "4px" : "calc(50% + 2px)",
            }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
          />

          <button
            onClick={() => setRole(Role.SELLER)}
            className={cn(
              "flex-1 py-1.5 text-[12px] font-bold rounded-lg transition-colors relative z-10 flex items-center justify-center gap-1.5 cursor-pointer",
              role === Role.SELLER ? "text-white" : "text-muted-foreground hover:text-foreground"
            )}
            aria-pressed={role === Role.SELLER}
          >
            <Store className="w-3.5 h-3.5" />
            SELLER
          </button>

          <button
            onClick={() => setRole(Role.BUYER)}
            className={cn(
              "flex-1 py-1.5 text-[12px] font-bold rounded-lg transition-colors relative z-10 flex items-center justify-center gap-1.5 cursor-pointer",
              role === Role.BUYER ? "text-white" : "text-muted-foreground hover:text-foreground"
            )}
            aria-pressed={role === Role.BUYER}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            BUYER
          </button>
        </div>

        {/* Notification bell */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
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
      </div>
    </header>
  );
};
