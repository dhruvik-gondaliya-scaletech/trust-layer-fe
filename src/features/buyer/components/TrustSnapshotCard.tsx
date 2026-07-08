"use client";

import { Check, X, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { VerificationStep } from "@/types/buyer-view.types";

interface TrustSnapshotCardProps {
  displayScore: number;
  verificationSteps: VerificationStep[];
  confidenceTitle: string;
  confidenceMessage: string;
}

export function TrustSnapshotCard({
  displayScore,
  verificationSteps,
  confidenceTitle,
  confidenceMessage,
}: TrustSnapshotCardProps) {
  return (
    <div className="bg-blue-50/50 border border-blue-100 rounded-3xl p-5 shadow-sm relative overflow-hidden">
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <h3 className="font-bold text-[15px] text-blue-950 flex items-center gap-1.5">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            Protected by TrustLayer
          </h3>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[9px] text-blue-900/60 uppercase font-bold tracking-widest mb-0.5">Current Trust Score</span>
          <span className="text-[22px] font-black text-blue-600 leading-none">{displayScore} / 100</span>
        </div>
      </div>

      <div className="space-y-3 relative z-10">
        {verificationSteps.map((step) => (
           <div key={step.id} className="flex flex-col gap-0.5">
             <div className="flex items-center gap-2.5">
               {step.isComplete ? (
                 <Check className="w-4 h-4 text-blue-600 stroke-[3]" />
               ) : (
                 <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center">
                   <X className="w-2.5 h-2.5 text-gray-600 stroke-[4]" />
                 </div>
               )}
               <span className={cn(
                 "text-[13px] font-medium",
                 step.isComplete ? "text-blue-900" : "text-gray-500"
               )}>
                 {step.label}
               </span>
             </div>
             {!step.isComplete && step.errorMsg && (
               <div className="pl-[26px]">
                 <span className="text-[11px] text-gray-500 leading-tight">{step.errorMsg}</span>
               </div>
             )}
           </div>
        ))}
      </div>
      <div className="mt-5 pt-3 border-t border-blue-200/50 flex flex-col gap-0.5">
        <span className="text-[12px] font-bold text-blue-900">
          {confidenceTitle}
        </span>
        <span className="text-[11px] text-blue-900/80">
          {confidenceMessage}
        </span>
      </div>
    </div>
  );
}
