"use client";

interface PricingSummaryCardProps {
  itemPrice: number;
  platformFee: number;
  buyerPays: number;
}

export function PricingSummaryCard({ itemPrice, platformFee, buyerPays }: PricingSummaryCardProps) {
  return (
    <div className="bg-background border border-border/80 rounded-[32px] p-5 shadow-xs flex flex-col gap-3">
      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-0.5">
        Pricing Structure
      </span>

      <div className="flex flex-col gap-2 pt-2 border-t border-border/10 text-xs font-bold text-foreground/80">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground font-medium">Product price</span>
          <span>${itemPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-muted-foreground font-medium">Shipping fee</span>
          <span className="text-emerald-500 font-extrabold uppercase">FREE</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-muted-foreground font-medium">TrustLayer Fee</span>
          <span>${platformFee.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-border/40 text-sm font-black text-foreground">
          <span>Total Lock</span>
          <span className="text-primary font-black">
            ${buyerPays.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </div>
  );
}
