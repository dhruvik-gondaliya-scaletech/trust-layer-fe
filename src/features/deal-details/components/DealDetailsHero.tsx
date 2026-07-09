"use client";

import { ChevronLeft, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { getStatusBadgeMeta } from "../utils/dealStatusMeta";
import { formatCurrency } from "../utils/format";
import type { Deal } from "@/types/api.types";

interface DealDetailsHeroProps {
  deal: Deal;
  onBack: () => void;
  onEdit?: () => void;
}

export function DealDetailsHero({ deal, onBack, onEdit }: DealDetailsHeroProps) {
  const badge = getStatusBadgeMeta(deal.status);
  const subtitleParts = [
    deal.condition, 
    deal.isGraded && deal.serialNumber ? `Graded · ${deal.serialNumber}` : null
  ].filter(Boolean);
  const productCondition = subtitleParts.length > 0 ? subtitleParts.join(" · ") : "Not specified";

  // Use the reference badge styling logic based on our badge text
  const getBadgeStyle = () => {
    if (badge.label === "Completed" || badge.label === "Closed") {
      return "bg-green-500/20 text-green-300 border-green-500/30";
    }
    if (badge.label === "Shipped" || badge.label === "Delivered") {
      return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    }
    return "bg-orange-500/20 text-orange-300 border-orange-500/30";
  };

  return (
    <div className="relative h-[200px] md:h-[220px] w-full bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-b border-white/5 overflow-hidden flex flex-col justify-end">
      {/* Background premium light glow */}
      <div className="absolute -top-20 -left-16 w-60 h-60 rounded-full bg-indigo-500/10 blur-[80px]" />
      <div className="absolute -bottom-20 -right-16 w-60 h-60 rounded-full bg-blue-500/10 blur-[80px]" />
      
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10 max-w-2xl mx-auto w-full px-4 sm:px-6">
        <button 
          onClick={onBack} 
          className="p-2 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all active:scale-95 border border-white/15 shadow-sm"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        
        <div className="flex items-center gap-2">
          {onEdit && (
            <button 
              onClick={onEdit} 
              className="px-3 py-1.5 rounded-full text-xs font-bold bg-white/10 hover:bg-white/25 text-white backdrop-blur-md border border-white/15 flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
            >
              <Pencil className="h-3 w-3" />
              <span>Edit</span>
            </button>
          )}
          <div className={cn(
            "px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider backdrop-blur-md border",
            getBadgeStyle()
          )}>
            {badge.label}
          </div>
        </div>
      </div>

      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 pb-6 z-10">
        <div className="w-full">
          <p className="text-slate-400 font-bold text-[11px] mb-1 uppercase tracking-widest">{deal.dealNumber}</p>
          <h1 className="text-white text-[22px] md:text-[26px] font-extrabold leading-tight mb-1.5 tracking-tight truncate">{deal.title}</h1>
          <div className="flex items-center justify-between mt-1">
            <span className="text-slate-300 text-[13px] font-medium truncate pr-4">{productCondition}</span>
            <span className="text-white text-[22px] md:text-[26px] font-black shrink-0">${formatCurrency(deal.buyerPaysAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
