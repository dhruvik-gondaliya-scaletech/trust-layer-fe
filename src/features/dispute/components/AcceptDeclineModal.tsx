"use client";

import React from "react";
import { HandCoins, XCircle, ShieldCheck, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedModal } from "@/components/shared/animated-modal";

interface AcceptDeclineModalProps {
  isOpen: boolean;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

const CONSEQUENCES = [
  {
    icon: XCircle,
    iconClass: "text-red-400",
    text: (
      <>
        Your dispute claim will be <strong>permanently closed</strong> — no further review.
      </>
    ),
  },
  {
    icon: HandCoins,
    iconClass: "text-amber-500",
    text: (
      <>
        Escrowed funds will be <strong>released to the seller</strong> immediately.
      </>
    ),
  },
  {
    icon: ShieldCheck,
    iconClass: "text-slate-400",
    text: (
      <>
        This action is <strong>irreversible</strong> and cannot be appealed afterward.
      </>
    ),
  },
] as const;

export function AcceptDeclineModal({
  isOpen,
  isPending,
  onClose,
  onConfirm,
}: AcceptDeclineModalProps) {
  const handleConfirm = async () => {
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AnimatedModal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      className="max-w-md"
      showCloseButton={false}
    >
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col items-center text-center pt-2 pb-1">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200 flex items-center justify-center mb-3 shadow-inner">
            <HandCoins className="w-7 h-7 text-slate-500" />
          </div>
          <h2 className="text-[18px] font-extrabold text-slate-900 tracking-tight">
            Accept Seller's Decline?
          </h2>
          <p className="text-[12.5px] text-slate-400 font-medium mt-1 max-w-[280px] leading-relaxed">
            You are choosing to close this dispute without escalating it to our admin team.
          </p>
        </div>

        {/* Consequence list */}
        <div className="rounded-2xl overflow-hidden border border-slate-100">
          <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-100">
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">
              What this means
            </p>
          </div>
          <div className="p-4 space-y-3">
            {CONSEQUENCES.map(({ icon: Icon, iconClass, text }, i) => (
              <div key={i} className="flex items-start gap-3">
                <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${iconClass}`} />
                <p className="text-[12.5px] text-slate-600 font-medium leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Warning */}
        <div className="flex gap-2.5 bg-red-50 border border-red-100 rounded-2xl p-3.5">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <p className="text-[11.5px] text-red-600 font-medium leading-relaxed">
            If you believe the seller's decision is unfair, consider escalating to admin instead.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isPending}
            className="flex-1 h-12 rounded-[14px] font-bold text-slate-500"
          >
            Go Back
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isPending}
            className="flex-1 h-12 rounded-[14px] bg-slate-800 hover:bg-slate-900 text-white font-bold shadow-md"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Accepting...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Yes, Accept & Close
              </span>
            )}
          </Button>
        </div>
      </div>
    </AnimatedModal>
  );
}
