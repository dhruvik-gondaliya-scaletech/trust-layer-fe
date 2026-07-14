"use client";

import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomActionBar } from "@/components/ui/bottom-action-bar";
import { AnimatedModal } from "@/components/shared/animated-modal";
import { motion } from "framer-motion";
import { DealDetailsHero } from "./DealDetailsHero";
import { StatusBanner } from "./StatusBanner";
import { ProgressStepper } from "./ProgressStepper";
import { MediaDetailsCard } from "./MediaDetailsCard";
import { PaymentSummaryCard } from "./PaymentSummaryCard";
import { PartyCard } from "./PartyCard";
import { TrackingCard } from "./TrackingCard";
import { SellerActions } from "./SellerActions";
import { BuyerActions } from "./BuyerActions";
import type { Deal } from "@/types/api.types";
import { DealStatus, DealDetailsActionType } from "@/types/enums";
import { cn } from "@/lib/utils";
import { ShareableDealLink } from "@/components/shared/ShareableDealLink";

export type DealDetailsAction =
  | { type: DealDetailsActionType.CONFIRM_DELIVERY; isPending: boolean }
  | { type: DealDetailsActionType.REVIEW }
  | { type: DealDetailsActionType.PUBLISH; isPending: boolean }
  | null;

interface DealDetailsViewProps {
  deal: Deal;
  action: DealDetailsAction;
  onPrimaryAction: () => void;
  onReportIssue?: () => void;
  onPublish?: () => void;
  isPublishPending?: boolean;
  onDelete?: () => void;
  isDeletePending?: boolean;
  isSeller: boolean;
  isBuyer: boolean;
}

export function DealDetailsView({
  deal,
  action,
  onPrimaryAction,
  onReportIssue,
  onPublish,
  isPublishPending = false,
  onDelete,
  isDeletePending = false,
  isSeller,
  isBuyer,
}: DealDetailsViewProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const isSellerView = isSeller;
  const showBuyer = isSellerView && deal.buyer;

  const partyLabel = showBuyer ? "Buyer" : "Seller";
  const partyUser = showBuyer ? deal.buyer : deal.seller;

  const hasBottomBar = isSeller || isBuyer;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <DealDetailsHero deal={deal} />

      <div className={cn(
        "max-w-2xl mx-auto w-full px-4 sm:px-6 -mt-4 relative z-20",
        hasBottomBar ? "lg:max-w-5xl pb-[150px] lg:pb-10" : "pb-10"
      )}>
        <div className={cn(
          "flex flex-col gap-4",
          hasBottomBar && "lg:grid lg:grid-cols-3 lg:gap-6 lg:items-start"
        )}>
          {/* Main details column */}
          <div className={cn("flex flex-col gap-4", hasBottomBar && "lg:col-span-2")}>
            <StatusBanner deal={deal} />
            {isSellerView && deal.status !== DealStatus.DRAFT && (
              <ShareableDealLink dealNumber={deal.dealNumber} />
            )}
            <ProgressStepper status={deal.status} />
            <MediaDetailsCard deal={deal} />
            <PaymentSummaryCard deal={deal} />
            <PartyCard label={partyLabel} user={partyUser} trustScore={deal.trustScore} />
            <TrackingCard deal={deal} />
          </div>

          {/* Sticky sidebar on desktop */}
          {hasBottomBar && (
            <div className="hidden lg:block lg:col-span-1 lg:sticky lg:top-24">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    Deal Actions
                  </h3>
                  <p className="text-[12px] text-slate-400 font-medium leading-tight">
                    Manage and update the status of this deal.
                  </p>
                </div>
                <div className="h-px bg-slate-100 w-full my-1" />
                {isSeller && (
                  <SellerActions
                    deal={deal}
                    onPublish={onPublish}
                    isPublishPending={isPublishPending}
                    onDeleteClick={() => setIsDeleteModalOpen(true)}
                    isDeletePending={isDeletePending}
                  />
                )}

                {isBuyer && (
                  <BuyerActions
                    deal={deal}
                    action={action}
                    onPrimaryAction={onPrimaryAction}
                    onReportIssue={onReportIssue}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {hasBottomBar && (
        <div className="lg:hidden">
          <BottomActionBar>
            {isSeller && (
              <SellerActions
                deal={deal}
                onPublish={onPublish}
                isPublishPending={isPublishPending}
                onDeleteClick={() => setIsDeleteModalOpen(true)}
                isDeletePending={isDeletePending}
              />
            )}

            {isBuyer && (
              <BuyerActions
                deal={deal}
                action={action}
                onPrimaryAction={onPrimaryAction}
                onReportIssue={onReportIssue}
              />
            )}
          </BottomActionBar>
        </div>
      )}

      <AnimatedModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          if (!isDeletePending) {
            setIsDeleteModalOpen(false);
          }
        }}
        showCloseButton={!isDeletePending}
        closeOnOverlayClick={!isDeletePending}
        closeOnEsc={!isDeletePending}
      >
        <div className="flex flex-col items-center text-center p-4">
          {/* Animated Warning Icon with custom spring bounce */}
          <motion.div
            initial={{ scale: 0.5, rotate: -15, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 15,
              delay: 0.1
            }}
            className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center text-red-500 dark:text-red-400 mb-5 shadow-sm border border-red-100 dark:border-red-900/30"
          >
            <Trash2 size={26} className="text-red-500 dark:text-red-400" />
          </motion.div>

          {/* Animated Header */}
          <motion.h3
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.3 }}
            className="text-xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight mb-2.5"
          >
            Delete Deal
          </motion.h3>

          {/* Animated Description */}
          <motion.p
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="text-[14px] text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed"
          >
            Are you sure you want to delete this deal? This action cannot be undone, and all transaction details will be permanently removed.
          </motion.p>

          {/* Animated Actions */}
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.3 }}
            className="flex flex-col gap-2 w-full"
          >
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="w-full">
              <Button
                variant="destructive"
                disabled={isDeletePending}
                onClick={async () => {
                  try {
                    onDelete?.();
                  } catch (e) {
                    setIsDeleteModalOpen(false);
                  }
                }}
                className="w-full h-12 text-[15px] font-bold rounded-2xl bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2 shadow-md shadow-red-500/10 transition-all cursor-pointer focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
              >
                {isDeletePending ? (
                  <>
                    <Spinner className="w-4 h-4" />
                    <span>Deleting Deal...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    <span>Delete Deal</span>
                  </>
                )}
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="w-full">
              <Button
                variant="ghost"
                disabled={isDeletePending}
                onClick={() => setIsDeleteModalOpen(false)}
                className="w-full h-12 text-[15px] font-bold rounded-2xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/60 transition-all cursor-pointer focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
              >
                Cancel
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </AnimatedModal>
    </div>
  );
}
