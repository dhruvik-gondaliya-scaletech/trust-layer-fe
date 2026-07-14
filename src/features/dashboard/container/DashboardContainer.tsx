"use client";

import React from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useDashboardData } from "@/hooks/queries/useDashboardData";
import { useUnreadNotificationsCount } from "@/hooks/queries/useNotifications";
import { useRole } from "@/providers/role-provider";
import { useAuth } from "@/providers/auth-provider";
import { fadeIn, slideUp, staggerContainer } from "@/lib/motion";
import { FRONTEND_ROUTES } from "@/lib/contants";
import { DashboardHeader } from "../components/DashboardHeader";
import { QuickActions } from "../components/QuickActions";
import { RecentDeals } from "../components/RecentDeals";
import { QuickInsights } from "../components/QuickInsights";
import { WalletCard } from "../components/WalletCard";
import { DashboardSkeleton } from "../components/DashboardSkeleton";
import { DashboardError } from "../components/DashboardError";
import { DashboardEmpty } from "../components/DashboardEmpty";
import { cn } from "@/lib/utils";

export const DashboardContainer: React.FC = () => {
  const router = useRouter();
  const { role, mounted } = useRole();
  const { user } = useAuth();

  const { data, isLoading, isError, error, refetch } = useDashboardData(
    role,
    user,
    { enabled: mounted && !!user }
  );
  const { data: unreadNotificationsCount = 0 } = useUnreadNotificationsCount({
    enabled: mounted && !!user,
  });



  // ── Action Handlers ─────────────────────────────────────────────────────
  const handleNotificationClick = () => {
    router.push(FRONTEND_ROUTES.NOTIFICATIONS);
  };

  const handleQuickActionClick = (action: { id: string; type: string; title: string }) => {
    if (action.type === "fund_escrow") {
      router.push(FRONTEND_ROUTES.FUND_ESCROW(action.id));
    } else if (action.type === "upload_tracking" || action.type === "release_funds") {
      router.push(FRONTEND_ROUTES.DEAL_TIMELINE(action.id));
    } else {
      toast.info("Opening Action Window", {
        description: `Resolving task: ${action.title}.`,
      });
    }
  };

  const handleViewAllDeals = () => {
    router.push(FRONTEND_ROUTES.DEAL_LISTING);
  };

  const handleDealClick = (deal: { id: string }) => {
    router.push(FRONTEND_ROUTES.DEAL_DETAILS(deal.id));
  };

  const handleWalletClick = () => {
    router.push(FRONTEND_ROUTES.WALLET);
  };

  const handleCreateNewDeal = () => {
    router.push(FRONTEND_ROUTES.CREATE_DEAL);
  };

  // ── State Guards ─────────────────────────────────────────────────────────
  if (isLoading || !mounted || !user) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    return (
      <DashboardResponsiveShell>
        <DashboardError
          message={error?.message || "Could not retrieve dashboard statistics."}
          onRetry={refetch}
        />
      </DashboardResponsiveShell>
    );
  }

  if (!data) {
    return (
      <DashboardResponsiveShell>
        <DashboardError message="No data received." onRetry={refetch} />
      </DashboardResponsiveShell>
    );
  }



  return (
    <>
      {/* ─── MOBILE LAYOUT (< md) ──────────────────────────────────────────── */}
      <div className="md:hidden w-full min-h-dvh bg-background flex flex-col">
        <div className="w-full max-w-[430px] mx-auto flex flex-col flex-1 relative bg-background shadow-2xl overflow-x-hidden">
          <div
            className={cn("flex-1 overflow-y-auto scrollbar-none", role === "seller" ? "pb-28" : "pb-8")}
          >
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="flex flex-col gap-6 w-full"
            >
              <motion.div variants={fadeIn}>
                <DashboardHeader
                  name={data.user.name}
                  welcomeMessage={data.user.welcomeMessage}
                  emailVerified={data.user.emailVerified}
                  phoneVerified={data.user.phoneVerified}
                  notificationCount={unreadNotificationsCount}
                // onNotificationClick={handleNotificationClick}
                />
              </motion.div>

              <motion.div variants={slideUp} className="px-5">
                <WalletCard
                  availableBalance={data.wallet.availableBalance}
                  inEscrow={data.wallet.inEscrow}
                  readyToWithdraw={data.wallet.readyToWithdraw}
                  onWalletClick={handleWalletClick}
                />
              </motion.div>

              {/* {data.quickActions.length > 0 && (
                <motion.div variants={slideUp} className="px-5">
                  <QuickActions
                    actions={data.quickActions}
                    role={role}
                    onActionClick={handleQuickActionClick}
                  />
                </motion.div>
              )} */}

              <motion.div variants={slideUp} className="px-5">
                <QuickInsights
                  activeListings={data.insights.activeListings}
                  awaitingFunds={data.insights.awaitingFunds}
                  inTransit={data.insights.inTransit}
                  completedDeals={data.insights.completedDeals}
                />
              </motion.div>

              <motion.div variants={slideUp} className="px-5 pb-4">
                <RecentDeals
                  deals={data.recentDeals.slice(0, 3)}
                  onViewAllClick={handleViewAllDeals}
                  onDealClick={handleDealClick}
                  onCreateDeal={handleCreateNewDeal}
                />
              </motion.div>
            </motion.div>
          </div>

          {role === "seller" && (
            <MobileCreateDealBar onCreateNewDeal={handleCreateNewDeal} />
          )}
        </div>
      </div>

      {/* ─── DESKTOP LAYOUT (≥ md) ─────────────────────────────────────────── */}
      <div className="hidden md:block w-full bg-background min-h-[calc(100vh-4rem)]">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-7xl mx-auto px-6 py-8"
        >
          {/* Desktop Header — greeting on the left, Create New Deal CTA on the right (role toggle is in the top navbar) */}
          <motion.div variants={fadeIn} className="mb-8">
            <DashboardHeader
              name={data.user.name}
              welcomeMessage={data.user.welcomeMessage}
              emailVerified={data.user.emailVerified}
              phoneVerified={data.user.phoneVerified}
              notificationCount={unreadNotificationsCount}
              onNotificationClick={handleNotificationClick}
              onCreateNewDeal={handleCreateNewDeal}
            />
          </motion.div>

          {/* KPI row — full width across the top */}
          <motion.div variants={slideUp} className="mb-6 xl:mb-8">
            <QuickInsights
              activeListings={data.insights.activeListings}
              awaitingFunds={data.insights.awaitingFunds}
              inTransit={data.insights.inTransit}
              completedDeals={data.insights.completedDeals}
            />
          </motion.div>

          {/* Recent Deals + Quick Actions side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-8 items-start">
            {/* ── Recent Deals column — capped to 3 ────────────────────────── */}
            <motion.div variants={slideUp}>
              <RecentDeals
                deals={data.recentDeals.slice(0, 3)}
                onViewAllClick={handleViewAllDeals}
                onDealClick={handleDealClick}
                onCreateDeal={handleCreateNewDeal}
              />
            </motion.div>

            {/* ── Right Column: Wallet + Quick Actions ─────────────────────── */}
            <div className="flex flex-col gap-6 w-full">
              <motion.div variants={slideUp}>
                <WalletCard
                  availableBalance={data.wallet.availableBalance}
                  inEscrow={data.wallet.inEscrow}
                  readyToWithdraw={data.wallet.readyToWithdraw}
                // onWalletClick={handleWalletClick}
                />
              </motion.div>

              {data.quickActions.length > 0 && (
                <motion.div variants={slideUp} className="max-h-[420px] overflow-y-auto pr-1 scrollbar-none">
                  <QuickActions
                    actions={data.quickActions}
                    role={role}
                    onActionClick={handleQuickActionClick}
                  />
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

// ── Shared sub-components ─────────────────────────────────────────────────────

/** Responsive shell used for loading / error / empty states */
const DashboardResponsiveShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="w-full min-h-dvh bg-background flex flex-col">
    {/* Mobile: constrained frame */}
    <div className="md:hidden w-full max-w-[430px] mx-auto flex flex-col flex-1 relative shadow-2xl overflow-x-hidden">
      {children}
    </div>
    {/* Desktop: centered content */}
    <div className="hidden md:flex flex-1 items-center justify-center max-w-7xl mx-auto w-full px-6 py-8">
      <div className="w-full max-w-xl">{children}</div>
    </div>
  </div>
);

/** Fixed bottom CTA bar for mobile seller view */
const MobileCreateDealBar: React.FC<{ onCreateNewDeal: () => void }> = ({ onCreateNewDeal }) => (
  <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-4 pb-6 pt-4 bg-card/95 backdrop-blur-md border-t border-border/40 z-40">
    <Button
      onClick={onCreateNewDeal}
      size="lg"
      className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-extrabold rounded-2xl h-12 shadow-lg shadow-primary/15 flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
    >
      <Plus className="w-5 h-5" />
      <span>Create New Deal</span>
    </Button>
  </div>
);
