"use client";

import { useState } from "react";
import { Copy, Check, Package, MapPin } from "lucide-react";
import { toast } from "sonner";
import { getCarrierTrackingUrl } from "../utils/format";
import type { Deal } from "@/types/api.types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TrackingCardProps {
  deal: Deal;
}

export function TrackingCard({ deal }: TrackingCardProps) {
  const [copied, setCopied] = useState(false);

  if (deal.orderType === "in_person") {
    return (
      <Card className="p-4 border-gray-100 shadow-sm rounded-2xl bg-white">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Delivery Method</span>
            <span className="text-[14px] font-bold text-gray-900 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-orange-500" /> In-Person Handover
            </span>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Location</span>
            <span className="text-[14px] font-bold text-gray-900">
              Agreed Venue
            </span>
          </div>
        </div>
      </Card>
    );
  }

  // Online Transaction
  if (!deal.trackingNumber) return null;

  const carrierLabel = deal.carrier === "Other" ? deal.carrierOther || "Carrier" : deal.carrier || "Carrier";
  const trackingUrl = getCarrierTrackingUrl(deal.carrier, deal.trackingNumber);
  const status = (deal.status as string) === "completed" ? "completed" : deal.status;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(deal.trackingNumber!);
      setCopied(true);
      toast.success("Tracking number copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy tracking number");
    }
  };

  return (
    <Card className="p-4 border-gray-100 shadow-sm rounded-2xl bg-white">
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Shipping Method</span>
          <span className="text-[14px] font-bold text-gray-900 flex items-center gap-1.5">
            <Package className="w-4 h-4 text-blue-500" /> {carrierLabel}
          </span>
        </div>
        <div className="text-right">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Tracking Number</span>
          <button 
            onClick={handleCopy}
            className="text-[14px] font-mono font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span className="truncate max-w-[120px]">{deal.trackingNumber}</span>
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
      
      {trackingUrl && (status === "shipped" || status === "delivered" || status === "closed" || status === "completed") && (
        <Button 
          className="w-full bg-gray-50 text-gray-900 hover:bg-gray-100 border-none font-bold h-10"
          asChild
        >
          <a href={trackingUrl} target="_blank" rel="noopener noreferrer">
            Track Package
          </a>
        </Button>
      )}
    </Card>
  );
}
