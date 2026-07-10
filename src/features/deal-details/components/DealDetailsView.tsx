"use client";

import { useState } from "react";
import { Loader2, Star, Edit, Trash2 } from "lucide-react";
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
import type { Deal } from "@/types/api.types";
import { cn } from "@/lib/utils";
import { useRole } from "@/providers/role-provider";
import { ShareableDealLink } from "@/components/shared/ShareableDealLink";
import { useRouter } from "next/navigation";
import { FRONTEND_ROUTES } from "@/lib/contants";

export type DealDetailsAction =
  | { type: "confirm-delivery"; isPending: boolean }
  | { type: "review" }
  | { type: "publish"; isPending: boolean }
  | null;

interface DealDetailsViewProps {
  deal: Deal;
  onBack: () => void;
  action: DealDetailsAction;
  onPrimaryAction: () => void;
  onReportIssue?: () => void;
  onPublish?: () => void;
  isPublishPending?: boolean;
  onDelete?: () => void;
  isDeletePending?: boolean;
}

export function DealDetailsView({
  deal,
  onBack,
  action,
  onPrimaryAction,
  onReportIssue,
  onPublish,
  isPublishPending = false,
  onDelete,
  isDeletePending = false,
}: DealDetailsViewProps) {
  const router = useRouter();
  const { role } = useRole();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const isSellerView = role === "seller";
  const showBuyer = isSellerView && deal.buyer;

  const partyLabel = showBuyer ? "Buyer" : "Seller";
  const partyUser = showBuyer ? deal.buyer : deal.seller;

  const showSellerActions = isSellerView;
  const showBuyerActions = !isSellerView && action !== null;

  const hasBottomBar = showSellerActions || showBuyerActions;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <DealDetailsHero deal={deal} onBack={onBack} />

      <div className={cn(
        "max-w-2xl mx-auto w-full px-4 sm:px-6 flex flex-col gap-4 -mt-4 relative z-20",
        hasBottomBar ? "pb-[150px]" : "pb-10"
      )}>
        <StatusBanner deal={deal} />
        {isSellerView && deal.status !== "draft" && (
          <ShareableDealLink dealNumber={deal.dealNumber} />
        )}
        <ProgressStepper status={deal.status} />
        <MediaDetailsCard deal={deal} />
        <PaymentSummaryCard deal={deal} />
        <PartyCard label={partyLabel} user={partyUser} trustScore={deal.trustScore} />
        <TrackingCard deal={deal} />
      </div>

      {hasBottomBar && (
        <BottomActionBar>
          {showBuyerActions && action?.type === "confirm-delivery" && (
            <>
              <Button
                onClick={onPrimaryAction}
                disabled={action.isPending}
                className="w-full h-14 text-[15px] font-bold rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center gap-2"
              >
                {action.isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Confirming...
                  </>
                ) : (
                  "Confirm Delivery"
                )}
              </Button>
              {onReportIssue && (
                <Button
                  variant="outline"
                  onClick={onReportIssue}
                  disabled={action.isPending}
                  className="w-full h-12 text-[14px] font-bold rounded-2xl border-destructive/40 text-destructive hover:bg-destructive/5"
                >
                  Report an Issue
                </Button>
              )}
            </>
          )}

          {showBuyerActions && action?.type === "review" && (
            <Button
              onClick={onPrimaryAction}
              className="w-full h-14 text-[15px] font-bold rounded-2xl bg-primary hover:bg-primary/95 text-white flex items-center justify-center gap-2 shadow-md shadow-primary/10 transition-all active:scale-[0.98]"
            >
              <Star size={16} className="fill-current text-white shrink-0" />
              <span>Leave Review</span>
            </Button>
          )}

          {showSellerActions && (
            <>
              {deal.status === "draft" && (
                <div className="flex gap-3 w-full">
                  <Button
                    variant="outline"
                    onClick={() => router.push(FRONTEND_ROUTES.DEAL_UPDATE(deal.id))}
                    className="flex-1 h-14 text-[15px] font-bold rounded-2xl border-slate-200 text-slate-700 hover:bg-slate-50 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4 text-slate-500" />
                    <span>Edit Deal</span>
                  </Button>
                  <Button
                    onClick={onPublish}
                    disabled={isPublishPending}
                    className="flex-1 h-14 text-[15px] font-bold rounded-2xl bg-primary hover:bg-primary/95 text-white shadow-md shadow-primary/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    {isPublishPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Publishing...</span>
                      </>
                    ) : (
                      <span>Publish Deal</span>
                    )}
                  </Button>
                </div>
              )}

              {deal.status === "open" && (
                <div className="flex gap-3 w-full">
                  <Button
                    variant="outline"
                    onClick={() => router.push(FRONTEND_ROUTES.DEAL_UPDATE(deal.id))}
                    className="flex-1 h-14 text-[15px] font-bold rounded-2xl border-slate-200 text-slate-700 hover:bg-slate-50 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4 text-slate-500" />
                    <span>Edit Deal</span>
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => setIsDeleteModalOpen(true)}
                    disabled={isDeletePending}
                    className="flex-1 h-14 text-[15px] font-bold rounded-2xl bg-destructive hover:bg-destructive/90 text-white flex items-center justify-center gap-2 shadow-md shadow-destructive/10 transition-all active:scale-[0.98]"
                  >
                    {isDeletePending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 text-white" />
                        <span>Delete Deal</span>
                      </>
                    )}
                  </Button>
                </div>
              )}

              {deal.status !== "draft" && deal.status !== "open" && (
                <Button
                  variant="outline"
                  onClick={() => router.push(FRONTEND_ROUTES.DEAL_UPDATE(deal.id))}
                  className="w-full h-14 text-[15px] font-bold rounded-2xl border-slate-200 text-slate-700 hover:bg-slate-50 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4 text-slate-500" />
                  <span>Edit Deal</span>
                </Button>
              )}
            </>
          )}
        </BottomActionBar>
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
                    <Loader2 className="w-4 h-4 animate-spin" />
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
