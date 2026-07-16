"use client";

import React from "react";
import { Shield, LogOut, Check, User as UserIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { SidebarNav } from "@/features/dashboard/components/SidebarNav";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { User } from "@/types/api.types";

interface SidebarProps {
  user: User | null | undefined;
  onLogoutTrigger: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  onLogoutTrigger,
  isCollapsed,
  onToggleCollapse,
}) => {
  return (
    <aside
      className={cn(
        "hidden md:flex md:flex-col md:shrink-0 bg-card border-r border-border/40 h-screen sticky top-0 z-30 select-none relative transition-all duration-300 ease-in-out",
        isCollapsed ? "md:w-20" : "md:w-64"
      )}
    >
      {/* Floating Toggle Button */}
      <button
        onClick={onToggleCollapse}
        className="absolute -right-3 top-[76px] z-50 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground shadow-md hover:bg-muted/80 transition-transform active:scale-95 cursor-pointer"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Brand Header */}
      <div
        className={cn(
          "h-16 flex items-center border-b border-border/30 transition-all duration-300",
          isCollapsed ? "px-0 justify-center" : "px-6 gap-2"
        )}
      >
        <Shield className="w-6 h-6 text-primary fill-primary/10 stroke-[2.5] shrink-0" />
        {!isCollapsed && (
          <span className="font-black text-lg text-foreground tracking-tight whitespace-nowrap animate-fade-in">
            Trust<span className="text-primary">Layer</span>
          </span>
        )}
      </div>

      {/* Navigation Links */}
      <SidebarNav isCollapsed={isCollapsed} />

      {/* Logout & User Card */}
      <div
        className={cn(
          "p-4 border-t border-border/40 bg-muted/20 flex flex-col gap-4 transition-all duration-300",
          isCollapsed ? "p-2 items-center" : "p-4"
        )}
      >
        <button
          onClick={onLogoutTrigger}
          className={cn(
            "w-full flex items-center rounded-xl text-xs font-bold text-destructive hover:bg-destructive/10 transition-all active:scale-[0.98] cursor-pointer",
            isCollapsed ? "justify-center p-2.5" : "gap-2.5 px-4 py-2.5"
          )}
          title={isCollapsed ? "Log out" : undefined}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Log out</span>}
        </button>

        <div
          className={cn(
            "flex items-center gap-3 px-2 w-full",
            isCollapsed && "justify-center px-0"
          )}
        >
          <Avatar size="lg" className="border border-primary/20 shrink-0">
            {user?.profilePhotoUrl && (
              <AvatarImage src={user.profilePhotoUrl} alt={user?.username || "user"} className="object-cover" />
            )}
            <AvatarFallback className="bg-primary/10 text-primary">
              <UserIcon className="w-5 h-5" />
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-extrabold text-foreground truncate">
                {user?.firstName && user?.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user?.firstName || user?.username || "Alex User"}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                @{user?.username || "alex"}
              </span>
              <div className="flex gap-1 items-center mt-1">
                <Check className="w-3 h-3 text-emerald-500 stroke-[3]" />
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                  Verified
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
