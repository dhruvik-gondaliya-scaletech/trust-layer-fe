"use client";

import { CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "../utils/format";
import type { Deal } from "@/types/api.types";
import { useRole } from "@/providers/role-provider";
import { Card } from "@/components/ui/card";

const FEE_PAYER_LABEL: Record<Deal["feePayer"], string> = {
  buyer: "Buyer",
  seller: "Seller",
  split: "Split",
};

interface PaymentSummaryCardProps {
  deal: Deal;
}

export function PaymentSummaryCard({ deal }: PaymentSummaryCardProps) {
  const { role } = useRole();
  const isSeller = role === "seller";
  const theme = {
    text: isSeller ? "text-blue-600" : "text-[#10B981]",
  };

  const hasBeenFunded = Boolean(deal.fundedAt);
  const fundsReleased = deal.status === "closed" || (deal.status as string) === "completed";
  const shippingCost = Number(deal.shippingCost);

  return (
    <Card className="p-0 border-gray-100 shadow-sm rounded-2xl overflow-hidden">
      <div className="p-5 bg-white">
        <h3 className="font-bold text-[16px] text-gray-900 mb-4 flex items-center gap-2">
          <CreditCard className={cn("w-4 h-4", theme.text)} /> Payment Summary
        </h3>
        
        <div className="space-y-3 text-[14px]">
          <div className="flex justify-between items-center text-gray-600 font-medium">
            <span>Item Price</span>
            <span className="text-gray-900 font-bold">${formatCurrency(deal.price)}</span>
          </div>
          
          {deal.orderType !== "in_person" && shippingCost > 0 && (
            <div className="flex justify-between items-center text-gray-600 font-medium">
              <span>Shipping (Reimbursed to Seller)</span>
              <span className="text-gray-900 font-bold">${formatCurrency(shippingCost)}</span>
            </div>
          )}
          
          <div className="flex justify-between items-center text-gray-600 font-medium">
            <span>Platform Fee</span>
            <span className="text-gray-900 font-bold">
              ${formatCurrency(deal.platformFeeAmount)} ({FEE_PAYER_LABEL[deal.feePayer]})
            </span>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 border-t border-gray-100 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-[13px] font-bold text-gray-500 uppercase tracking-wider">
            {hasBeenFunded ? "Buyer Paid" : "Buyer Pays"}
          </span>
          <span className="text-[18px] font-black text-gray-900">${formatCurrency(deal.buyerPaysAmount)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[13px] font-bold text-gray-500 uppercase tracking-wider">
            {fundsReleased ? "Seller Received" : "Seller Will Receive"}
          </span>
          <span className="text-[16px] font-bold text-green-600">${formatCurrency(deal.sellerReceivesAmount)}</span>
        </div>
      </div>
    </Card>
  );
}
