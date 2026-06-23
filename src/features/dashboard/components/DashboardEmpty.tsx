import React from "react";
import { Inbox, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardEmptyProps {
  name: string;
  onCreateDeal?: () => void;
}

export const DashboardEmpty: React.FC<DashboardEmptyProps> = ({
  name,
  onCreateDeal,
}) => {
  return (
    <div className="w-full flex flex-col items-center justify-center text-center p-8 min-h-[500px] select-none">
      {/* Dynamic graphic box */}
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-5 relative">
        <Inbox className="w-10 h-10" />
        <div className="absolute top-3 right-3 w-3 h-3 bg-indigo-500 rounded-full border-2 border-card" />
      </div>

      <h2 className="text-xl font-extrabold text-foreground tracking-tight mb-2">
        No Active Deals, {name}
      </h2>
      <p className="text-sm text-muted-foreground max-w-[280px] leading-relaxed mb-8">
        You haven&apos;t started any secure escrow deals yet. Create a transaction link to trade safely!
      </p>

      <Button
        onClick={onCreateDeal}
        size="lg"
        className="w-full max-w-xs bg-primary text-primary-foreground hover:bg-primary/95 shadow-md shadow-primary/10 rounded-2xl h-12 text-sm font-bold flex items-center justify-center gap-2 active:scale-98 transition-all"
      >
        <Plus className="w-5 h-5" />
        <span>Create New Deal</span>
      </Button>
    </div>
  );
};
