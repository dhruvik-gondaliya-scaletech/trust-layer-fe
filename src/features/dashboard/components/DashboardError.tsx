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
    <div className="w-full flex flex-col items-center justify-center text-center p-8 min-h-[500px] select-none">
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-4 animate-bounce">
        <AlertTriangle className="w-8 h-8" />
      </div>

      <h2 className="text-lg font-extrabold text-foreground tracking-tight mb-2">
        Unable to Load Dashboard
      </h2>
      <p className="text-sm text-muted-foreground max-w-xs leading-relaxed mb-6">
        {message || "We encountered an unexpected problem while fetching your dashboard data."}
      </p>

      {onRetry && (
        <Button
          onClick={onRetry}
          className="bg-primary hover:bg-primary/95 text-white font-bold rounded-2xl h-10 px-5 flex items-center gap-2 shadow-md shadow-primary/10 active:scale-95 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </Button>
      )}
    </div>
  );
};
