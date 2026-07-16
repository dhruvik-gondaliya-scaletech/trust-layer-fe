"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, ArrowDownLeft, ArrowUpRight, Minus, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { calculateEscrowFees } from "@/utils/fee";

export type FeeStructureType = "Split 50/50" | "Buyer Pays" | "Seller Pays";

export interface Step4FeesData {
  feeStructure: FeeStructureType;
}

interface Step4FeesProps {
  price: number;
  shippingCost?: number;
  initialData?: Partial<Step4FeesData>;
  onContinue: (data: Step4FeesData) => void;
}

const fmt = (val: number) =>
  `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const Step4Fees: React.FC<Step4FeesProps> = ({
  price,
  shippingCost = 0,
  initialData,
  onContinue,
}) => {
  const [feeStructure, setFeeStructure] = useState<FeeStructureType>(
    (initialData?.feeStructure as FeeStructureType) || "Buyer Pays"
  );
  const [showBreakdown, setShowBreakdown] = useState(false);

  const { platformFee, buyerFeeShare, sellerFeeShare } = calculateEscrowFees(price, feeStructure);

  const sellerReceives = Number((price - sellerFeeShare).toFixed(2));
  const totalBuyerPays = Number((price + buyerFeeShare + shippingCost).toFixed(2));

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onContinue({ feeStructure });
  };

  const OPTIONS: { id: FeeStructureType; title: string; subtitle: string }[] = [
    {
      id: "Split 50/50",
      title: "Split 50/50",
      subtitle: "You & buyer each pay half the platformfee",
    },
    {
      id: "Buyer Pays",
      title: "Buyer Pays",
      subtitle: "Buyer covers the full platform fee",
    },
    {
      id: "Seller Pays",
      title: "Seller Pays",
      subtitle: "You cover the full platform fee",
    },
  ];

  return (
    <form
      id="step4-form"
      onSubmit={handleFormSubmit}
      className="flex flex-col h-full flex-1 overflow-hidden text-left"
    >
      {/* Scrollable Form Content */}
      <div className="flex-1 overflow-y-auto px-0.5 space-y-4 scrollbar-none pb-28 xl:pb-8">
        {/* Title */}
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Fees</h2>
          <p className="text-xs text-muted-foreground">
            Choose who covers the platform fee. Total fee is{" "}
            <span className="font-bold text-foreground">{fmt(platformFee)}</span> ( Non - Refundable ).
          </p>
        </div>

        {/* Radio Option Cards */}
        <div className="flex flex-col gap-3">
          {OPTIONS.map((opt) => {
            const isSelected = feeStructure === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => setFeeStructure(opt.id)}
                className={cn(
                  "p-4 bg-muted/15 border border-border/80 rounded-2xl cursor-pointer hover:bg-muted/20 select-none transition-all flex items-center justify-between gap-3",
                  isSelected && "border-primary bg-primary/[0.03] ring-1 ring-primary"
                )}
              >
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-sm font-bold text-foreground">{opt.title}</span>
                  <span className="text-xs text-muted-foreground">{opt.subtitle}</span>
                </div>

                {/* Radio Circle */}
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border flex items-center justify-center transition-all flex-shrink-0",
                    isSelected ? "border-primary" : "border-muted-foreground/30"
                  )}
                >
                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Fee Summary Card ── */}
        <div className="rounded-2xl border border-border/80 overflow-hidden">
          {/* Card Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-muted/10 border-b border-border/60">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Fee Summary
            </span>
            <span className="text-xs text-muted-foreground">
              Platform fee:{" "}
              <span className="font-bold text-foreground">{fmt(platformFee)}</span>
            </span>
          </div>

          {/*
           * On mobile: stacked rows (full-width each party).
           * On sm+:    side-by-side columns divided by a border.
           */}
          <div className="flex flex-col sm:grid sm:grid-cols-2 sm:divide-x sm:divide-border/60 divide-y divide-border/60 sm:divide-y-0">
            {/* ── You Receive (Seller) ── */}
            <div className="flex flex-col gap-3 p-4 bg-blue-500/[0.06] dark:bg-blue-500/[0.04]">
              {/* Label row */}
              <div className="flex items-center justify-between sm:justify-start sm:gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <ArrowDownLeft className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-xs font-bold text-primary">
                    You Receive
                  </span>
                </div>
                {/* On mobile show the big amount on the right of the label */}
                <span className="sm:hidden text-xl font-black text-primary">
                  {fmt(sellerReceives)}
                </span>
              </div>

              {/* Big amount — desktop only */}
              <div className="hidden sm:block">
                <span className="text-2xl font-black text-primary">{fmt(sellerReceives)}</span>
              </div>

              {/* Line items */}
              <div className="flex flex-col gap-1.5 text-xs text-muted-foreground font-semibold">
                <div className="flex items-center justify-between">
                  <span className="text-foreground/75">Item Price</span>
                  <span className="text-foreground font-bold">{fmt(price)}</span>
                </div>
                {sellerFeeShare > 0 ? (
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-0.5 text-foreground/75">
                      <Minus className="w-2.5 h-2.5 text-destructive" />
                      Platform Fee
                    </span>
                    <span className="text-destructive font-bold">{fmt(sellerFeeShare)}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-foreground/75">Platform Fee</span>
                    <span className="text-emerald-650 dark:text-emerald-450 font-bold">$0.00</span>
                  </div>
                )}
                <div className="border-t border-border/50 pt-1.5 flex items-center justify-between font-bold">
                  <span className="text-foreground">Net Payout</span>
                  <span className="text-primary">{fmt(sellerReceives)}</span>
                </div>
              </div>
            </div>

            {/* ── Buyer Pays ── */}
            <div className="flex flex-col gap-3 p-4 bg-emerald-500/[0.06] dark:bg-emerald-500/[0.04]">
              {/* Label row */}
              <div className="flex items-center justify-between sm:justify-start sm:gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                  </div>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Buyer Pays</span>
                </div>
                {/* On mobile show the big amount on the right of the label */}
                <span className="sm:hidden text-xl font-black text-emerald-700 dark:text-emerald-400">
                  {fmt(totalBuyerPays)}
                </span>
              </div>

              {/* Big amount — desktop only */}
              <div className="hidden sm:block">
                <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400">{fmt(totalBuyerPays)}</span>
              </div>

              {/* Line items */}
              <div className="flex flex-col gap-1.5 text-xs text-muted-foreground font-semibold">
                <div className="flex items-center justify-between">
                  <span className="text-foreground/75">Item Price</span>
                  <span className="text-foreground font-bold">{fmt(price)}</span>
                </div>
                {shippingCost > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-0.5 text-foreground/75">
                      <Plus className="w-2.5 h-2.5 text-foreground/60" />
                      Shipping
                    </span>
                    <span className="text-foreground font-bold">{fmt(shippingCost)}</span>
                  </div>
                )}
                {buyerFeeShare > 0 ? (
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-0.5 text-foreground/75">
                      <Plus className="w-2.5 h-2.5 text-foreground/60" />
                      Platform Fee
                    </span>
                    <span className="text-foreground font-bold">{fmt(buyerFeeShare)}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-foreground/75">Platform Fee</span>
                    <span className="text-emerald-650 dark:text-emerald-450 font-bold">$0.00</span>
                  </div>
                )}
                <div className="border-t border-border/50 pt-1.5 flex items-center justify-between font-bold">
                  <span className="text-foreground">Total Due</span>
                  <span className="text-emerald-700 dark:text-emerald-400">{fmt(totalBuyerPays)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Toggle Full Breakdown */}
          <div
            onClick={() => setShowBreakdown((prev) => !prev)}
            className="flex items-center justify-center gap-1.5 py-2.5 border-t border-border/60 cursor-pointer select-none hover:bg-muted/10 transition-colors"
          >
            <span className="text-xs font-semibold text-muted-foreground">
              {showBreakdown ? "Hide" : "View"} full breakdown
            </span>
            {showBreakdown ? (
              <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            )}
          </div>

          <AnimatePresence initial={false}>
            {showBreakdown && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="border-t border-border/60 bg-muted/5 px-4 py-4 flex flex-col gap-2.5 text-xs text-muted-foreground font-semibold">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 mb-1">
                    Complete Deal Ledger
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-foreground/75">Item Price</span>
                    <span className="text-foreground font-bold">{fmt(price)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-foreground/75">Shipping Cost</span>
                    <span className="text-foreground font-bold">
                      {shippingCost > 0 ? fmt(shippingCost) : "FREE"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-foreground/75">Total Platform Fee</span>
                    <span className="text-foreground font-bold">{fmt(platformFee)}</span>
                  </div>

                  <div className="border-t border-dashed border-border/40 my-0.5" />

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-foreground/75">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary" />
                      Your Platform Fee Share
                    </span>
                    <span
                      className={cn(
                        "font-bold",
                        sellerFeeShare > 0 ? "text-destructive" : "text-emerald-700 dark:text-emerald-400"
                      )}
                    >
                      {sellerFeeShare > 0 ? `-${fmt(sellerFeeShare)}` : "$0.00"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-foreground/75">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Buyer Platform Fee Share
                    </span>
                    <span
                      className={cn(
                        "font-bold",
                        buyerFeeShare > 0 ? "text-foreground" : "text-emerald-700 dark:text-emerald-400"
                      )}
                    >
                      {buyerFeeShare > 0 ? `+${fmt(buyerFeeShare)}` : "$0.00"}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* High Contrast Quick Summary Cards (Visible at first glance) */}
        <div className="grid grid-cols-2 gap-3.5 pt-2">
          <div className="rounded-2xl bg-primary text-primary-foreground p-4 flex flex-col gap-0.5 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-85">
              You Receive
            </span>
            <span className="text-xl font-black tracking-tight">
              {fmt(sellerReceives)}
            </span>
          </div>
          <div className="rounded-2xl bg-emerald-600 text-white dark:bg-emerald-500 dark:text-zinc-950 p-4 flex flex-col gap-0.5 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-85">
              Buyer Pays
            </span>
            <span className="text-xl font-black tracking-tight">
              {fmt(totalBuyerPays)}
            </span>
          </div>
        </div>
      </div>
    </form>
  );
};
