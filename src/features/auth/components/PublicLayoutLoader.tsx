import React from "react";
import { Spinner } from "@/components/ui/spinner";

export const PublicLayoutLoader: React.FC = () => {
  return (
    <div className="w-full min-h-dvh bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex items-center justify-center">
          <Spinner className="w-10 h-10 text-primary" strokeWidth={2.5} />
        </div>
        <p className="text-sm font-semibold text-muted-foreground animate-pulse">
          Verifying secure session...
        </p>
      </div>
    </div>
  );
};
