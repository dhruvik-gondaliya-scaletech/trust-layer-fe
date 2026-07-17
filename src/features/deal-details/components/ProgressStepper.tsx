"use client";

import { Check, Activity, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { getProgressSteps, type StepState } from "../utils/dealStatusMeta";
import type { DealStatus } from "@/types/api.types";
import { useRole } from "@/providers/role-provider";
import { Card } from "@/components/ui/card";

interface ProgressStepperProps {
  status: DealStatus;
}

export function ProgressStepper({ status }: ProgressStepperProps) {
  const steps = getProgressSteps(status);
  const { role } = useRole();
  const isSeller = role === "seller";

  const theme = {
    text: isSeller ? "text-blue-600" : "text-[#10B981]",
    bg: isSeller ? "bg-blue-600" : "bg-[#10B981]",
  };

  const filledCount = steps.filter(s => s.state === "done" || s.state === "current").length;

  // 5 steps total -> 4 segments (or dynamically steps.length - 1)
  const progressPercentage = Math.max(0, (filledCount - 1) / (steps.length - 1)) * 100;
  const stepWidth = `${100 / steps.length}%`;

  return (
    <Card className="p-5 border-gray-100 shadow-sm rounded-2xl w-full bg-white">
      <h3 className="font-bold text-[16px] mb-5 text-gray-900 flex items-center gap-2">
        <Activity className={cn("w-4 h-4", theme.text)} /> Progress
      </h3>

      <div className="flex justify-between items-start relative">
        {/* Connecting line */}
        <div className="absolute left-[10%] right-[10%] top-4 -translate-y-1/2 h-[2px] bg-gray-100 z-0">
          <div
            className={cn("h-full transition-all duration-500", theme.bg)}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {steps.map((step, index) => {
          const isDone = step.state === "done";
          const isCurrent = step.state === "current";
          const halted = step.state === "halted";

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center gap-2 group" style={{ width: stepWidth }}>
              <div className={cn(
                "w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-[12px] font-bold leading-none transition-colors shadow-sm",
                halted
                  ? "bg-destructive text-white border-2 border-white ring-2 ring-destructive/20"
                  : isDone
                    ? cn("border-2 border-white text-white", theme.bg)
                    : isCurrent
                      ? cn("border-2 bg-white ring-2", isSeller ? "border-blue-600 text-blue-600 ring-blue-600/10" : "border-[#10B981] text-[#10B981] ring-[#10B981]/10")
                      : "bg-gray-100 text-gray-400 border-2 border-white"
              )}>
                {halted ? (
                  <AlertTriangle className="w-4 h-4" />
                ) : isDone ? (
                  <Check className="w-4 h-4" strokeWidth={2.5} />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <div className="text-center w-full px-0.5">
                <p className={cn(
                  "text-[10px] font-bold leading-tight mx-auto",
                  halted
                    ? "text-destructive"
                    : isCurrent
                      ? (isSeller ? "text-blue-600" : "text-[#10B981]")
                      : isDone
                        ? "text-gray-900"
                        : "text-gray-400"
                )}>
                  {step.label}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  );
}
