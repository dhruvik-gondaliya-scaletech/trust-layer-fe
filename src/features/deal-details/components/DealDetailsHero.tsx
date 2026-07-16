"use client";

import { cn } from "@/lib/utils";
import { getStatusBadgeMeta } from "../utils/dealStatusMeta";
import { formatCurrency } from "../utils/format";
import type { Deal } from "@/types/api.types";
import { OrderType } from "@/types/enums";
import { BackButton } from "@/components/shared/BackButton";

interface DealDetailsHeroProps {
  deal: Deal;
  hasBottomBar?: boolean;
}

export function DealDetailsHero({ deal, hasBottomBar }: DealDetailsHeroProps) {
  const badge = getStatusBadgeMeta(deal.status);

  // Use the reference badge styling logic based on our badge text
  const getBadgeStyle = () => {
    if (badge.label === "Completed" || badge.label === "Closed") {
      return "bg-green-500/20 text-green-300 border-green-500/30";
    }
    if (badge.label === "Shipped" || badge.label === "Delivered") {
      return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    }
    return "bg-orange-500/20 text-orange-300 border-orange-500/30";
  };

  const containerClasses = cn(
    "absolute left-0 right-0 mx-auto px-4 sm:px-6 w-full max-w-2xl",
    hasBottomBar && "xl:max-w-5xl"
  );

  return (
    <div className="relative h-[280px] md:h-[320px] w-full bg-gray-900 shrink-0">
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />

      <div className={cn("top-4 flex justify-between items-center z-10", containerClasses)}>
        <BackButton />

        <div className={cn(
          "px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider backdrop-blur-md border",
          getBadgeStyle()
        )}>
          {badge.label}
        </div>
      </div>

      <div className={cn("bottom-6 z-10", containerClasses)}>
        <div className="w-full">
          <p className="text-gray-300 font-bold text-[13px] mb-1 uppercase tracking-wider">{deal.dealNumber}</p>
          <h1 className="text-white text-[24px] md:text-[28px] font-extrabold leading-tight mb-2 tracking-tight truncate">{deal.title}</h1>
          <div className="flex items-center justify-between">
            <span className="text-white/80 text-[14px] font-medium truncate pr-4">{deal?.condition}</span>
            <div className="text-right">
              <span className="text-white text-[24px] md:text-[28px] font-black shrink-0">${formatCurrency(deal.buyerPaysAmount)}</span>
              {deal.orderType !== OrderType.IN_PERSON && (
                <p className="text-[11px] font-bold text-white/60 -mt-0.5">
                  {Number(deal.shippingCost) > 0
                    ? `Includes $${formatCurrency(deal.shippingCost)} shipping`
                    : "Includes free shipping"}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
