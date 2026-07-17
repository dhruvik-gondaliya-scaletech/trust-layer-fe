"use client";

import React, { useState } from "react";
import { CheckCircle2, RotateCcw, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AnimatedModal } from "@/components/shared/animated-modal";
import { cn } from "@/lib/utils";
import type { RespondDisputeDto } from "@/types/api.types";

interface SellerRespondModalProps {
  isOpen: boolean;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (dto: RespondDisputeDto) => Promise<void>;
}

export function SellerRespondModal({
  isOpen,
  isPending,
  onClose,
  onSubmit,
}: SellerRespondModalProps) {
  const [action, setAction] = useState<"refund" | "return" | "decline">("refund");
  const [explanation, setExplanation] = useState("");

  const ACTION_OPTIONS = [
    { value: "refund" as const,  label: "Refund",         icon: CheckCircle2 },
    { value: "return" as const,  label: "Return & Refund", icon: RotateCcw },
    { value: "decline" as const, label: "Decline",         icon: ShieldAlert },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!explanation.trim()) return;
    try {
      await onSubmit({
        action,
        sellerExplanation: explanation,
        returnShippingFeeSplit: action === "return" ? "seller" : undefined,
        returnAddressId: action === "return" ? "default-address-id" : undefined,
      });
      setExplanation("");
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AnimatedModal
      isOpen={isOpen}
      onClose={onClose}
      title="Respond to Dispute"
      className="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-5 pt-2">
        {/* Action selector */}
        <div className="space-y-2">
          <span className="text-[12.5px] font-bold text-slate-500">Choose Action</span>
          <div className="grid grid-cols-3 gap-2">
            {ACTION_OPTIONS.map(({ value, label, icon: Icon }) => (
              <div
                key={value}
                onClick={() => setAction(value)}
                className={cn(
                  "border-2 rounded-xl p-3 text-center cursor-pointer transition-all",
                  action === value
                    ? "border-primary bg-primary/5 text-primary font-bold"
                    : "border-slate-100 text-slate-500 font-medium"
                )}
              >
                <Icon className="w-5 h-5 mx-auto mb-1" />
                <span className="text-xs">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Explanation */}
        <div className="space-y-1.5">
          <span className="text-[12.5px] font-bold text-slate-500">Explanation Note</span>
          <Textarea
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            placeholder="Explain your decision to the buyer..."
            className="rounded-xl min-h-[100px] resize-none"
            required
          />
        </div>

        {/* Actions */}
        <div className="pt-2 flex gap-3">
          <Button type="button" variant="ghost" onClick={onClose} className="flex-1 h-12 rounded-[14px]">
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isPending || !explanation.trim()}
            className="flex-1 h-12 rounded-[14px] bg-primary text-white font-bold"
          >
            {isPending ? <span>Submitting...</span> : <span>Send Response</span>}
          </Button>
        </div>
      </form>
    </AnimatedModal>
  );
}
