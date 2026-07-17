"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  TrendingUp,
  Users,
  AlertCircle,
  UserCog,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FRONTEND_ROUTES } from "@/lib/contants";

interface SidebarNavProps {
  isCollapsed?: boolean;
}

export function SidebarNav({ isCollapsed }: SidebarNavProps) {
  const pathname = usePathname();

  const isDashboardActive = pathname === FRONTEND_ROUTES.DASHBOARD;
  const isDealsActive = pathname.startsWith("/deal") || pathname.startsWith("/open-deal");

  const getLinkClass = (isActive: boolean) =>
    cn(
      "w-full flex items-center rounded-xl text-sm font-semibold transition-all duration-200",
      isCollapsed ? "justify-center px-0 py-3.5" : "gap-3 px-4 py-3",
      isActive
        ? "bg-primary text-white shadow-md shadow-primary/25 font-bold"
        : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/60 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/40"
    );

  return (
    <nav className={cn("flex-1 py-6 space-y-6 transition-all duration-300", isCollapsed ? "px-2" : "px-4")}>
      {/* OVERVIEW SECTION */}
      <div className="space-y-1">
        <Link
          href={FRONTEND_ROUTES.DASHBOARD}
          className={getLinkClass(isDashboardActive)}
          title={isCollapsed ? "Dashboard" : undefined}
        >
          <LayoutDashboard className={cn("w-4.5 h-4.5 shrink-0", isDashboardActive ? "stroke-[2.5]" : "stroke-[2]")} />
          {!isCollapsed && <span>Dashboard</span>}
        </Link>

        <Link
          href={FRONTEND_ROUTES.DEAL_LISTING}
          className={getLinkClass(isDealsActive)}
          title={isCollapsed ? "Deals" : undefined}
        >
          <Briefcase className={cn("w-4.5 h-4.5 shrink-0", isDealsActive ? "stroke-[2.5]" : "stroke-[2]")} />
          {!isCollapsed && <span>Deals</span>}
        </Link>
      </div>
    </nav>
  );
}

