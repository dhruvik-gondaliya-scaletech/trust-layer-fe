"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Clock,
  CheckCircle2,
  ShieldAlert,
  Scale,
  RotateCcw,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Dispute } from "@/types/api.types";

interface DisputeStatusBannerProps {
  dispute: Dispute;
  isBuyer: boolean;
}

function getBannerDetails(dispute: Dispute, isBuyer: boolean) {
  switch (dispute.status) {
    case "created":
      return {
        title: "Dispute Opened",
        desc: isBuyer
          ? "Waiting for the seller's response. Funds remain secured in TrustLayer escrow."
          : "Action Required: The buyer has reported an issue. Please review details and respond.",
        gradient: "from-amber-500 to-orange-600",
        icon: Clock,
      };

    case "seller_responded":
      if (dispute.action === "refund") {
        return {
          title: "Resolved via Refund",
          desc: "The seller accepted the dispute. A full refund has been initiated to the buyer.",
          gradient: "from-emerald-500 to-teal-600",
          icon: CheckCircle2,
        };
      }
      if (dispute.action === "return") {
        return {
          title: "Return Requested & Approved",
          desc: isBuyer
            ? "The seller requested the item back. Please ship it back using the tracking action below."
            : "Awaiting return shipment from the buyer. You will confirm receipt to complete refund.",
          gradient: "from-indigo-500 to-blue-600",
          icon: RotateCcw,
        };
      }
      return {
        title: "Dispute Declined by Seller",
        desc: isBuyer
          ? "The seller rejected your dispute claim. You can escalate to admin or accept the decline."
          : "You declined this dispute. Awaiting buyer's decision to accept or escalate to admin.",
        gradient: "from-rose-500 to-red-600",
        icon: ShieldAlert,
      };

    case "escalated":
      return {
        title: "Under Admin Review",
        desc: "This dispute has been escalated to TrustLayer arbitrators. We are reviewing both claims.",
        gradient: "from-purple-500 to-indigo-600",
        icon: Scale,
      };

    case "resolved":
      return {
        title: "Dispute Resolved",
        desc: "This case is finalized. Funds have been distributed as per resolution details.",
        gradient: "from-emerald-500 to-teal-600",
        icon: CheckCircle2,
      };

    default:
      return {
        title: "Active Dispute",
        desc: "Dispute under review.",
        gradient: "from-slate-500 to-slate-600",
        icon: Info,
      };
  }
}

export function DisputeStatusBanner({ dispute, isBuyer }: DisputeStatusBannerProps) {
  const banner = getBannerDetails(dispute, isBuyer);
  const BannerIcon = banner.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-[24px] p-5 text-white shadow-md relative overflow-hidden bg-gradient-to-br",
        banner.gradient
      )}
    >
      <div className="absolute top-0 right-0 -mr-6 -mt-6 w-28 h-28 rounded-full bg-white/10 blur-2xl" />
      <div className="relative z-10 flex items-start gap-4">
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shrink-0 backdrop-blur-md">
          <BannerIcon className="w-6 h-6 text-white" />
        </div>
        <div className="space-y-1">
          <h2 className="text-[18px] font-extrabold leading-tight">{banner.title}</h2>
          <p className="text-[13px] text-white/90 leading-relaxed font-medium">{banner.desc}</p>
        </div>
      </div>
    </motion.div>
  );
}
