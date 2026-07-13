"use client";

import React from "react";
import { Bell, Plus, Store, ShoppingCart, User } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRole } from "@/providers/role-provider";
import { cn } from "@/lib/utils";
import { Role } from "@/types/enums";

import { ProfileSheet } from "@/components/shared/ProfileSheet";

interface DashboardHeaderProps {
  name: string;
  welcomeMessage: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  notificationCount: number;
  onNotificationClick?: () => void;
  onCreateNewDeal?: () => void;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  name,
  notificationCount,
  onNotificationClick,
  onCreateNewDeal,
}) => {
  const { role, setRole } = useRole();
  const greeting = getGreeting();

  return (
    <header className="w-full flex flex-col gap-4 px-5 pt-6 md:px-0 md:pt-0 select-none">
      {/* Row 1: Avatar + Greeting + Bell (Bell hidden on desktop — it's in the top navbar) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          {/* Avatar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, type: "spring" }}
          >
            <ProfileSheet>
              <button
                className="h-[52px] w-[52px] bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/20 shadow-sm shrink-0 overflow-hidden text-primary cursor-pointer hover:scale-105 active:scale-95 transition-all outline-none"
              >
                <User className="w-6 h-6" />
              </button>
            </ProfileSheet>
          </motion.div>

          {/* Greeting */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-col justify-center"
          >
            <h1 className="text-[18px] font-extrabold text-foreground tracking-tight leading-tight md:text-[22px]">
              {greeting}, {name}
            </h1>
          </motion.div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Notification Bell — only on mobile (desktop has it in the fixed navbar) */}
          <div className="relative shrink-0 md:hidden">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2, type: "spring" }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={onNotificationClick}
                className="h-11 w-11 bg-card rounded-full border border-border/40 shadow-sm text-foreground hover:bg-muted/40 active:scale-95 transition-all"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5 text-foreground" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-[18px] w-[18px] bg-rose-500 text-[9px] font-extrabold text-white rounded-full border-2 border-card flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </Button>
            </motion.div>
          </div>

          {/* Create New Deal — desktop only, seller role (mobile has the fixed bottom bar) */}
          {role === Role.SELLER && onCreateNewDeal && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="hidden md:block"
            >
              <Button
                onClick={onCreateNewDeal}
                className="bg-primary hover:bg-primary/95 text-primary-foreground font-extrabold rounded-2xl h-11 px-5 shadow-lg shadow-primary/15 flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Deal</span>
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Row 2: Animated Role Toggle — only on mobile (desktop has it in the fixed navbar) */}
      <div className="md:hidden flex bg-muted p-1 rounded-xl w-full relative">
        {/* Animated sliding background — bg-primary already tracks the active role's color */}
        <motion.div
          className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg bg-primary"
          animate={{
            left: role === Role.SELLER ? "4px" : "calc(50% + 2px)",
          }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
        />

        <button
          onClick={() => setRole(Role.SELLER)}
          className={cn(
            "flex-1 py-2 text-[12px] font-bold rounded-lg transition-colors relative z-10 flex items-center justify-center gap-1.5",
            role === Role.SELLER ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          )}
          aria-pressed={role === Role.SELLER}
        >
          <Store className="w-3.5 h-3.5" />
          SELLER
        </button>

        <button
          onClick={() => setRole(Role.BUYER)}
          className={cn(
            "flex-1 py-2 text-[12px] font-bold rounded-lg transition-colors relative z-10 flex items-center justify-center gap-1.5",
            role === Role.BUYER ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          )}
          aria-pressed={role === Role.BUYER}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          BUYER
        </button>
      </div>
    </header>
  );
};
