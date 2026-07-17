"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Star, Truck, CreditCard, CheckCircle2, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { FRONTEND_ROUTES } from "@/lib/contants";
import { DealStatus, DealDetailsActionType } from "@/types/enums";
import type { Deal } from "@/types/api.types";
import type { DealDetailsAction } from "./DealDetailsView";

interface BuyerActionsProps {
  deal: Deal;
  action: DealDetailsAction;
  onPrimaryAction: () => void;
  onReportIssue?: () => void;
}

export function BuyerActions({
  deal,
  action,
  onPrimaryAction,
  onReportIssue,
}: BuyerActionsProps) {
  const router = useRouter();

  switch (deal.status) {
    case DealStatus.DRAFT:
      return (
        <div className="w-full text-center text-xs font-semibold text-slate-500 bg-slate-100/80 rounded-xl py-3 px-4 border border-slate-100">
          Draft deal. Waiting for seller to publish.
        </div>
      );

    case DealStatus.OPEN:
      return (
        <div className="flex flex-col gap-3 w-full">
          <Button
            onClick={() => router.push(FRONTEND_ROUTES.FUND_ESCROW(deal.dealNumber))}
            className="w-full h-14 text-[15px] font-bold rounded-2xl bg-primary hover:bg-primary/95 text-white shadow-md shadow-primary/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <CreditCard className="w-4 h-4" />
            <span>Proceed to Secure Payment</span>
          </Button>
        </div>
      );

    case DealStatus.FUNDED:
      return (
        <div className="flex flex-col gap-3 w-full">
          <div className="text-center text-xs font-semibold text-emerald-600 bg-emerald-50 rounded-xl py-3 px-4 border border-emerald-100 flex flex-col gap-1 items-center">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Payment secured.</span>
            </div>
            <span className="text-[11px] text-emerald-600/80 font-normal">Waiting for seller to ship and provide tracking details.</span>
          </div>
        </div>
      );

    case DealStatus.SHIPPED:
      return (
        <div className="flex flex-col gap-3 w-full">
          <Button
            onClick={onPrimaryAction}
            disabled={action?.type === DealDetailsActionType.CONFIRM_DELIVERY && action.isPending}
            className="w-full h-14 text-[15px] font-bold rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center gap-2 shadow-md shadow-emerald-500/10 transition-all active:scale-[0.98]"
          >
            {action?.type === DealDetailsActionType.CONFIRM_DELIVERY && action.isPending ? (
              <>
                <Spinner className="size-4" /> Confirming...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Delivery</span>
              </>
            )}
          </Button>
          <div className="flex flex-row gap-3 w-full xl:flex-col xl:gap-2">
            <Button
              variant="outline"
              onClick={() => router.push(FRONTEND_ROUTES.VIEW_TRACKING(deal.id))}
              className="flex-1 w-full h-14 text-[15px] font-bold rounded-2xl border-slate-200 text-slate-700 hover:bg-slate-50 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Truck className="w-4 h-4 text-slate-500" />
              <span>View Tracking</span>
            </Button>
            {onReportIssue && (
              <Button
                variant="outline"
                onClick={onReportIssue}
                className="flex-1 w-full h-14 text-[15px] font-bold rounded-2xl border-red-100 text-red-600 hover:bg-red-50/50 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <ShieldAlert className="w-4 h-4 text-red-500" />
                <span>Report Issue</span>
              </Button>
            )}
          </div>
        </div>
      );

    case DealStatus.DELIVERED:
    case DealStatus.CLOSED:
      return (
        <div className="flex flex-col gap-3 w-full">
          <div className="text-center text-xs font-semibold text-emerald-600 bg-emerald-50 rounded-xl py-2 px-3 flex items-center justify-center gap-1.5 border border-emerald-100">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>
              {deal.status === DealStatus.DELIVERED
                ? "Item Delivered!"
                : "Deal Closed & Funds Released!"}
            </span>
          </div>
          <Button
            onClick={onPrimaryAction}
            className="w-full h-14 text-[15px] font-bold rounded-2xl bg-primary hover:bg-primary/95 text-white flex items-center justify-center gap-2 shadow-md shadow-primary/10 transition-all active:scale-[0.98]"
          >
            <Star size={16} className="fill-current text-white shrink-0" />
            <span>Leave Review</span>
          </Button>
        </div>
      );

    case DealStatus.DISPUTED:
    case DealStatus.RETURN_APPROVED:
    case DealStatus.RETURN_SHIPPED:
    case DealStatus.RETURN_DELIVERED:
    case DealStatus.RETURN_COMPLETED:
      return (
        <div className="flex flex-col gap-3 w-full">
          <div className="text-center text-xs font-semibold text-rose-600 bg-rose-50 rounded-xl py-3 px-4 border border-rose-100 flex flex-col gap-1 items-center">
            <div className="flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
              <span className="capitalize">Status: {deal.status.replace("_", " ")}</span>
            </div>
            <span className="text-[11px] text-rose-600/80 font-normal">This deal has an active dispute.</span>
          </div>
          <Button
            onClick={() => router.push(FRONTEND_ROUTES.DISPUTE_DETAILS(deal.id))}
            className="w-full h-14 text-[15px] font-bold rounded-2xl bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>View Dispute Details</span>
          </Button>
        </div>
      );

    default:
      return (
        <div className="flex flex-col gap-3 w-full">
          <div className="text-center text-xs font-semibold text-amber-600 bg-amber-50 rounded-xl py-3 px-4 border border-amber-100 flex flex-col gap-1 items-center">
            <div className="flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
              <span className="capitalize">Status: {deal.status.replace("_", " ")}</span>
            </div>
          </div>
          <Button
            onClick={() => router.push(FRONTEND_ROUTES.DASHBOARD)}
            className="w-full h-14 text-[15px] font-bold rounded-2xl bg-slate-900 hover:bg-slate-800 text-white shadow-md transition-all active:scale-[0.98]"
          >
            Return to Dashboard
          </Button>
        </div>
      );
  }
}
