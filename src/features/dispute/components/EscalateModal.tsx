"use client";

import React from "react";
import { Gavel, ShieldCheck, FileText, Scale, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedModal } from "@/components/shared/animated-modal";

interface EscalateModalProps {
  isOpen: boolean;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

const ESCALATION_STEPS = [
  { icon: ShieldCheck, label: "Case flagged for admin review", sub: "Submitted immediately" },
  { icon: FileText,    label: "Admin reviews all evidence",   sub: "Including your uploaded proof" },
  { icon: Scale,       label: "Binding decision issued",       sub: "Funds distributed accordingly" },
] as const;

export function EscalateModal({ isOpen, isPending, onClose, onConfirm }: EscalateModalProps) {
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
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-100 to-red-100 flex items-center justify-center mb-3 shadow-inner shadow-rose-200/50">
            <Gavel className="w-7 h-7 text-rose-600" />
          </div>
          <h2 className="text-[18px] font-extrabold text-slate-900 tracking-tight">
            Escalate to Admin
          </h2>
          <p className="text-[12.5px] text-slate-400 font-medium mt-1 max-w-[280px] leading-relaxed">
            A TrustLayer arbitrator will review your case and make a binding decision within 48 hours.
          </p>
        </div>

        {/* Process steps */}
        <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4 space-y-3">
          <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">
            What happens next
          </p>
          <div className="space-y-2.5">
            {ESCALATION_STEPS.map(({ icon: Icon, label, sub }, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5 text-slate-500" />
                </div>
                <div className="flex-1">
                  <p className="text-[12.5px] font-bold text-slate-700 leading-tight">{label}</p>
                  <p className="text-[11px] text-slate-400 font-medium">{sub}</p>
                </div>
                <span className="text-[11px] font-extrabold text-slate-300 tabular-nums">
                  0{i + 1}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Warning */}
        <div className="flex gap-2.5 bg-amber-50 border border-amber-100 rounded-2xl p-3.5">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-[11.5px] text-amber-700 font-medium leading-relaxed">
            Escalating is permanent and cannot be undone. The admin's ruling is final for all parties.
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
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isPending}
            className="flex-1 h-12 rounded-[14px] bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold shadow-lg shadow-rose-200"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Escalating...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Gavel className="w-4 h-4" />
                Confirm Escalation
              </span>
            )}
          </Button>
        </div>
      </div>
    </AnimatedModal>
  );
}
