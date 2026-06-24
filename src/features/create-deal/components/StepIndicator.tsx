import React from "react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps?: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps = 5,
}) => {
  return (
    <div className="w-full flex flex-col gap-2 select-none">
      {/* Horizontal Segments */}
      <div className="flex gap-1.5 w-full">
        {Array.from({ length: totalSteps }).map((_, idx) => {
          const stepNum = idx + 1;
          const isActive = stepNum <= currentStep;
          return (
            <div
              key={idx}
              className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                isActive ? "bg-primary" : "bg-muted-foreground/15"
              }`}
            />
          );
        })}
      </div>

      {/* Label */}
      <span className="text-xs font-bold text-primary uppercase tracking-wider">
        STEP {currentStep} OF {totalSteps}
      </span>
    </div>
  );
};
