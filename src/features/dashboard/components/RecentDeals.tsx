import React from "react";
import { ChevronRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DealItem {
  id: string;
  title: string;
  type: "selling" | "buying";
  score: number;
  status: string;
  statusType: "warning" | "success" | "muted" | string;
  price: string;
  image: string;
}

interface RecentDealsProps {
  deals: DealItem[];
  onViewAllClick?: () => void;
  onDealClick?: (deal: DealItem) => void;
}

export const RecentDeals: React.FC<RecentDealsProps> = ({
  deals,
  onViewAllClick,
  onDealClick,
}) => {
  const getStatusColor = (statusType: string) => {
    switch (statusType) {
      case "warning":
        return "text-amber-600 dark:text-amber-400";
      case "success":
        return "text-emerald-600 dark:text-emerald-400";
      case "muted":
        return "text-muted-foreground";
      default:
        return "text-primary";
    }
  };

  return (
    <section className="w-full px-6 flex flex-col gap-3 select-none">
      {/* Title Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-foreground font-bold text-base tracking-tight">
          Recent Deals
        </h2>
        <Button
          variant="link"
          onClick={onViewAllClick}
          className="text-primary hover:text-primary/95 text-xs font-bold p-0 h-auto no-underline hover:no-underline"
        >
          View All
        </Button>
      </div>

      {/* Deals Box */}
      <div className="flex flex-col bg-card border border-border/60 rounded-2xl shadow-sm divide-y divide-border/50 overflow-hidden">
        {deals.map((deal) => (
          <div
            key={deal.id}
            onClick={() => onDealClick?.(deal)}
            className="flex items-center justify-between p-4 hover:bg-muted/30 cursor-pointer active:bg-muted/50 transition-all duration-150 group"
          >
            <div className="flex items-center gap-3">
              {/* Deal Thumbnail (Emoji Badge) */}
              <div className="w-12 h-12 rounded-full border border-border/40 bg-muted/50 flex items-center justify-center text-2xl shadow-inner select-none">
                {deal.image}
              </div>

              {/* Deal Info */}
              <div className="flex flex-col gap-0.5">
                <span className="font-extrabold text-sm text-foreground group-hover:text-primary transition-colors">
                  {deal.title}
                </span>

                <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase">
                  <span
                    className={
                      deal.type === "selling"
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-emerald-600 dark:text-emerald-400"
                    }
                  >
                    {deal.type}
                  </span>
                  <span className="text-muted-foreground/60">•</span>
                  <span className="inline-flex items-center gap-0.5 text-muted-foreground font-semibold">
                    <Shield className="w-2.5 h-2.5 text-muted-foreground/80 fill-muted-foreground/10" />
                    <span>{deal.score}</span>
                  </span>
                </div>

                <span className={`text-[11px] font-bold ${getStatusColor(deal.statusType)}`}>
                  {deal.status}
                </span>
              </div>
            </div>

            {/* Price & Chevron */}
            <div className="flex items-center gap-2">
              <div className="flex flex-col items-end">
                <span className="font-extrabold text-sm text-foreground">
                  {deal.price}
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
