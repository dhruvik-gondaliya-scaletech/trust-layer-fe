"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
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

  const sellerEarnings = Number((price - sellerFeeShare).toFixed(2));
  const buyerCost = Number((price + buyerFeeShare).toFixed(2));

  // Shipping is charged to the buyer on top of the item price and fee share
  const totalBuyerPays = Number((buyerCost + shippingCost).toFixed(2));

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onContinue({ feeStructure });
  };

  const OPTIONS: { id: FeeStructureType; title: string; subtitle: string }[] = [
    {
      id: "Split 50/50",
      title: "Split 50/50",
      subtitle: "You pay 50%, Buyer pays 50%",
    },
    {
      id: "Buyer Pays",
      title: "Buyer Pays",
      subtitle: "Buyer pays full platform fee",
    },
    {
      id: "Seller Pays",
      title: "Seller Pays",
      subtitle: "You pay full platform fee",
    },
  ];

  return (
    <form
      id="step4-form"
      onSubmit={handleFormSubmit}
      className="flex flex-col h-full flex-1 overflow-hidden text-left"
    >
      {/* Scrollable Form Content */}
      <div className="flex-1 overflow-y-auto px-0.5 space-y-5 scrollbar-none pb-28">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Fees</h2>
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
                  "p-4 bg-muted/15 border border-border/80 rounded-2xl cursor-pointer hover:bg-muted/20 select-none transition-all flex items-center justify-between",
                  isSelected && "border-primary bg-primary/[0.03] ring-1 ring-primary"
                )}
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-bold text-foreground">{opt.title}</span>
                  <span className="text-xs text-muted-foreground mt-0.5">{opt.subtitle}</span>
                </div>

                {/* Radio Circle */}
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border flex items-center justify-center transition-all",
                    isSelected ? "border-primary" : "border-muted-foreground/30"
                  )}
                >
                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Estimated Earnings Card */}
        <div className="p-4 border border-border/80 rounded-2xl bg-muted/5 flex flex-col gap-3">
          <div
            onClick={() => setShowBreakdown((prev) => !prev)}
            className="flex items-center justify-between cursor-pointer select-none"
          >
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-bold text-foreground">Estimated Earnings</span>
              <div className="flex items-center gap-1 text-xs text-muted-foreground font-semibold">
                <span>Tap for breakdown</span>
                {showBreakdown ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </div>
            </div>

            <span className="text-lg font-black text-primary">
              ${sellerEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                <div className="pt-3 border-t border-border/20 flex flex-col gap-2 text-xs text-muted-foreground font-semibold">
                  <div className="flex justify-between">
                    <span>Item Price</span>
                    <span className="text-foreground">${price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping Cost</span>
                    <span className="text-foreground">
                      {shippingCost > 0
                        ? `$${shippingCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                        : "FREE"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Platform Fee (3.5% + $0.30)</span>
                    <span className="text-foreground">${platformFee.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between border-t border-dashed border-border/20 pt-1.5 font-bold">
                    <span>Your Fee Share</span>
                    <span className="text-destructive">-${sellerFeeShare.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Buyer Fee Share</span>
                    <span className="text-emerald-500">+${buyerFeeShare.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between border-t border-border/20 pt-2 font-extrabold text-foreground">
                    <span>Total Buyer Pays</span>
                    <span>${totalBuyerPays.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
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
