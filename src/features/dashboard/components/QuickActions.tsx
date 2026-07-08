"use client";

import React from "react";
import { AlertCircle, CreditCard, Truck, CheckCircle2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ActionItem {
  id: string;
  title: string;
  description: string;
  actionLabel: string;
  type: string;
}

interface QuickActionsProps {
  actions: ActionItem[];
  role: "seller" | "buyer";
  onActionClick?: (action: ActionItem) => void;
}

function getStatusLabel(type: string, role: "seller" | "buyer"): string {
  if (role === "seller") {
    switch (type) {
      case "upload_tracking":
        return "PAYMENT RECEIVED";
      default:
        return "ACTION REQUIRED";
    }
  } else {
    switch (type) {
      case "fund_escrow":
        return "AWAITING PAYMENT";
      case "release_funds":
        return "SHIPPED";
      default:
        return "ACTION REQUIRED";
    }
  }
}

const ACTION_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  fund_escrow: CreditCard,
  upload_tracking: Truck,
  release_funds: CheckCircle2,
};

export const QuickActions: React.FC<QuickActionsProps> = ({
  actions,
  role,
  onActionClick,
}) => {
  if (!actions || actions.length === 0) return null;

  return (
    <section className="flex flex-col gap-3 select-none" aria-label="Quick Actions Required">
      <h2 className="text-[16px] font-bold text-foreground flex items-center gap-1.5">
        <AlertCircle className="w-4 h-4 text-primary" />
        <span className="text-foreground">Quick Actions Required</span>
      </h2>

      <div className="flex flex-col gap-3">
        {actions.map((action) => {
          const statusLabel = getStatusLabel(action.type, role);
          const IconComponent = ACTION_ICONS[action.type] ?? Package;

          return (
            <Card
              key={action.id}
              className="border border-border bg-card shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow active:scale-[0.99]"
              onClick={() => onActionClick?.(action)}
            >
              <div className="py-3.5 px-4 flex flex-col gap-3">
                {/* Deal identity row */}
                <div className="flex items-start gap-3 min-w-0">
                  {/* Icon thumbnail */}
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-primary/30 bg-primary/10 overflow-hidden text-primary">
                    <IconComponent className="w-6 h-6" />
                  </div>

                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className="font-bold text-[16px] text-foreground leading-tight truncate">
                      {action.title}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      <span className="text-[12px] font-medium text-muted-foreground">
                        #{action.id}
                      </span>
                      <span className="text-muted-foreground text-[10px]">•</span>
                      <div className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide shrink-0 bg-primary/10 text-primary">
                        {statusLabel}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description + CTA row */}
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[13px] font-medium text-muted-foreground leading-snug flex-1 truncate">
                    {action.description}
                  </p>
                  <Button
                    className="w-[110px] shrink-0 text-primary-foreground font-semibold text-[13px] h-[36px] rounded-[10px] shadow-sm bg-primary hover:bg-primary/90"
                    onClick={(e) => {
                      e.stopPropagation();
                      onActionClick?.(action);
                    }}
                  >
                    {action.actionLabel}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
