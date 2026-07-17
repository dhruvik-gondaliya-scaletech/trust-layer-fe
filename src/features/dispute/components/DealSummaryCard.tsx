"use client";

import React from "react";
import { FileText, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { Deal } from "@/types/api.types";

interface DealSummaryCardProps {
  deal: Deal;
}

export function DealSummaryCard({ deal }: DealSummaryCardProps) {
  return (
    <Card className="rounded-[24px] border-slate-100 shadow-soft bg-white p-5 space-y-4">
      {/* Card header */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
          <FileText className="w-4 h-4 text-slate-500" />
        </div>
        <h3 className="text-[15px] font-bold text-slate-800">Deal Summary</h3>
      </div>

      <div className="space-y-2.5">
        {/* Deal number */}
        <div className="flex justify-between">
          <span className="text-[12.5px] font-bold text-slate-400">Deal Number</span>
          <span className="text-[12.5px] font-extrabold text-slate-800">{deal.dealNumber}</span>
        </div>

        {/* Item title */}
        <div className="flex justify-between">
          <span className="text-[12.5px] font-bold text-slate-400">Item Title</span>
          <span className="text-[12.5px] font-extrabold text-slate-800 truncate max-w-[200px]">
            {deal.title}
          </span>
        </div>

        {/* Escrow value */}
        <div className="flex justify-between">
          <span className="text-[12.5px] font-bold text-slate-400">Escrow Value</span>
          <span className="text-[13px] font-black text-rose-500">
            {formatCurrency(deal.buyerPaysAmount)}
          </span>
        </div>

        {/* Buyer */}
        <div className="flex justify-between items-center border-t border-slate-50 pt-2 mt-2">
          <span className="text-[12px] font-bold text-slate-400">Buyer</span>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
              <User className="w-2.5 h-2.5 text-slate-500" />
            </div>
            <span className="text-[12px] font-extrabold text-slate-700">
              {deal.buyer?.firstName} {deal.buyer?.lastName}
            </span>
          </div>
        </div>

        {/* Seller */}
        <div className="flex justify-between items-center">
          <span className="text-[12px] font-bold text-slate-400">Seller</span>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
              <User className="w-2.5 h-2.5 text-slate-500" />
            </div>
            <span className="text-[12px] font-extrabold text-slate-700">
              {deal.seller?.firstName} {deal.seller?.lastName}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
