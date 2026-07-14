"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Flame,
  Gamepad2,
  Heart,
  User,
  Package,
  Layers
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
  const isSeller = deal.sellerId === currentUserId;
  const dealRole = isSeller ? "Selling" : "Buying";

  const { label: statusLabel } = getStatusBadgeMeta(deal.status);
  const IconComponent = PRODUCT_ICONS[deal.productType] || Package;

  // Pick the image with sortOrder 0 (or lowest) as the primary thumbnail
  const primaryImageUrl = deal.media
    ?.filter((m) => m.mimeType?.startsWith("image/"))
    .sort((a, b) => a.sortOrder - b.sortOrder)[0]?.url ?? null;

  return (
    <>
      {/* Desktop Card Layout */}
      <motion.div
        whileHover={{
          y: -4,
          boxShadow: "0 12px 30px -10px rgba(0,0,0,0.08)",
        }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onClick(deal)}
        className="hidden sm:flex relative w-full h-[290px] select-none group bg-card border border-border/40 rounded-2xl flex-col overflow-hidden shadow-xs cursor-pointer transition-all duration-300"
      >
        {/* Top Image area */}
        <div className="relative w-full h-[150px] bg-muted/30 flex items-center justify-center overflow-hidden border-b border-border/10 shrink-0">
          {primaryImageUrl ? (
            <Image
              src={primaryImageUrl}
              alt={deal.title}
              fill
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              unoptimized
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center">
              <IconComponent className="w-8 h-8 text-primary/70" />
            </div>
          )}

          {/* Floating Badges */}
          <div className="absolute top-3 left-3 pointer-events-none">
            <span className={cn(
              "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide border leading-none uppercase shadow-sm bg-background/95 backdrop-blur-xs",
              isSeller
                ? "bg-blue-50/95 text-blue-600 border-blue-100 dark:border-blue-900/50 dark:bg-blue-950/90 dark:text-blue-400"
                : "bg-emerald-50/95 text-emerald-600 border-emerald-100 dark:border-emerald-900/50 dark:bg-emerald-950/90 dark:text-emerald-400"
            )}>
              {dealRole}
            </span>
          </div>
        </div>

        {/* Info Content */}
        <div className="flex-1 p-4 flex flex-col justify-between bg-card">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-bold text-muted-foreground/80 tracking-wider">
                {deal.dealNumber}
              </span>
              <span className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide border leading-none uppercase shrink-0",
                getStatusBadgeStyle(deal.status)
              )}>
                {statusLabel}
              </span>
            </div>
            <h3 className="font-extrabold text-[15px] text-foreground leading-snug tracking-tight truncate group-hover:text-primary transition-colors duration-200">
              {deal.title}
            </h3>
          </div>

          {/* Price & Action row */}
          <div className="flex items-center justify-between pt-2 border-t border-border/30 shrink-0">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                Amount
              </span>
              <span className="font-extrabold text-[17px] text-foreground tracking-tight">
                {formatCurrency(deal.buyerPaysAmount)}
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-muted/40 group-hover:bg-primary group-hover:text-white flex items-center justify-center transition-all duration-300">
              <ChevronRight className="w-4 h-4 text-muted-foreground/60 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mobile Row Layout */}
      <motion.div
        whileTap={{ scale: 0.98 }}
        onClick={() => onClick(deal)}
        className="flex sm:hidden w-full h-[76px] select-none bg-card hover:bg-accent/20 border border-border/40 rounded-2xl px-4 items-center justify-between shadow-xs cursor-pointer transition-all duration-200"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          {/* Avatar with status dot */}
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
            <span className={cn(
              "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card shadow-xs",
              getStatusDotColor(deal.status)
            )} />
          </div>

          {/* Info Stack */}
          <div className="flex flex-col justify-center min-w-0">
            <span className="font-bold text-[14px] text-foreground leading-tight tracking-tight mb-1 truncate max-w-[150px] xs:max-w-[200px]">
              {deal.title}
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-semibold text-muted-foreground/80 leading-none">
                {deal.dealNumber}
              </span>
              <span className={cn(
                "inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-extrabold tracking-wide border leading-none uppercase shrink-0",
                isSeller
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400 border-blue-100 dark:border-blue-900/50"
                  : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50"
              )}>
                {dealRole}
              </span>
              <span className={cn(
                "inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-extrabold tracking-wide border leading-none uppercase shrink-0",
                getStatusBadgeStyle(deal.status)
              )}>
                {statusLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Right Section: Price & Chevron */}
        <div className="flex items-center gap-2 shrink-0 pl-2">
          <span className="font-extrabold text-[15px] text-foreground tracking-tight text-right">
            {formatCurrency(deal.buyerPaysAmount)}
          </span>
          <ChevronRight className="w-4 h-4 text-muted-foreground/45 shrink-0" />
        </div>
      </motion.div>
    </>
  );
};
