"use client";

import React from "react";
import { ShieldAlert, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Dispute } from "@/types/api.types";

interface DisputeClaimCardProps {
  dispute: Dispute;
}

export function DisputeClaimCard({ dispute }: DisputeClaimCardProps) {
  return (
    <Card className="rounded-[24px] border-slate-100 shadow-soft bg-white p-5 space-y-4">
      {/* Card header */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center">
          <ShieldAlert className="w-4 h-4 text-rose-500" />
        </div>
        <h3 className="text-[15px] font-bold text-slate-800">Dispute Claim Details</h3>
      </div>

      <div className="space-y-3.5">
        {/* Reason */}
        <div className="flex justify-between items-center border-b border-slate-50 pb-3">
          <span className="text-[13px] text-slate-400 font-bold">Reason</span>
          <span className="text-[13px] font-extrabold text-slate-800 bg-slate-100 px-3 py-1 rounded-full">
            {dispute.reason}
          </span>
        </div>

        {/* Buyer explanation */}
        <div className="space-y-1.5">
          <span className="text-[13px] text-slate-400 font-bold block">Buyer's Explanation</span>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/50 text-[13.5px] leading-relaxed text-slate-600 font-medium">
            {dispute.explanation}
          </div>
        </div>

        {/* Evidence gallery */}
        <div className="space-y-2">
          <span className="text-[13px] text-slate-400 font-bold block">Supporting Evidence</span>
          <div className="grid grid-cols-3 gap-2">
            <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm group cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?q=80&w=200&auto=format&fit=crop"
                alt="Evidence Photo 1"
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-bold backdrop-blur-sm">
                Damaged Package
              </div>
            </div>
            <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm group cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=200&auto=format&fit=crop"
                alt="Evidence Photo 2"
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-bold backdrop-blur-sm">
                Item Front
              </div>
            </div>
            <div className="bg-slate-100 border border-slate-200 border-dashed rounded-xl flex flex-col items-center justify-center text-slate-400 aspect-video gap-1">
              <FileText className="w-5 h-5 text-slate-400" />
              <span className="text-[9.5px] font-bold">Unboxing.mp4</span>
            </div>
          </div>
        </div>

        {/* Seller response (if submitted) */}
        {dispute.sellerExplanation && (
          <div className="space-y-1.5 pt-3 border-t border-slate-50">
            <span className="text-[13px] text-slate-400 font-bold block">Seller's Response Remarks</span>
            <div className="bg-indigo-50/20 p-4 rounded-2xl border border-indigo-100/50 text-[13.5px] leading-relaxed text-slate-600 font-medium">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Action Chosen</span>
                <span className="text-[12px] font-extrabold text-indigo-600 uppercase tracking-wider">
                  {dispute.action}
                </span>
              </div>
              <p className="italic">"{dispute.sellerExplanation}"</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
