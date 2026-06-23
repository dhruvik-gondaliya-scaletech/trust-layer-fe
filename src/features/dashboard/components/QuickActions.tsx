import React from "react";
import { AlertCircle, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActionItem {
  id: string;
  title: string;
  description: string;
  actionLabel: string;
  type: string;
}

interface QuickActionsProps {
  actions: ActionItem[];
  onActionClick?: (action: ActionItem) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  actions,
  onActionClick,
}) => {
  if (actions.length === 0) return null;

  return (
    <section className="w-full px-6 flex flex-col gap-3 select-none">
      <div className="flex items-center gap-2 text-foreground font-bold text-sm tracking-tight">
        <AlertCircle className="w-4.5 h-4.5 text-amber-500 fill-amber-500/10" />
        <h2>Quick Actions Required</h2>
      </div>

      <div className="flex flex-col gap-3">
        {actions.map((action) => (
          <div
            key={action.id}
            className="flex items-center justify-between p-4 bg-card border border-border/60 rounded-2xl shadow-sm hover:border-amber-500/30 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              {/* Action Category Icon */}
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Upload className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-sm text-foreground">
                  {action.title}
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  {action.description}
                </span>
              </div>
            </div>

            <Button
              onClick={() => onActionClick?.(action)}
              size="sm"
              className="bg-amber-500 text-white hover:bg-amber-600 rounded-full px-4 h-8 text-xs font-bold shadow-sm shadow-amber-500/10 active:scale-95 transition-all"
            >
              {action.actionLabel}
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
};
