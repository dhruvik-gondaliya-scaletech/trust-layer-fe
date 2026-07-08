import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardErrorProps {
  message: string;
  onRetry?: () => void;
}

export const DashboardError: React.FC<DashboardErrorProps> = ({
  message,
  onRetry,
}) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-8 py-12 min-h-[400px] select-none">
      {/* Icon */}
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-5">
        <AlertTriangle className="w-8 h-8" strokeWidth={1.5} />
      </div>

      <h2 className="text-lg font-extrabold text-foreground tracking-tight mb-2">
        Unable to Load Dashboard
      </h2>
      <p className="text-sm text-muted-foreground max-w-[270px] leading-relaxed mb-6">
        {message || "We encountered an unexpected problem while fetching your dashboard data. Please check your connection and try again."}
      </p>

      {onRetry && (
        <Button
          onClick={onRetry}
          className="bg-primary hover:bg-primary/95 text-white font-bold rounded-2xl h-11 px-6 flex items-center gap-2 shadow-md shadow-primary/10 active:scale-95 transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </Button>
      )}
    </div>
  );
};
