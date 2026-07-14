"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { FRONTEND_ROUTES } from "@/lib/contants";

export function SidebarNav() {
  const pathname = usePathname();

  const isDashboardActive = pathname === FRONTEND_ROUTES.DASHBOARD;
  const isTimelineActive = pathname.startsWith(FRONTEND_ROUTES.TIMELINE);
  const isDealsActive = pathname.startsWith("/deal/details");

  return (
    <nav className="flex-1 px-4 py-6 space-y-1">
      <Link
        href={FRONTEND_ROUTES.DASHBOARD}
        className={cn(
          "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all flex",
          isDashboardActive || isTimelineActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
        )}
      >
        <LayoutDashboard className="w-4.5 h-4.5" />
        <span>Dashboard</span>
      </Link>

      <Link
        href={FRONTEND_ROUTES.DEAL_LISTING}
        className={cn(
          "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all flex",
          isDealsActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
        )}
      >
        <Tag className="w-4.5 h-4.5" />
        <span>Deals</span>
      </Link>
    </nav>
  );
}
