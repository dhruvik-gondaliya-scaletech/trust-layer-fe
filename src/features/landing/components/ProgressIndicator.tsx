"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  totalSteps: number;
  currentStep: number; // 0-indexed
  dark?: boolean;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  totalSteps,
  currentStep,
  dark = false,
}) => {
  return (
    <div className="flex items-center gap-1.5" role="progressbar" aria-valuenow={currentStep + 1} aria-valuemin={1} aria-valuemax={totalSteps}>
      {Array.from({ length: totalSteps }).map((_, idx) => {
        const isActive = idx === currentStep;
        return (
          <div
            key={idx}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              isActive
                ? (dark ? "w-6 bg-white" : "w-6 bg-primary")
                : (dark ? "w-1.5 bg-white/30" : "w-1.5 bg-border dark:bg-border/40")
            )}
          />
        );
      })}
    </div>
  );
};
