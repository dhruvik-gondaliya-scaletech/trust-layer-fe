"use client";

import React, { useState } from "react";
import { ChevronLeft, Shield, CheckCircle2, Copy, Check, ExternalLink, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomActionBar } from "@/components/ui/bottom-action-bar";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { motion } from "framer-motion";
import ShipmentProgress from "./ShipmentProgress";
import { getCarrierTrackingUrl } from "../../deal-details/utils/format";
import type { Deal } from "@/types/api.types";
import { DealStatus } from "@/types/enums";
import { cn } from "@/lib/utils";
import { BackButton } from "@/components/shared/BackButton";

interface ViewTrackingProps {
  deal: Deal;
  isBuyer: boolean;
  isSeller: boolean;
  onConfirmDelivery: () => Promise<void>;
  onReportIssue: () => void;
  isConfirming: boolean;
}

const STEPPER_STEPS = [
  { step: 1, label: "Payment Received" },
  { step: 2, label: "Tracking Added" },
  { step: 3, label: "Buyer Tracks" },
  { step: 4, label: "Confirm Delivery" },
  { step: 5, label: "Funds Released" },
];

export default function ViewTracking({
  deal,
  isBuyer,
  onConfirmDelivery,
  onReportIssue,
  isConfirming,
}: ViewTrackingProps) {
  const [copied, setCopied] = useState(false);

  // 1. Copy tracking number handler
  const handleCopyTracking = async () => {
    if (!deal.trackingNumber) return;
    try {
      await navigator.clipboard.writeText(deal.trackingNumber);
      setCopied(true);
      toast.success("Tracking number copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy tracking number.");
    }
  };

  // 2. Format Estimated Delivery Date (Jul 02, 2026)
  const formatDeliveryDate = (isoString: string | null | undefined) => {
    if (!isoString) return "Not specified";
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  // 3. Map Deal Status to Step Number
  // Steps:
  // 1: Payment Received (funded)
  // 2: Tracking Added (shipped)
  // 3: Buyer Tracks (shipped / in transit)
  // 4: Confirm Delivery (delivered)
  // 5: Funds Released (completed / closed)
  const getProgressStep = (status: DealStatus | string | null | undefined): number => {
    if (!status) return 0;
    switch (status) {
      case DealStatus.DRAFT:
      case DealStatus.OPEN:
        return 0;
      case DealStatus.FUNDED:
        return 1;
      case DealStatus.SHIPPED:
      case DealStatus.DISPUTED:
      case DealStatus.RETURN_APPROVED:
      case DealStatus.RETURN_SHIPPED:
        return 3; // Buyer Tracks is active/completed
      case DealStatus.DELIVERED:
      case DealStatus.RETURN_DELIVERED:
        return 4; // Ready to confirm delivery
      case DealStatus.CLOSED:
      case DealStatus.RETURN_COMPLETED:
        return 5;
      default:
        return 2;
    }
  };

  const currentStep = getProgressStep(deal.status);
  const carrierLabel =
    deal.carrier === "Other" ? deal.carrierOther || "Other Carrier" : deal.carrier || "N/A";

  const trackingUrl =
    getCarrierTrackingUrl(deal.carrier, deal.trackingNumber) || deal.trackingUrl || "";

  const canConfirm =
    isBuyer &&
    (deal.status === DealStatus.SHIPPED || deal.status === DealStatus.DELIVERED);

  // Header and layout container classes matching AddTracking
  return (
    <div className="flex flex-col min-h-screen bg-slate-50/70 pb-[150px] text-foreground select-none">
      {/* ─── Header ─── */}
      <div className="bg-white border-b border-slate-100/80 sticky top-0 z-30">
        <div className="max-w-2xl mx-auto flex items-center justify-between px-4 py-4 w-full">
          <BackButton />
          <div className="flex items-center gap-1.5 font-black text-slate-800 text-[16px] tracking-tight">
            <Shield className="w-5 h-5 text-blue-600 fill-blue-50" />
            <span>TrustLayer</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-50" />
            <span>Secured by TrustLayer</span>
          </div>
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 flex flex-col gap-6"
      >
        {/* ─── Hero Center Area ─── */}
        <div className="flex flex-col items-center text-center py-6">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-4 border border-blue-100/50 shadow-inner">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800">Tracking Added</h1>
          <p className="text-[13px] text-slate-500 font-semibold max-w-sm mt-2 leading-relaxed">
            Tracking information has been provided by the seller.
            <br />
            Track shipment progress directly with the carrier.
          </p>
        </div>

        {/* ─── Tracking Information Card ─── */}
        <Card className="p-6 border-slate-100/80 shadow-sm rounded-[24px] bg-white flex flex-col gap-5">
          <div className="text-[15px] font-extrabold text-slate-900">Tracking Information</div>

          <div className="flex flex-col gap-4">
            {/* Estimated Delivery */}
            <div className="flex justify-between items-center text-[14px]">
              <span className="font-semibold text-slate-400">Estimated Delivery</span>
              <span className="font-extrabold text-slate-800">
                {formatDeliveryDate(deal.estimatedDeliveryAt)}
              </span>
            </div>

            {/* Carrier */}
            <div className="flex justify-between items-center text-[14px]">
              <span className="font-semibold text-slate-400">Carrier</span>
              <span className="font-extrabold text-slate-800">{carrierLabel}</span>
            </div>

            {/* Tracking Number */}
            <div className="flex justify-between items-center text-[14px]">
              <span className="font-semibold text-slate-400">Tracking Number</span>
              <button
                onClick={handleCopyTracking}
                className="text-slate-800 hover:text-blue-600 flex items-center gap-1.5 font-extrabold font-mono text-[14px] transition-colors focus:outline-none"
              >
                <span>{deal.trackingNumber || "N/A"}</span>
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />
                ) : (
                  <Copy className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                )}
              </button>
            </div>
          </div>

          {/* Blue Alert Box */}
          <div className="bg-blue-50/40 border border-blue-100/30 rounded-2xl p-4 text-center">
            <p className="text-[13px] font-bold text-blue-600 leading-relaxed">
              Shipment updates are provided by the carrier. Track your package directly using the
              carrier link below.
            </p>
          </div>

          {/* Track Package Button */}
          {trackingUrl ? (
            <Button
              variant="outline"
              className="w-full h-12 rounded-2xl border-slate-200 text-slate-800 hover:bg-slate-50 font-bold text-[14px] flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.99] transition-all"
              asChild
            >
              <a href={trackingUrl} target="_blank" rel="noopener noreferrer">
                <span>Track Package</span>
                <ExternalLink size={15} className="text-slate-500" />
              </a>
            </Button>
          ) : (
            <Button
              disabled
              variant="outline"
              className="w-full h-12 rounded-2xl border-slate-100 text-slate-300 font-bold text-[14px] flex items-center justify-center gap-2"
            >
              <span>Track Package</span>
              <ExternalLink size={15} />
            </Button>
          )}
        </Card>

        {/* ─── Progress Card ─── */}
        <ShipmentProgress currentStep={currentStep} steps={STEPPER_STEPS} />
      </motion.div>

      {/* ─── Bottom Action Bar (Buyer actions) ─── */}
      {isBuyer && (
        <BottomActionBar className="border-t border-slate-100/80">
          <div className="flex gap-4 items-start w-full">
            <div className="flex-1">
              <Button
                variant="outline"
                onClick={onReportIssue}
                className="w-full h-14 text-[14px] font-bold rounded-2xl border-rose-200 text-rose-600 hover:bg-rose-50/50 hover:border-rose-300 active:scale-95 transition-all shadow-sm flex items-center justify-center cursor-pointer"
              >
                Report an Issue
              </Button>
            </div>

            <div className="flex-1 flex flex-col gap-1.5 items-center">
              <Button
                onClick={onConfirmDelivery}
                disabled={!canConfirm || isConfirming}
                className={cn(
                  "w-full h-14 text-[14px] font-bold rounded-2xl flex items-center justify-center gap-2 transition-all border-none select-none",
                  canConfirm
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-md cursor-pointer active:scale-95"
                    : "bg-slate-100/70 text-slate-400 cursor-not-allowed"
                )}
              >
                <span>Confirm Delivery</span>
              </Button>
              {!canConfirm && (
                <span className="text-[10px] font-bold text-slate-400 text-center leading-tight">
                  Available after the estimated delivery date.
                </span>
              )}
            </div>
          </div>
        </BottomActionBar>
      )}
    </div>
  );
}
