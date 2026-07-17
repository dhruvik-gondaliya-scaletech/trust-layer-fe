"use client";

import { cn } from "@/lib/utils";
import { getStatusBadgeMeta } from "../utils/dealStatusMeta";
import { formatCurrency } from "../utils/format";
import type { Deal } from "@/types/api.types";
import { OrderType } from "@/types/enums";
import { BackButton } from "@/components/shared/BackButton";
import { mapProductTypeToCategory, getStatusBadgeStyle } from "@/utils/deal";

interface DealDetailsHeroProps {
  deal: Deal;
  hasBottomBar?: boolean;
}

function formatRelativeTime(dateString: string | null | undefined): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? "minute" : "minutes"} ago`;
  if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
  
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function DealDetailsHero({ deal, hasBottomBar }: DealDetailsHeroProps) {
  const badge = getStatusBadgeMeta(deal.status);

  const containerClasses = cn(
    "max-w-2xl mx-auto w-full px-4 sm:px-6 pt-6 md:pt-8",
    hasBottomBar && "xl:max-w-5xl"
  );

  return (
    <div className="w-full bg-transparent shrink-0">
      <div className={containerClasses}>
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <BackButton 
            label="Back to Deals" 
            variant="ghost"
            displayStyle="inline"
            className="text-slate-500 hover:text-slate-800 p-0 h-auto hover:bg-transparent font-semibold text-[14px]" 
          />
        </div>

        {/* Title, Badge & Subtitle */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mt-6 pb-2">
          {/* Left Side: Title, badge, and metadata subtitle */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-slate-900 text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">
                {deal.title}
              </h1>
              <span className={cn(
                "px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border",
                getStatusBadgeStyle(deal.status)
              )}>
                {badge.label}
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-slate-400 text-[13px] font-medium mt-2">
              <span className="text-slate-500 font-bold">{deal.dealNumber}</span>
              <span className="text-slate-300">•</span>
              <span>{mapProductTypeToCategory(deal.productType) || "Collectibles"}</span>
              <span className="text-slate-300">•</span>
              <span>Created {new Date(deal.createdAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}</span>
              <span className="text-slate-300">•</span>
              <span>Updated {formatRelativeTime(deal.updatedAt)}</span>
            </div>
          </div>

          {/* Right Side: Price & Shipping */}
          <div className="flex flex-col items-start md:items-end shrink-0">
            <span className="text-slate-900 text-2xl md:text-3xl font-black">${formatCurrency(deal.buyerPaysAmount)}</span>
            {deal.orderType !== OrderType.IN_PERSON && (
              <span className="text-[11px] font-bold text-slate-400 mt-0.5">
                {Number(deal.shippingCost) > 0
                  ? `Includes $${formatCurrency(deal.shippingCost)} shipping`
                  : "Includes free shipping"}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

