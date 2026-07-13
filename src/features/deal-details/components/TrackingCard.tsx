"use client";

import { useState } from "react";
import { Copy, Check, Package, MapPin, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { getCarrierTrackingUrl, formatCurrency } from "../utils/format";
import type { Deal } from "@/types/api.types";
import { DealStatus, OrderType } from "@/types/enums";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TrackingCardProps {
  deal: Deal;
}

export function TrackingCard({ deal }: TrackingCardProps) {
  const [copied, setCopied] = useState(false);

  if (deal.orderType === OrderType.IN_PERSON) {
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
  const carrierLabel = deal.carrier === "Other" ? deal.carrierOther || "Carrier" : deal.carrier || "Carrier";
  const shippingCost = Number(deal.shippingCost || 0);
  const shippingTypeLabel = deal.shippingType ? deal.shippingType.charAt(0).toUpperCase() + deal.shippingType.slice(1) : "Standard";
  const trackingUrl = deal.trackingNumber ? (getCarrierTrackingUrl(deal.carrier, deal.trackingNumber) || deal.trackingUrl) : null;
  const status = deal.status;

  const handleCopy = async () => {
    if (!deal.trackingNumber) return;
    try {
      await navigator.clipboard.writeText(deal.trackingNumber);
      setCopied(true);
      toast.success("Tracking number copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy tracking number");
    }
  };

  return (
    <Card className="p-5 border-gray-100 shadow-sm rounded-2xl bg-white space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-gray-50">
        <Package className="w-4 h-4 text-blue-500" />
        <h4 className="font-bold text-[14px] text-gray-900">Shipping Details</h4>
      </div>

      {!deal.handlingTime ? (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-500">
          <AlertCircle className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-500" />
          <div className="flex flex-col gap-0.5">
            <span className="text-[13px] font-extrabold leading-normal">
              Add shipping details to publish the deal
            </span>
            <span className="text-[11px] font-medium text-amber-600/90 dark:text-amber-500/90 leading-normal">
              Please click on Edit Deal to complete the shipping configuration.
            </span>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 text-[13px]">
            <div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Carrier & Type</span>
              <span className="font-bold text-gray-950">{carrierLabel} ({shippingTypeLabel})</span>
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Shipping Cost</span>
              <span className="font-bold text-gray-950">
                {shippingCost > 0 ? `$${formatCurrency(shippingCost)}` : "Free"}
              </span>
            </div>
            {deal.handlingTime && (
              <div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Handling Time</span>
                <span className="font-bold text-gray-950 flex items-center gap-1 text-gray-800">
                  <Clock className="w-3.5 h-3.5 text-gray-400" /> {deal.handlingTime} Days
                </span>
              </div>
            )}
            <div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Status</span>
              <span className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider",
                deal.trackingNumber
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                  : "bg-amber-50 text-amber-700 border border-amber-100"
              )}>
                {deal.trackingNumber ? "Shipped" : "Awaiting Shipment"}
              </span>
            </div>
          </div>

          {deal.trackingNumber ? (
            <div className="pt-3 border-t border-gray-50 flex flex-col gap-3">
              <div className="flex justify-between items-center bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Tracking Number</span>
                  <button 
                    onClick={handleCopy}
                    className="text-[14px] font-mono font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5"
                  >
                    <span className="truncate max-w-[180px]">{deal.trackingNumber}</span>
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              {trackingUrl && (status === DealStatus.SHIPPED || status === DealStatus.DELIVERED || status === DealStatus.CLOSED) && (
                <Button 
                  className="w-full bg-slate-900 text-white hover:bg-slate-800 font-bold h-11 rounded-xl shadow-xs"
                  asChild
                >
                  <a href={trackingUrl} target="_blank" rel="noopener noreferrer">
                    Track Package
                  </a>
                </Button>
              )}
            </div>
          ) : (
            <div className="pt-3 border-t border-gray-50 text-center">
              <p className="text-[12px] text-gray-500 font-medium">
                Tracking information will be updated once the seller ships the item.
              </p>
            </div>
          )}
        </>
      )}
    </Card>
  );
}
