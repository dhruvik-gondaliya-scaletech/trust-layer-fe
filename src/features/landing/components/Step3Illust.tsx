"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface TimelineStep {
  id: number;
  title: string;
  isCompleted: boolean;
}

const timelineSteps: TimelineStep[] = [
  { id: 1, title: "Create Deal", isCompleted: true },
  { id: 2, title: "Buyer Reviews", isCompleted: true },
  { id: 3, title: "Fund Deal", isCompleted: true },
  { id: 4, title: "Ship Item", isCompleted: false },
  { id: 5, title: "Confirm Delivery & Reviews", isCompleted: false },
];

export const Step3Illust: React.FC = () => {
  return (
    <div className="w-full aspect-[4/3] rounded-[2rem] border border-border/80 bg-card p-6 flex flex-col justify-center shadow-xs select-none relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/[0.01] to-transparent pointer-events-none" />

      <div className="relative flex flex-col gap-5 pl-7">
        {/* Timeline Connecting Line */}
        <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-border dark:bg-border/40 z-0">
          {/* Active portion of the connecting line */}
          <div className="w-full h-1/2 bg-primary rounded-full" />
        </div>

        {timelineSteps.map((step) => {
          return (
            <div key={step.id} className="relative flex items-center gap-3.5 z-10">
              {/* Indicator Dot */}
              <div
                className={cn(
                  "absolute -left-[27px] w-[14px] h-[14px] rounded-full border-2 flex items-center justify-center transition-all duration-300",
                  step.isCompleted
                    ? "bg-primary border-primary"
                    : "bg-card border-muted-foreground/30"
                )}
              />
              <span
                className={cn(
                  "text-[13px] font-bold transition-colors duration-300",
                  step.isCompleted ? "text-foreground" : "text-muted-foreground/60"
                )}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
