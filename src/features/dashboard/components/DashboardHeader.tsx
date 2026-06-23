import React from "react";
import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  name: string;
  welcomeMessage: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  notificationCount: number;
  onNotificationClick?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  name,
  welcomeMessage,
  emailVerified,
  phoneVerified,
  notificationCount,
  onNotificationClick,
}) => {
  return (
    <header className="w-full flex flex-col gap-4 px-6 pt-6 select-none">
      {/* Profile and Notification row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar frame */}
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20 bg-muted flex items-center justify-center font-bold text-lg text-primary shadow-sm">
            {/* Fallback initials/emoji if image not present */}
            <span>👨‍💻</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-extrabold text-foreground tracking-tight leading-tight">
              Good Morning, {name}
            </h1>
            <p className="text-xs text-muted-foreground font-medium">
              {welcomeMessage}
            </p>
          </div>
        </div>

        {/* Notification Bell */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onNotificationClick}
          className="relative w-10 h-10 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground active:scale-95 transition-all"
        >
          <Bell className="w-5 h-5" />
          {notificationCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-destructive text-[10px] font-extrabold text-destructive-foreground rounded-full flex items-center justify-center border-2 border-card animate-pulse">
              {notificationCount}
            </span>
          )}
        </Button>
      </div>

      {/* Verification badging */}
      <div className="flex flex-wrap gap-2">
        {emailVerified && (
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            <Check className="w-3 h-3 text-emerald-500" />
            <span>Email Verified</span>
          </div>
        )}
        {phoneVerified && (
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            <Check className="w-3 h-3 text-emerald-500" />
            <span>Phone Verified</span>
          </div>
        )}
      </div>
    </header>
  );
};
