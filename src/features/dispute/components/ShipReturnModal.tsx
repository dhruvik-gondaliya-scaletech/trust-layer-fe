"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AnimatedModal } from "@/components/shared/animated-modal";
import type { ShipReturnDto } from "@/types/api.types";

interface ShipReturnModalProps {
  isOpen: boolean;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (dto: ShipReturnDto) => Promise<void>;
}

export function ShipReturnModal({ isOpen, isPending, onClose, onSubmit }: ShipReturnModalProps) {
  const [carrier, setCarrier] = useState("");
  const [shippingType, setShippingType] = useState<"standard" | "priority">("standard");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [estimatedDays, setEstimatedDays] = useState("5");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!carrier.trim() || !trackingNumber.trim()) return;
    try {
      const estimatedDeliveryAt = new Date();
      estimatedDeliveryAt.setDate(estimatedDeliveryAt.getDate() + parseInt(estimatedDays, 10));
      await onSubmit({
        carrier,
        shippingType,
        trackingNumber,
        estimatedDeliveryAt: estimatedDeliveryAt.toISOString(),
        trackingUrl: trackingUrl || undefined,
        notes: notes || undefined,
      });
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AnimatedModal
      isOpen={isOpen}
      onClose={onClose}
      title="Register Return Shipment"
      className="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <span className="text-[12px] font-bold text-slate-500">Carrier</span>
            <Input
              value={carrier}
              onChange={(e) => setCarrier(e.target.value)}
              placeholder="e.g. UPS, FedEx, DHL"
              className="rounded-xl"
              required
            />
          </div>
          <div className="space-y-1">
            <span className="text-[12px] font-bold text-slate-500">Shipping Service</span>
            <Select
              value={shippingType}
              onValueChange={(val) => setShippingType(val as "standard" | "priority")}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Standard" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[12px] font-bold text-slate-500">Tracking Number</span>
          <Input
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="Enter shipment tracking reference"
            className="rounded-xl"
            required
          />
        </div>

        <div className="space-y-1">
          <span className="text-[12px] font-bold text-slate-500">Est. Transit Duration (Days)</span>
          <Select value={estimatedDays} onValueChange={setEstimatedDays}>
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="5 Days" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2 Days (Express)</SelectItem>
              <SelectItem value="5">5 Days (Standard)</SelectItem>
              <SelectItem value="10">10 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <span className="text-[12px] font-bold text-slate-500">Tracking Link URL (Optional)</span>
          <Input
            value={trackingUrl}
            onChange={(e) => setTrackingUrl(e.target.value)}
            placeholder="e.g. https://www.ups.com/track?loc=en..."
            type="url"
            className="rounded-xl"
          />
        </div>

        <div className="space-y-1">
          <span className="text-[12px] font-bold text-slate-500">Additional Notes (Optional)</span>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any details for package dropoff..."
            className="rounded-xl min-h-[70px] resize-none text-[13px]"
          />
        </div>

        <div className="pt-2 flex gap-3">
          <Button type="button" variant="ghost" onClick={onClose} className="flex-1 h-12 rounded-[14px]">
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isPending || !carrier.trim() || !trackingNumber.trim()}
            className="flex-1 h-12 rounded-[14px] bg-primary text-white font-bold"
          >
            {isPending ? <span>Registering...</span> : <span>Submit Tracking</span>}
          </Button>
        </div>
      </form>
    </AnimatedModal>
  );
}
