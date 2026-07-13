"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  ChevronRight,
  Flame,
  Gamepad2,
  Heart,
  User,
  Package,
  Layers,
  Archive
} from "lucide-react";
import type { Deal } from "@/types/api.types";
import { getStatusBadgeMeta } from "../utils/dealStatusMeta";
import { formatCurrency, cn } from "@/lib/utils";
import { getStatusBadgeStyle, getStatusDotColor } from "@/utils/deal";

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
  const [isDragging, setIsDragging] = React.useState(false);
  const isSeller = deal.sellerId === currentUserId;
  const dealRole = isSeller ? "Selling" : "Buying";

  const { label: statusLabel } = getStatusBadgeMeta(deal.status);
  const IconComponent = PRODUCT_ICONS[deal.productType] || Package;

  // Pick the image with sortOrder 0 (or lowest) as the primary thumbnail
  const primaryImageUrl = deal.media
    ?.filter((m) => m.mimeType?.startsWith("image/"))
    .sort((a, b) => a.sortOrder - b.sortOrder)[0]?.url ?? null;

  return (
    <div className="relative overflow-hidden rounded-2xl select-none group w-full h-[76px]">
      {/* Background Actions Zone (revealed under swipe) */}
      <div className="absolute inset-0 flex items-center justify-between bg-muted/20 pointer-events-none rounded-2xl">
        {/* Left Action (swipe right to reveal) */}
        <div className="h-full w-24 bg-primary/10 flex items-center justify-center text-primary border-r border-primary/10 pointer-events-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toast.info(`Opening Quick Actions for ${deal.dealNumber}`);
            }}
            className="h-full w-full flex flex-col items-center justify-center gap-1 active:scale-90 transition-transform cursor-pointer"
          >
            <Layers className="w-5 h-5 text-primary" />
            <span className="text-[10px] font-extrabold uppercase tracking-wide">Actions</span>
          </button>
        </div>

        {/* Right Action (swipe left to reveal) */}
        <div className="h-full w-24 bg-rose-500/10 flex items-center justify-center text-rose-600 border-l border-rose-500/10 ml-auto pointer-events-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toast.success(`Deal ${deal.dealNumber} archived`);
            }}
            className="h-full w-full flex flex-col items-center justify-center gap-1 active:scale-90 transition-transform cursor-pointer"
          >
            <Archive className="w-5 h-5 text-rose-600" />
            <span className="text-[10px] font-extrabold uppercase tracking-wide">Archive</span>
          </button>
        </div>
      </div>

      {/* Foreground Card */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -96, right: 96 }}
        dragElastic={0.15}
        dragSnapToOrigin
        onDragStart={() => setIsDragging(true)}
        onDragEnd={(event, info) => {
          if (info.offset.x < -70) {
            toast.success(`Deal ${deal.dealNumber} archived`);
          } else if (info.offset.x > 70) {
            toast.info(`Opening Quick Actions for ${deal.dealNumber}`);
          }
          setTimeout(() => setIsDragging(false), 80);
        }}
        whileHover={{
          scale: 1.01,
          y: -1,
        }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          if (!isDragging) {
            onClick(deal);
          }
        }}
        className="absolute inset-0 bg-card hover:bg-accent/20 border border-border/40 rounded-2xl px-4 flex items-center justify-between shadow-xs cursor-pointer transition-all duration-200 z-10"
      >
        {/* Left: Avatar + Title & Meta Stack */}
        <div className="flex items-center gap-4 min-w-0">
          {/* Avatar Area with Indicator Dot */}
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-full border border-border bg-muted flex items-center justify-center text-muted-foreground shadow-xs overflow-hidden font-bold text-xs uppercase">
              {primaryImageUrl ? (
                <Image
                  src={primaryImageUrl}
                  alt={deal.title}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              ) : (
                <IconComponent className="w-5.5 h-5.5 text-primary" />
              )}
            </div>
            {/* Status dot indicator */}
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
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[12px] font-semibold text-muted-foreground/80 leading-none">
                {deal.dealNumber}
              </span>
              <span className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide border leading-none uppercase shrink-0",
                isSeller
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400 border-blue-100 dark:border-blue-900/50"
                  : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50"
              )}>
                {dealRole}
              </span>
              <span className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide border leading-none uppercase shrink-0",
                getStatusBadgeStyle(deal.status)
              )}>
                {statusLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Price & Navigation Arrow */}
        <div className="flex items-center gap-3 shrink-0 pl-2">
          <span className="font-extrabold text-[16px] text-foreground tracking-tight text-right">
            {formatCurrency(deal.buyerPaysAmount)}
          </span>
          <ChevronRight className="w-4.5 h-4.5 text-muted-foreground/45 transition-transform group-hover:translate-x-0.5 shrink-0" />
        </div>
      </motion.div>
    </div>
  );
};
