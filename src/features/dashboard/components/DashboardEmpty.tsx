import React from "react";
import { Inbox, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRole } from "@/providers/role-provider";

interface DashboardEmptyProps {
  name: string;
  onCreateDeal?: () => void;
}

export const DashboardEmpty: React.FC<DashboardEmptyProps> = ({
  name,
  onCreateDeal,
}) => {
  const { role } = useRole();
  const isSeller = role === "seller";

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-8 py-12 min-h-[400px] select-none">
      {/* Animated icon container */}
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-5 relative">
        <Inbox className="w-10 h-10" strokeWidth={1.5} />
        <div className="absolute top-2.5 right-2.5 w-3 h-3 bg-primary rounded-full border-2 border-background animate-pulse" />
      </div>

      <h2 className="text-xl font-extrabold text-foreground tracking-tight mb-2">
        {isSeller ? `Ready to Sell, ${name}?` : `No Purchases Yet, ${name}`}
      </h2>
      <p className="text-sm text-muted-foreground max-w-[270px] leading-relaxed mb-8">
        {isSeller
          ? "You haven't started any secure escrow deals yet. Create a transaction link to trade safely with buyers."
          : "You haven't purchased any items yet. Wait for a seller to send you a secure escrow deal link."}
      </p>

      {isSeller && (
        <Button
          onClick={onCreateDeal}
          size="lg"
          className="w-full max-w-[280px] bg-primary text-primary-foreground hover:bg-primary/95 shadow-md shadow-primary/10 rounded-2xl h-12 text-sm font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>Create Your First Deal</span>
        </Button>
      )}
    </div>
  );
};
