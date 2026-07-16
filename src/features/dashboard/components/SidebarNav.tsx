"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { FRONTEND_ROUTES } from "@/lib/contants";

interface SidebarNavProps {
  isCollapsed?: boolean;
}

export function SidebarNav({ isCollapsed }: SidebarNavProps) {
  const pathname = usePathname();

  const isDashboardActive = pathname === FRONTEND_ROUTES.DASHBOARD;
  const isTimelineActive = pathname.startsWith(FRONTEND_ROUTES.TIMELINE);
  const isDealsActive = pathname.startsWith("/deal/details");

  return (
    <nav className={cn("flex-1 py-6 space-y-1 transition-all duration-300", isCollapsed ? "px-2" : "px-4")}>
      <Link
        href={FRONTEND_ROUTES.DASHBOARD}
        className={cn(
          "w-full flex items-center rounded-2xl text-sm font-bold transition-all",
          isCollapsed ? "justify-center px-0 py-3" : "gap-3 px-4 py-3",
          isDashboardActive || isTimelineActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
        )}
        title={isCollapsed ? "Dashboard" : undefined}
      >
        <LayoutDashboard className="w-4.5 h-4.5 shrink-0" />
        {!isCollapsed && <span>Dashboard</span>}
      </Link>

      <Link
        href={FRONTEND_ROUTES.DEAL_LISTING}
        className={cn(
          "w-full flex items-center rounded-2xl text-sm font-bold transition-all",
          isCollapsed ? "justify-center px-0 py-3" : "gap-3 px-4 py-3",
          isDealsActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
        )}
        title={isCollapsed ? "Deals" : undefined}
      >
        <Tag className="w-4.5 h-4.5 shrink-0" />
        {!isCollapsed && <span>Deals</span>}
      </Link>
    </nav>
  );
}
