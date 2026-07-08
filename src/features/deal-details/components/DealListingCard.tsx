"use client";

import React from "react";
import { ChevronRight, Flame, Gamepad2, Heart, User, Package, Layers, Calendar } from "lucide-react";
import type { Deal } from "@/types/api.types";
import { getStatusBadgeMeta } from "../utils/dealStatusMeta";
import { formatCurrency, cn } from "@/lib/utils";

const PRODUCT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  trading_cards: Flame,
  sports_cards: Layers,
  toy: Gamepad2,
  plush: Heart,
  figure: User,
  other: Package,
};

interface DealListingCardProps {
  deal: Deal;
  currentUserId: string;
  onClick: (deal: Deal) => void;
}

export const DealListingCard: React.FC<DealListingCardProps> = ({
  deal,
  currentUserId,
  onClick,
}) => {
  const isSeller = deal.sellerId === currentUserId;
  const dealRole = isSeller ? "Selling" : "Buying";

  const { label: statusLabel, className: statusClass } = getStatusBadgeMeta(deal.status);
  const IconComponent = PRODUCT_ICONS[deal.productType] || Package;

  // Format date safely
  const formattedDate = deal.createdAt
    ? new Date(deal.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <div
      onClick={() => onClick(deal)}
      className="group relative bg-card hover:bg-slate-50/50 dark:hover:bg-slate-900/50 border border-border/80 rounded-2xl p-4 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div className="flex items-start gap-4">
        {/* Product Type Icon */}
        <div className="w-12 h-12 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/10 flex items-center justify-center text-primary shrink-0 transition-transform group-hover:scale-105">
          <IconComponent className="w-6 h-6" />
        </div>

        {/* Details */}
        <div className="flex flex-col gap-1 text-left">
          <h3 className="font-bold text-[16px] text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-1">
            {deal.title}
          </h3>
          
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-muted-foreground">
            <span className="font-semibold text-foreground/80">{deal.dealNumber}</span>
            <span className="text-border/60">•</span>
            {/* Role indicator */}
            <span className={cn(
              "px-2 py-0.5 rounded-full text-[11px] font-extrabold tracking-wide uppercase",
              isSeller 
                ? "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400"
                : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
            )}>
              {dealRole}
            </span>
            {formattedDate && (
              <>
                <span className="text-border/60">•</span>
                <span className="flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground/80" />
                  {formattedDate}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-border/60">
        <div className="flex items-center gap-3">
          {/* Status Badge */}
          <span className={cn("px-3 py-1 rounded-full text-[12px] font-bold text-center", statusClass)}>
            {statusLabel}
          </span>
          
          {/* Price */}
          <div className="text-right sm:min-w-[80px]">
            <span className="text-[16px] font-extrabold text-foreground tracking-tight">
              {formatCurrency(deal.buyerPaysAmount)}
            </span>
          </div>
        </div>
        
        <ChevronRight className="w-5 h-5 text-muted-foreground/60 transition-transform group-hover:translate-x-1 hidden sm:block" />
      </div>
    </div>
  );
};
