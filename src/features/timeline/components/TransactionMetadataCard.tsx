"use client";

interface TransactionMetadataCardProps {
  handlingTime?: string;
  isInsured?: boolean;
  carrier?: string;
  shippingType?: string;
}

export function TransactionMetadataCard({
  handlingTime,
  isInsured,
  carrier,
  shippingType,
}: TransactionMetadataCardProps) {
  return (
    <div className="bg-background border border-border/80 rounded-[32px] p-5 shadow-xs flex flex-col gap-2.5 text-xs text-muted-foreground font-bold">
      <div className="flex justify-between">
        <span>Handling Time</span>
        <span className="text-foreground font-extrabold">{handlingTime || "1-2 days"}</span>
      </div>
      <div className="flex justify-between">
        <span>Insurance Coverage</span>
        <span className="text-foreground font-extrabold">
          {isInsured ? "Fully Covered" : "None"}
        </span>
      </div>
      <div className="flex justify-between">
        <span>Carrier Account</span>
        <span className="text-foreground font-extrabold">
          {carrier || "USPS"} ({shippingType || "Standard"})
        </span>
      </div>
    </div>
  );
}
