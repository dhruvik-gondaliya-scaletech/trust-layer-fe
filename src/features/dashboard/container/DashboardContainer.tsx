"use client";

import React from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDashboardData } from "@/hooks/queries/useDashboardData";
import { DashboardHeader } from "../components/DashboardHeader";
import { QuickActions } from "../components/QuickActions";
import { RecentDeals } from "../components/RecentDeals";
import { QuickInsights } from "../components/QuickInsights";
import { YourActivity } from "../components/YourActivity";
import { WalletCard } from "../components/WalletCard";
import { DashboardSkeleton } from "../components/DashboardSkeleton";
import { DashboardError } from "../components/DashboardError";
import { DashboardEmpty } from "../components/DashboardEmpty";
import { fadeIn, slideUp, staggerContainer } from "@/lib/motion";

export const DashboardContainer: React.FC = () => {
  // Query hook to fetch simulated dashboard data
  const { data, isLoading, isError, error, refetch } = useDashboardData();

  // Action callback handlers
  const handleNotificationClick = () => {
    toast.info("Notifications Panel", {
      description: "You have no new critical system alerts.",
    });
  };

  const handleQuickActionClick = (action: any) => {
    toast.success(`Opening Action Window`, {
      description: `Resolving task: ${action.title}.`,
    });
  };

  const handleViewAllDeals = () => {
    toast.info("Navigating to Deals Hub", {
      description: "Redirecting to all transaction records...",
    });
  };

  const handleDealClick = (deal: any) => {
    toast.info(`Opening Deal Profile`, {
      description: `Viewing details for ${deal.title} (${deal.price})`,
    });
  };

  const handleActivityClick = (type: "selling" | "buying") => {
    toast.info(`Filtering Activity`, {
      description: `Showing active ${type} contracts.`,
    });
  };

  const handleWithdrawClick = () => {
    toast.success("Withdrawal Initiated", {
      description: "Processing your transfer requests...",
    });
  };

  const handleHistoryClick = () => {
    toast.info("Opening Wallet Ledger", {
      description: "Loading deposit and withdrawal history.",
    });
  };

  const handleCreateNewDeal = () => {
    toast.success("Create Deal Form Launched", {
      description: "Configure your new escrow transaction details.",
    });
  };

  // State Boundaries
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    return (
      <DashboardError
        message={error?.message || "Could not retrieve dashboard statistics."}
        onRetry={refetch}
      />
    );
  }

  if (!data) {
    return <DashboardError message="No data received." onRetry={refetch} />;
  }

  // Check if deals are empty to show the empty state screen
  const isEmpty = data.recentDeals.length === 0;

  if (isEmpty) {
    return (
      <DashboardEmpty
        name={data.user.name}
        onCreateDeal={handleCreateNewDeal}
      />
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden">
      {/* Scrollable Container */}
      <div className="flex-1 overflow-y-auto scrollbar-none pb-28">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="w-full flex flex-col gap-6 pt-6"
        >
          {/* 1. Header Row */}
          <motion.div variants={fadeIn}>
            <DashboardHeader
              name={data.user.name}
              welcomeMessage={data.user.welcomeMessage}
              emailVerified={data.user.emailVerified}
              phoneVerified={data.user.phoneVerified}
              notificationCount={data.user.notificationCount}
              onNotificationClick={handleNotificationClick}
            />
          </motion.div>

          {/* 4. Quick Insights */}
          <motion.div variants={slideUp}>
            <QuickInsights
              activeListings={data.insights.activeListings}
              awaitingFunds={data.insights.awaitingFunds}
              inTransit={data.insights.inTransit}
              completedDeals={data.insights.completedDeals}
            />
          </motion.div>

          {/* 2. Actions Alert */}
          <motion.div variants={slideUp}>
            <QuickActions
              actions={data.quickActions}
              onActionClick={handleQuickActionClick}
            />
          </motion.div>

          {/* 3. Recent Deals */}
          <motion.div variants={slideUp}>
            <RecentDeals
              deals={data.recentDeals}
              onViewAllClick={handleViewAllDeals}
              onDealClick={handleDealClick}
            />
          </motion.div>

          {/* 5. Buying/Selling Activity */}
          <motion.div variants={slideUp}>
            <YourActivity
              sellingActive={data.activity.sellingActive}
              buyingActive={data.activity.buyingActive}
              onSellingClick={() => handleActivityClick("selling")}
              onBuyingClick={() => handleActivityClick("buying")}
            />
          </motion.div>

          {/* 6. Wallet card */}
          <motion.div variants={slideUp}>
            <WalletCard
              availableBalance={data.wallet.availableBalance}
              inEscrow={data.wallet.inEscrow}
              readyToWithdraw={data.wallet.readyToWithdraw}
              onWithdrawClick={handleWithdrawClick}
              onHistoryClick={handleHistoryClick}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* 7. Sticky Bottom Actions Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-card via-card/95 to-transparent pt-12 pointer-events-none z-20">
        <Button
          onClick={handleCreateNewDeal}
          size="lg"
          className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-extrabold rounded-2xl h-12 shadow-lg shadow-primary/15 flex items-center justify-center gap-2 pointer-events-auto active:scale-[0.98] transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Create New Deal</span>
        </Button>
      </div>
    </div>
  );
};
