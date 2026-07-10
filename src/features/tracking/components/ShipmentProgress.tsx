import React from "react";
import { Activity, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShipmentProgressProps {
  currentStep?: number;
  steps?: { step: number; label: string }[];
}

const DEFAULT_STEPS = [
  { step: 1, label: "Payment Completed" },
  { step: 2, label: "Preparing Shipment" },
  { step: 3, label: "Tracking Added" },
  { step: 4, label: "Confirm Delivery" },
  { step: 5, label: "Funds Released" },
];

export default function ShipmentProgress({
  currentStep = 2,
  steps = DEFAULT_STEPS,
}: ShipmentProgressProps) {
  const progressPercent =
    steps.length > 1 ? ((currentStep - 1) / (steps.length - 1)) * 100 : 0;

  return (
    <div className="bg-white border border-slate-100 rounded-[24px] p-5 shadow-sm flex flex-col gap-4">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-50">
        <Activity className="w-5 h-5 text-primary animate-pulse" />
        <span className="text-sm font-extrabold text-slate-800">Progress</span>
      </div>

      {/* Stepper Steps */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between relative px-2">
          {/* Connector line behind circles */}
          <div className="absolute top-[15px] left-8 right-8 h-[2px] bg-slate-100 -z-0">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {steps.map((item) => {
            const isCompleted = item.step <= currentStep;
            return (
              <div key={item.step} className="flex flex-col items-center gap-2 z-10 flex-1">
                <div
                  className={cn(
                    "w-7.5 h-7.5 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-300 shadow-sm",
                    isCompleted
                      ? "bg-primary text-white scale-105"
                      : "bg-white border-2 border-slate-200 text-slate-400"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : (
                    item.step
                  )}
                </div>
                <span
                  className={cn(
                    "text-[9px] font-black text-center max-w-[65px] leading-tight transition-colors duration-300",
                    isCompleted ? "text-slate-800" : "text-slate-400"
                  )}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

