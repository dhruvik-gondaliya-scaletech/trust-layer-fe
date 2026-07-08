"use client";

import React from "react";
import { ChevronRight, Flame, Gamepad2, Heart, User, Package, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DealItem {
  id: string;
  dealNumber: string;
  title: string;
  type: "selling" | "buying";
  score: number;
  status: string;
  statusType: "warning" | "success" | "muted" | string;
  price: string;
  image: string;
}

interface RecentDealsProps {
  deals: DealItem[];
  onViewAllClick?: () => void;
  onDealClick?: (deal: DealItem) => void;
}

const PRODUCT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  trading_cards: Flame,
  sports_cards: Layers,
  toy: Gamepad2,
  plush: Heart,
  figure: User,
  other: Package,
};

export const RecentDeals: React.FC<RecentDealsProps> = ({
  deals,
  onViewAllClick,
  onDealClick,
}) => {
  const getStatusColor = (statusType: string) => {
    switch (statusType) {
      case "warning":
        return "text-amber-600";
      case "muted":
        return "text-muted-foreground";
      case "success":
      default:
        return "text-primary";
    }
  };

  return (
    <section className="flex flex-col gap-3 select-none" aria-label="Recent Deals">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-[18px] font-bold text-foreground">Recent Deals</h2>
        <Button
          variant="link"
          onClick={onViewAllClick}
          className="px-0 text-[14px] h-auto font-semibold text-primary"
        >
          View All
        </Button>
      </div>

      {/* Card container — bg-primary/border-primary already track the active role's color */}
      <Card className="border border-primary/30 bg-primary/5 shadow-sm overflow-hidden">
        <div className="flex flex-col divide-y divide-border">
          {deals.slice(0, 3).map((deal) => (
            <div
              key={deal.id}
              onClick={() => onDealClick?.(deal)}
              className="cursor-pointer transition-colors p-3.5 flex items-center justify-between group hover:bg-primary/10"
            >
              {/* Left: thumbnail + info */}
              <div className="flex items-center gap-3.5">
                {/* Thumbnail — Icon badge */}
                <div className="w-12 h-12 bg-card rounded-xl overflow-hidden shrink-0 border border-border flex items-center justify-center text-primary shadow-sm">
                  {(() => {
                    const IconComponent = PRODUCT_ICONS[deal.image] || Package;
                    return <IconComponent className="w-6 h-6" />;
                  })()}
                </div>

                {/* Info */}
                <div className="flex flex-col justify-center">
                  <span className="font-bold text-[15px] text-foreground leading-tight mb-0.5 line-clamp-1">
                    {deal.title}
                  </span>
                  <span className="text-[12px] font-medium text-muted-foreground mb-0.5">
                    {deal.dealNumber}
                  </span>
                  <span className={cn("text-[12px] font-semibold leading-none", getStatusColor(deal.statusType))}>
                    {deal.status}
                  </span>
                </div>
              </div>

              {/* Right: price + chevron */}
              <div className="flex flex-col items-end justify-center">
                <span className="font-extrabold text-[15px] text-foreground mb-1">
                  {deal.price}
                </span>
                <ChevronRight className="w-4 h-4 transition-colors text-primary/50" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
};
