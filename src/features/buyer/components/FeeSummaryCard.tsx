"use client";

interface FeeSummaryCardProps {
  feePayer: string;
  price: number;
  shippingCost: number;
  buyerFeeShare: number;
  totalDue: number;
}

export function FeeSummaryCard({ feePayer, price, shippingCost, buyerFeeShare, totalDue }: FeeSummaryCardProps) {
  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
      <div className="mb-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-[16px] font-bold text-foreground">Fee Responsibility</h3>
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded">Selected by Seller</span>
        </div>
        <p className="text-[14px] font-semibold text-foreground mt-2">
          {feePayer === "split" ? "Platform Fee Shared 50/50" : feePayer === "buyer" ? "Buyer Pays 100% of Platform Fee" : "Seller Pays 100% of Platform Fee"}
        </p>
        <p className="text-[13px] text-muted-foreground mt-1 leading-relaxed">
          {feePayer === "split" ? "The seller has chosen to split the TrustLayer platform fee equally." : feePayer === "buyer" ? "The seller has chosen for the buyer to pay the full TrustLayer platform fee." : "The seller has chosen to cover the full TrustLayer platform fee."}
        </p>
      </div>

      <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100 space-y-3 text-[13px]">
        <div className="flex justify-between text-muted-foreground">
          <span>Item Price</span>
          <span className="font-medium text-foreground">${price.toLocaleString("en-US", { minimumFractionDigits: 0 })}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Shipping Cost</span>
          <span className="font-medium text-foreground">
            {shippingCost > 0
              ? `$${shippingCost.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              : "$0"}
          </span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>
            {feePayer === "split" ? "Your Fee Share (non-refundable)" : "Platform Fee (non-refundable)"}
          </span>
          <span className="font-medium text-foreground">
            ${buyerFeeShare.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        <div className="my-3 border-t border-dashed border-gray-200" />

        <div className="flex justify-between items-center mb-1">
          <span className="font-bold text-foreground text-[14px]">Total Due</span>
          <span className="text-[24px] font-black text-primary tracking-tight">
            ${totalDue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </div>
  );
}
