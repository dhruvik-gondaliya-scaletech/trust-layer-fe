"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/providers/auth-provider";
import { useRole } from "@/providers/role-provider";
import { FRONTEND_ROUTES } from "@/lib/contants";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  LayoutDashboard,
  Layers,
  LogOut,
  User,
  Check,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AnimatedModal } from "@/components/shared/animated-modal";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";

interface ProfileSheetProps {
  children: React.ReactNode;
}

export const ProfileSheet: React.FC<ProfileSheetProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { role } = useRole();

  const isBuyer = role === "buyer";
  const isDashboardActive = pathname === FRONTEND_ROUTES.DASHBOARD;
  const isDealsActive =
    pathname === FRONTEND_ROUTES.DEAL_LISTING || pathname.startsWith("/deal/details");

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent
          side="left"
          onCloseAutoFocus={(e) => e.preventDefault()}
          className="w-[280px] sm:w-[320px] p-6 flex flex-col justify-between h-full bg-background border-r border-border/40"
        >
          <div className="flex flex-col gap-8 flex-1">
            {/* Header */}
            <SheetHeader className="text-left space-y-4">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-primary fill-primary/10 stroke-[2.5]" />
                <span className="font-black text-lg text-foreground tracking-tight">
                  Trust<span className="text-primary">Layer</span>
                </span>
              </div>

              <div className="flex items-center gap-3.5 pt-4">
                <Avatar className="h-12 w-12 border-2 shadow-sm shrink-0">
                  {user?.profilePhotoUrl && (
                    <AvatarImage src={user.profilePhotoUrl} alt={user?.username || "user"} className="object-cover" />
                  )}
                  <AvatarFallback
                    className={cn(
                      "flex size-full items-center justify-center rounded-full text-sm",
                      isBuyer
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-primary/10 text-primary"
                    )}
                  >
                    <User className="w-6 h-6" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-extrabold text-foreground truncate">
                    {user?.firstName && user?.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : user?.firstName || user?.username || "Alex User"}
                  </span>
                  <span className="text-xs text-muted-foreground truncate max-w-[160px]">
                    @{user?.username || "alex"}
                  </span>
                  <div className="flex gap-1 items-center mt-1">
                    <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                      Verified
                    </span>
                  </div>
                </div>
              </div>
            </SheetHeader>

            {/* Nav Items */}
            <nav className="flex flex-col gap-2 pt-2">
              <Link
                href={FRONTEND_ROUTES.DASHBOARD}
                className={cn(
                  "w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all text-left",
                  isDashboardActive
                    ? isBuyer
                      ? "bg-emerald-500/10 text-emerald-600"
                      : "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                )}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>

              <Link
                href={FRONTEND_ROUTES.DEAL_LISTING}
                className={cn(
                  "w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all text-left",
                  isDealsActive
                    ? isBuyer
                      ? "bg-emerald-500/10 text-emerald-600"
                      : "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                )}
              >
                <Layers className="w-5 h-5" />
                <span>Deals Directory</span>
              </Link>
            </nav>
          </div>

          {/* Footer / Logout */}
          <div className="pt-4 border-t border-border/40">
            <button
              onClick={() => {
                setOpen(false);
                setTimeout(() => setIsLogoutModalOpen(true), 150);
              }}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold text-destructive hover:bg-destructive/10 transition-all active:scale-[0.98]"
            >
              <LogOut className="w-5 h-5" />
              <span>Log out</span>
            </button>
          </div>
        </SheetContent>
      </Sheet>

      <AnimatedModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      >
        <div className="flex flex-col items-center text-center p-4">
          <motion.div
            initial={{ scale: 0.5, rotate: -15, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 15,
              delay: 0.1,
            }}
            className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center text-red-500 dark:text-red-400 mb-5 shadow-sm border border-red-100 dark:border-red-900/30"
          >
            <LogOut size={26} className="text-red-500 dark:text-red-400" />
          </motion.div>

          <motion.h3
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.3 }}
            className="text-xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight mb-2.5"
          >
            Log Out
          </motion.h3>

          <motion.p
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="text-[14px] text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed"
          >
            Are you sure you want to log out of your TrustLayer account? You will need to sign in again to access your secure deals.
          </motion.p>

          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.3 }}
            className="flex flex-col gap-2 w-full"
          >
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="w-full">
              <Button
                variant="destructive"
                onClick={() => {
                  setIsLogoutModalOpen(false);
                  logout();
                }}
                className="w-full h-12 text-[15px] font-bold rounded-2xl bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2 shadow-md shadow-red-500/10 transition-all cursor-pointer focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
              >
                <LogOut size={16} />
                <span>Log Out</span>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="w-full">
              <Button
                variant="ghost"
                onClick={() => setIsLogoutModalOpen(false)}
                className="w-full h-12 text-[15px] font-bold rounded-2xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/60 transition-all cursor-pointer focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
              >
                Cancel
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </AnimatedModal>
    </>
  );
};
