"use client";

import { Check, ShieldCheck, Coins, Truck, Package, Unlock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EscrowTimelineStepsProps {
  currentStatus: string;
  carrier?: string;
  shippingType?: string;
  buyerPays: number;
  sellerReceivesAmount: number;
  reviewRating?: number;
  reviewComment?: string;
  trackingNumber?: string | null;
  isSeller: boolean;
  isBuyer: boolean;
  onFundEscrow: () => void;
  onShip: () => void;
  onConfirmDelivery: () => void;
  onFileDispute: () => void;
  onReviewSeller: () => void;
}

const IN_TRANSIT_OR_LATER = ["shipped", "delivered", "completed", "closed", "disputed"];
const DELIVERED_OR_LATER = ["delivered", "completed", "closed", "disputed"];

export function EscrowTimelineSteps({
  currentStatus,
  carrier,
  shippingType,
  buyerPays,
  sellerReceivesAmount,
  reviewRating,
  reviewComment,
  trackingNumber,
  isSeller,
  isBuyer,
  onFundEscrow,
  onShip,
  onConfirmDelivery,
  onFileDispute,
  onReviewSeller,
}: EscrowTimelineStepsProps) {
  return (
    <div className="bg-background border border-border/80 rounded-[32px] p-5 shadow-xs flex flex-col gap-4">
      <div className="flex items-center justify-between pb-3 border-b border-border/30">
        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
          Transaction Timeline
        </span>
        <span className="text-[9px] font-extrabold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Protected Escrow</span>
        </span>
      </div>

      <div className="flex flex-col gap-6 relative pl-7 pt-2">
        {/* Vertical line connector */}
        <div className="absolute left-[9px] top-4 bottom-4 w-0.5 bg-border/40" />

        {/* Step 1: Created & Published */}
        <div className="relative flex flex-col gap-1 text-left">
          <div className="absolute -left-[23px] top-1.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-4 ring-background z-10">
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
          <span className="text-xs font-extrabold text-foreground">1. Deal Published</span>
          <span className="text-[11px] font-medium text-muted-foreground">
            Seller validated all required deal documentation. Trust Score is certified.
          </span>
        </div>

        {/* Step 2: Funded */}
        <div className="relative flex flex-col gap-1 text-left">
          <div className={cn(
            "absolute -left-[23px] top-1.5 w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-background z-10",
            currentStatus !== "open"
              ? "bg-emerald-500 text-white"
              : "bg-muted border border-border/80 text-muted-foreground"
          )}>
            {currentStatus !== "open" ? (
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            ) : (
              <Coins className="w-3 h-3" />
            )}
          </div>
          <span className={cn("text-xs font-extrabold", currentStatus !== "open" ? "text-foreground" : "text-muted-foreground")}>
            2. Escrow Funded
          </span>
          <span className="text-[11px] font-medium text-muted-foreground">
            {currentStatus === "open"
              ? "Waiting for the buyer to deposit transaction collateral into escrow."
              : `Buyer paid $${buyerPays.toLocaleString(undefined, { minimumFractionDigits: 2 })}. Funds safely held by TrustLayer.`}
          </span>
          {currentStatus === "open" && !isSeller && (
            <Button
              onClick={onFundEscrow}
              className="w-full mt-2 bg-primary hover:bg-primary/95 text-white font-extrabold rounded-xl h-11 border-none cursor-pointer text-xs"
            >
              Deposit &amp; Fund Escrow (${buyerPays.toLocaleString(undefined, { minimumFractionDigits: 2 })})
            </Button>
          )}
        </div>

        {/* Step 3: Shipped */}
        <div className="relative flex flex-col gap-1 text-left">
          <div className={cn(
            "absolute -left-[23px] top-1.5 w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-background z-10",
            IN_TRANSIT_OR_LATER.includes(currentStatus)
              ? "bg-emerald-500 text-white"
              : "bg-muted border border-border/80 text-muted-foreground"
          )}>
            {IN_TRANSIT_OR_LATER.includes(currentStatus) ? (
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            ) : (
              <Truck className="w-3 h-3" />
            )}
          </div>
          <span className={cn(
            "text-xs font-extrabold",
            IN_TRANSIT_OR_LATER.includes(currentStatus) ? "text-foreground" : "text-muted-foreground"
          )}>
            3. Item Shipped
          </span>
          <span className="text-[11px] font-medium text-muted-foreground">
            {IN_TRANSIT_OR_LATER.includes(currentStatus)
              ? `Seller shipped via ${carrier || "USPS"} (${shippingType || "Standard"}).`
              : "Seller is notified to ship the item once collateral deposit is locked."}
          </span>

          {currentStatus === "funded" && (
            <>
              {isSeller ? (
                <Button
                  onClick={onShip}
                  className="w-full mt-2 bg-primary hover:bg-primary/95 text-white font-extrabold rounded-xl h-11 border-none cursor-pointer text-xs"
                >
                  Mark Shipped (USPS Priority)
                </Button>
              ) : (
                <span className="text-[11px] font-semibold text-amber-600 animate-pulse mt-2 block">
                  Awaiting shipment registration from seller.
                </span>
              )}
            </>
          )}

          {trackingNumber && (
            <div className="mt-2 text-[11px] bg-slate-50 border border-slate-100 p-2.5 rounded-xl font-bold flex flex-col gap-0.5">
              <div className="text-slate-400">Tracking Info</div>
              <div className="text-foreground flex items-center justify-between">
                <span>{carrier || "USPS"} ({shippingType || "Priority"})</span>
                <span className="text-primary select-text">{trackingNumber}</span>
              </div>
            </div>
          )}
        </div>

        {/* Step 4: Delivered & Inspected */}
        <div className="relative flex flex-col gap-1 text-left">
          <div className={cn(
            "absolute -left-[23px] top-1.5 w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-background z-10",
            DELIVERED_OR_LATER.includes(currentStatus)
              ? "bg-emerald-500 text-white"
              : "bg-muted border border-border/80 text-muted-foreground"
          )}>
            {DELIVERED_OR_LATER.includes(currentStatus) ? (
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            ) : (
              <Package className="w-3.5 h-3.5" />
            )}
          </div>
          <span className={cn(
            "text-xs font-extrabold",
            DELIVERED_OR_LATER.includes(currentStatus) ? "text-foreground" : "text-muted-foreground"
          )}>
            4. Delivery Confirmation
          </span>
          <span className="text-[11px] font-medium text-muted-foreground">
            {DELIVERED_OR_LATER.includes(currentStatus)
              ? "Item delivered and verified by buyer."
              : "Awaiting package delivery confirmation."}
          </span>

          {currentStatus === "shipped" && (
            <>
              {isBuyer ? (
                <div className="flex gap-2.5 mt-3">
                  <Button
                    onClick={onConfirmDelivery}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-xl h-11 border-none cursor-pointer text-xs"
                  >
                    Confirm Delivery &amp; Release Funds
                  </Button>
                  <Button
                    onClick={onFileDispute}
                    variant="outline"
                    className="flex-1 border-destructive text-destructive hover:bg-destructive/5 font-extrabold rounded-xl h-11 text-xs"
                  >
                    File Dispute
                  </Button>
                </div>
              ) : (
                <span className="text-[11px] font-semibold text-amber-600 animate-pulse mt-2 block">
                  In Transit - Awaiting buyer receipt &amp; confirmation.
                </span>
              )}
            </>
          )}
        </div>

        {/* Step 5: Completed */}
        <div className="relative flex flex-col gap-1 text-left">
          <div className={cn(
            "absolute -left-[23px] top-1.5 w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-background z-10",
            currentStatus === "completed" || currentStatus === "closed"
              ? "bg-emerald-500 text-white"
              : currentStatus === "disputed"
                ? "bg-destructive text-white"
                : "bg-muted border border-border/80 text-muted-foreground"
          )}>
            {currentStatus === "completed" || currentStatus === "closed" ? (
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            ) : currentStatus === "disputed" ? (
              <AlertCircle className="w-3.5 h-3.5" />
            ) : (
              <Unlock className="w-3.5 h-3.5 text-slate-400" />
            )}
          </div>
          <span className={cn(
            "text-xs font-extrabold",
            currentStatus === "completed" || currentStatus === "closed"
              ? "text-emerald-500"
              : currentStatus === "disputed"
                ? "text-destructive"
                : "text-muted-foreground"
          )}>
            {currentStatus === "disputed" ? "Escrow Locked (Disputed)" : "5. Escrow Release"}
          </span>
          <span className="text-[11px] font-medium text-muted-foreground">
            {currentStatus === "completed" || currentStatus === "closed"
              ? `Funds released. Seller received $${sellerReceivesAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}.`
              : currentStatus === "disputed"
                ? "Transaction locked. TrustLayer review board is arbitrating."
                : "Buyer verifies item details match certified proof, releasing locked collateral."}
          </span>

          {(currentStatus === "completed" || currentStatus === "closed") && (
            <>
              {isBuyer && (
                <>
                  {!reviewRating ? (
                    <Button
                      onClick={onReviewSeller}
                      className="w-full mt-3 bg-primary hover:bg-primary/95 text-white font-extrabold rounded-xl h-11 border-none cursor-pointer text-xs"
                    >
                      Review Seller
                    </Button>
                  ) : (
                    <div className="mt-3 p-3 bg-slate-50 border border-slate-100 rounded-xl flex flex-col gap-1">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-slate-700">Your Review:</span>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} className={cn("text-xs", star <= (reviewRating ?? 0) ? "text-amber-400" : "text-slate-200")}>★</span>
                          ))}
                        </div>
                      </div>
                      {reviewComment && (
                        <p className="text-[11px] text-slate-500 italic mt-0.5">&quot;{reviewComment}&quot;</p>
                      )}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
