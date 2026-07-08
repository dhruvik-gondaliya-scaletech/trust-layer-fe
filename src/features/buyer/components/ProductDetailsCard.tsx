"use client";

import type { Deal } from "@/types/buyer-view.types";

interface ProductDetailsCardProps {
  deal: Pick<Deal, "productType" | "condition" | "dealNumber" | "title" | "price" | "serialNumber" | "gradedCompany">;
}

export function ProductDetailsCard({ deal }: ProductDetailsCardProps) {
  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
      <div className="flex justify-between items-start mb-1">
        <p className="text-[12px] font-bold text-primary uppercase tracking-wider">
          {deal.productType} • {deal.condition || "Standard"}
        </p>
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-gray-100 px-1.5 py-0.5 rounded">
          {deal.dealNumber}
        </span>
      </div>
      <h1 className="text-[18px] font-extrabold leading-tight mb-2 text-foreground">
        {deal.title}
      </h1>
      <div className="text-[28px] font-black text-foreground mb-4">
        ${deal.price.toLocaleString("en-US", { minimumFractionDigits: 0 })}
      </div>

      <div className="space-y-4">
        <div className="pt-2 flex flex-col gap-2">
          <div className="flex justify-between items-center py-2 border-b border-gray-50">
            <div className="text-[12px] text-muted-foreground font-medium">Condition</div>
            <div className="text-[13px] font-bold text-foreground">{deal.condition || "Not specified"}</div>
          </div>
          {deal.serialNumber && (
            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <div className="text-[12px] text-muted-foreground font-medium">Certification Number</div>
              <div className="text-[13px] font-bold text-primary">{deal.serialNumber}</div>
            </div>
          )}
          {deal.gradedCompany && (
            <div className="flex justify-between items-center py-2">
              <div className="text-[12px] text-muted-foreground font-medium">Graded Company</div>
              <div className="text-[13px] font-bold text-foreground">{deal.gradedCompany}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
