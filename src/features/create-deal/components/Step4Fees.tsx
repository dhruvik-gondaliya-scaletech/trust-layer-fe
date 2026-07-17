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

  const sellerReceives = Number((price - sellerFeeShare + shippingCost).toFixed(2));
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
      <div className="flex-1 overflow-y-auto px-0.5 space-y-4 scrollbar-none">
        {/* Title */}
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Fees</h2>
          <p className="text-xs text-muted-foreground">
            Choose who covers the platform fee. Total fee is{" "}
            <span className="font-bold text-foreground">{fmt(platformFee)}</span> (Non - Refundable)
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

        {/* ── Fee Summary Card (Interactive Breakdown) ── */}
        <div className="rounded-2xl border border-border/80 bg-background overflow-hidden shadow-sm">
          {/* Card Header (Click to toggle breakdown) */}
          <div
            onClick={() => setShowBreakdown((prev) => !prev)}
            className="flex items-center justify-between p-4 cursor-pointer select-none hover:bg-muted/5 transition-colors"
          >
            <div className="flex flex-col text-left">
              <span className="text-base font-bold text-foreground">Seller Receives</span>
              <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 font-medium">
                Tap for breakdown
                {showBreakdown ? (
                  <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                )}
              </span>
            </div>
            <span className="text-xl font-black text-primary">
              {fmt(sellerReceives)}
            </span>
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
                <div className="border-t border-border/60 bg-muted/[0.03] px-4 py-4 flex flex-col gap-4">
                  {/* First Section: Item Price, Platform Fee, Seller Receives (subtotal) */}
                  <div className="flex flex-col gap-2.5 text-xs text-muted-foreground font-semibold">
                    <div className="flex justify-between items-center">
                      <span className="text-foreground/70">Item Price</span>
                      <span className="text-foreground font-bold">{fmt(price)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-foreground/70">
                        Platform Fee <span className="text-[10px] text-muted-foreground/80 font-normal ml-1">(Non-refundable)</span>
                      </span>
                      <span className="text-destructive font-bold">
                        {sellerFeeShare > 0 ? `-${fmt(sellerFeeShare)}` : "$0.00"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center font-bold text-foreground">
                      <span>Total</span>
                      <span className="text-primary font-black">{fmt(price - sellerFeeShare)}</span>
                    </div>
                  </div>

                  {/* Second Section: Shipping and Buyer Pays */}
                  <div className="flex flex-col gap-2.5 pt-3 border-t border-border/60 text-xs text-muted-foreground font-semibold">
                    <div className="flex justify-between items-center">
                      <span className="text-foreground/70">Shipping Cost</span>
                      <span className="text-foreground font-bold">{fmt(shippingCost)}</span>
                    </div>
                    <div className="flex justify-between items-center font-bold text-foreground">
                      <span>Buyer Pays</span>
                      <span className="font-black">{fmt(totalBuyerPays)}</span>
                    </div>
                  </div>

                  {/* Third Section: What You Receive Banner */}
                  <div className="mt-1 p-3 bg-primary/[0.05] rounded-xl border border-solid border-primary/20 outline-none flex items-center justify-between">
                    <div className="flex flex-col text-left">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-wider">What you receive</span>
                      <span className="text-[10px] text-muted-foreground font-normal">Estimated Net Payout</span>
                    </div>
                    <span className="text-lg font-black text-primary">
                      {fmt(sellerReceives)}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </form>
  );
};
