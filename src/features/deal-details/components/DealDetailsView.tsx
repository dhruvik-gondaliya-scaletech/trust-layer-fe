"use client";

import { Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomActionBar } from "@/components/ui/bottom-action-bar";
import { DealDetailsHero } from "./DealDetailsHero";
import { StatusBanner } from "./StatusBanner";
import { ProgressStepper } from "./ProgressStepper";
import { PaymentSummaryCard } from "./PaymentSummaryCard";
import { PartyCard } from "./PartyCard";
import { TrackingCard } from "./TrackingCard";
import type { Deal } from "@/types/api.types";
import { cn } from "@/lib/utils";
import { useRole } from "@/providers/role-provider";
import { ShareableDealLink } from "@/components/shared/ShareableDealLink";

export type DealDetailsAction =
  | { type: "confirm-delivery"; isPending: boolean }
  | { type: "review" }
  | null;

interface DealDetailsViewProps {
  deal: Deal;
  heroImageUrl: string | null;
  onBack: () => void;
  action: DealDetailsAction;
  onPrimaryAction: () => void;
  onReportIssue?: () => void;
}

export function DealDetailsView({ deal, heroImageUrl, onBack, action, onPrimaryAction, onReportIssue }: DealDetailsViewProps) {
  const hasBottomBar = action !== null;
  const { role } = useRole();

  const isSellerView = role === "seller";
  const showBuyer = isSellerView && deal.buyer;

  const partyLabel = showBuyer ? "Buyer" : "Seller";
  const partyUser = showBuyer ? deal.buyer : deal.seller;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <DealDetailsHero deal={deal} heroImageUrl={heroImageUrl} onBack={onBack} />

      <div className={cn(
        "max-w-2xl mx-auto w-full px-4 sm:px-6 flex flex-col gap-4 -mt-4 relative z-20",
        hasBottomBar ? "pb-[150px]" : "pb-10"
      )}>
        <StatusBanner deal={deal} />
        {isSellerView && (
          <ShareableDealLink dealNumber={deal.dealNumber} />
        )}
        <ProgressStepper status={deal.status} />
        <PaymentSummaryCard deal={deal} />
        <PartyCard label={partyLabel} user={partyUser} trustScore={deal.trustScore} />
        <TrackingCard deal={deal} />
      </div>

      {hasBottomBar && (
        <BottomActionBar>
          {action?.type === "confirm-delivery" && (
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

          {action?.type === "review" && (
            <Button
              onClick={onPrimaryAction}
              className="w-full h-14 text-[15px] font-bold rounded-2xl bg-primary hover:bg-primary/95 text-white flex items-center justify-center gap-2 shadow-md shadow-primary/10 transition-all active:scale-[0.98]"
            >
              <Star size={16} className="fill-current text-white shrink-0" />
              <span>Leave Review</span>
            </Button>
          )}
        </BottomActionBar>
      )}
    </div>
  );
}
