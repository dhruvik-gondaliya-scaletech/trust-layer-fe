"use client";

import React from "react";
import { Shield, LogOut, Check, User as UserIcon } from "lucide-react";
import { SidebarNav } from "@/features/dashboard/components/SidebarNav";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { User } from "@/types/api.types";

interface SidebarProps {
  user: User | null | undefined;
  onLogoutTrigger: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ user, onLogoutTrigger }) => {
  return (
    <aside className="hidden md:flex md:flex-col md:w-64 md:shrink-0 bg-card border-r border-border/40 h-screen sticky top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="px-6 h-16 flex items-center gap-2 border-b border-border/30">
        <Shield className="w-6 h-6 text-primary fill-primary/10 stroke-[2.5]" />
        <span className="font-black text-lg text-foreground tracking-tight">
          Trust<span className="text-primary">Layer</span>
        </span>
      </div>

      {/* Navigation Links */}
      <SidebarNav />

      {/* Logout & User Card */}
      <div className="p-4 border-t border-border/40 bg-muted/20 flex flex-col gap-4">
        <button
          onClick={onLogoutTrigger}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold text-destructive hover:bg-destructive/10 transition-all active:scale-[0.98] cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Log out</span>
        </button>

        <div className="flex items-center gap-3 px-2">
          <Avatar size="lg" className="border border-primary/20 shrink-0">
            {user?.profilePhotoUrl && (
              <AvatarImage src={user.profilePhotoUrl} alt={user?.username || "user"} className="object-cover" />
            )}
            <AvatarFallback className="bg-primary/10 text-primary">
              <UserIcon className="w-5 h-5" />
            </AvatarFallback>
          </Avatar>
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
        </div>
      </div>
    </aside>
  );
};
