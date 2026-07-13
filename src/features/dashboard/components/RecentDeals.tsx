"use client";

import React from "react";
import Image from "next/image";
import {
  ChevronRight,
  Flame,
  Gamepad2,
  Heart,
  User,
  Package,
  Layers,
  ArrowRight,
  Inbox,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getStatusBadgeStyle, getStatusDotColor } from "@/utils/deal";
import { getInitials } from "@/features/deal-details/utils/format";
import { useRole } from "@/providers/role-provider";

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
  mediaUrl?: string | null;
}

interface RecentDealsProps {
  deals: DealItem[];
  onViewAllClick?: () => void;
  onDealClick?: (deal: DealItem) => void;
  isLoading?: boolean;
}

const PRODUCT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  trading_cards: Flame,
  sports_cards: Layers,
  toy: Gamepad2,
  plush: Heart,
  figure: User,
  other: Package,
};

/** Individual Recent Deal Card */
const RecentDealCard: React.FC<{
  deal: DealItem;
  onDealClick?: (deal: DealItem) => void;
}> = ({ deal, onDealClick }) => (
  <div
    onClick={() => onDealClick?.(deal)}
    className="w-full h-[76px] bg-card hover:bg-accent/20 border border-border/40 rounded-2xl px-4 flex items-center justify-between shadow-xs cursor-pointer transition-all duration-150 active:scale-[0.98] select-none group"
  >
    {/* Left: Avatar + Title & Meta Stack */}
    <div className="flex items-center gap-4 min-w-0">
      {/* Avatar with status dot */}
      <div className="relative shrink-0">
        <div className="w-12 h-12 rounded-full border border-border bg-muted flex items-center justify-center text-muted-foreground shadow-xs overflow-hidden font-bold text-xs uppercase">
          {deal.mediaUrl ? (
            <Image
              src={deal.mediaUrl}
              alt={deal.title}
              width={48}
              height={48}
              className="w-full h-full object-cover"
              unoptimized
            />
          ) : (() => {
            const IconComponent = PRODUCT_ICONS[deal.image];
            if (IconComponent) {
              return <IconComponent className="w-5 h-5 text-primary" />;
            }
            return <span>{getInitials(deal.title)}</span>;
          })()}
        </div>
        <span className={cn(
          "absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-card shadow-xs",
          getStatusDotColor(deal.status)
        )} />
      </div>

      {/* Info stack */}
      <div className="flex flex-col justify-center min-w-0">
        <span className="font-bold text-[15px] text-foreground leading-tight tracking-tight mb-1 truncate">
          {deal.title}
        </span>
        <div className="flex flex-col gap-1">
          <span className="text-[12px] font-semibold text-muted-foreground/80 leading-none">
            {deal.dealNumber}
          </span>
          <span className={cn(
            "inline-flex items-center self-start px-2 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide border leading-none uppercase shrink-0",
            getStatusBadgeStyle(deal.status)
          )}>
            {deal.status}
          </span>
        </div>
      </div>
    </div>

    {/* Right: Price & Arrow */}
    <div className="flex items-center gap-3 shrink-0 pl-2">
      <span className="font-extrabold text-[16px] text-foreground tracking-tight text-right">
        {deal.price}
      </span>
      <ChevronRight className="w-4 h-4 text-muted-foreground/45 transition-transform group-hover:translate-x-0.5 shrink-0" />
    </div>
  </div>
);

/** Shimmer Skeleton Loader for Recent Deals */
export const RecentDealsSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-3 w-full" aria-hidden="true">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-card border border-border/40 rounded-2xl h-[76px] px-4 flex items-center justify-between shadow-xs animate-pulse"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 bg-muted rounded-full shrink-0" />
            <div className="flex flex-col gap-2">
              <div className="h-4 w-32 bg-muted rounded" />
              <div className="flex items-center gap-2">
                <div className="h-3.5 w-16 bg-muted rounded" />
                <div className="h-3.5 w-20 bg-muted rounded-full" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-5 w-16 bg-muted rounded" />
            <div className="w-4 h-4 bg-muted rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

/** Inline empty state shown inside the Recent Deals section */
const RecentDealsEmpty: React.FC<{ onCreateDeal?: () => void }> = ({ onCreateDeal }) => {
  const { role } = useRole();
  const isSeller = role === "seller";

  return (
    <div className="flex flex-col items-center justify-center text-center py-8 px-4 bg-card border border-border/40 rounded-2xl select-none">
      {/* Icon container */}
      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 relative">
        <Inbox className="w-7 h-7" strokeWidth={1.5} />
        <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-background animate-pulse" />
      </div>

      <p className="text-[15px] font-bold text-foreground mb-1">
        {isSeller ? "No deals yet" : "No purchases yet"}
      </p>
      <p className="text-[13px] text-muted-foreground max-w-[240px] leading-relaxed mb-5">
        {isSeller
          ? "Create your first deal and start trading safely with buyers."
          : "Waiting for a seller to send you a secure deal link."}
      </p>
    </div>
  );
};

export const RecentDeals: React.FC<RecentDealsProps & { onCreateDeal?: () => void }> = ({
  deals,
  onViewAllClick,
  onDealClick,
  onCreateDeal,
  isLoading = false,
}) => {

  if (isLoading) {
    return (
      <section className="flex flex-col gap-4 select-none" aria-label="Recent Deals Loading">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-[18px] font-extrabold tracking-tight text-foreground">Recent Deals</h2>
          <Button variant="link" className="px-0 text-[14px] h-auto font-bold text-primary gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
        <RecentDealsSkeleton />
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4 select-none" aria-label="Recent Deals">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-[18px] font-extrabold tracking-tight text-foreground">Recent Deals</h2>
        <Button
          variant="link"
          onClick={onViewAllClick}
          className="px-0 text-[14px] h-auto font-bold text-primary flex items-center gap-1 hover:no-underline hover:opacity-85 transition-opacity"
        >
          View All <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </div>

      {/* Floating Card List — or empty state */}
      {deals.length === 0 ? (
        <RecentDealsEmpty onCreateDeal={onCreateDeal} />
      ) : (
        <div className="flex flex-col gap-3 w-full">
          {deals.slice(0, 3).map((deal) => (
            <RecentDealCard
              key={deal.id}
              deal={deal}
              onDealClick={onDealClick}
            />
          ))}
        </div>
      )}
    </section>
  );
};
