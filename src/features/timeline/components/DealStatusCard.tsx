import { cn } from "@/lib/utils";
import type { DealStatus } from "@/types/api.types";

interface DealStatusCardProps {
  dealNumber: string;
  currentStatus: DealStatus;
  title: string;
  itemPrice: number;
}

export function DealStatusCard({ dealNumber, currentStatus, title, itemPrice }: DealStatusCardProps) {
  return (
    <div className="flex flex-col gap-2 bg-card border border-border/40 p-6 rounded-[32px] shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
          {dealNumber}
        </span>
        <span className={cn(
          "text-[10px] font-black px-2.5 py-0.5 rounded-md border uppercase tracking-wider",
          currentStatus === "closed"
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600"
            : currentStatus === "disputed"
              ? "bg-destructive/10 border-destructive/30 text-destructive"
              : currentStatus === "open"
                ? "bg-blue-500/10 border-blue-500/30 text-blue-600 animate-pulse"
                : "bg-amber-500/10 border-amber-500/30 text-amber-600"
        )}>
          Status: {currentStatus}
        </span>
      </div>
      <h1 className="text-xl lg:text-2xl font-extrabold tracking-tight text-foreground mt-1">
        {title}
      </h1>
      <span className="text-2xl lg:text-3xl font-black text-primary mt-0.5">
        ${itemPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </span>
    </div>
  );
}
