import React from "react";

export const NotificationsSkeleton: React.FC = () => {
  return (
    <div className="w-full min-h-dvh bg-[#F8FAFC] flex flex-col animate-pulse select-none">
      <div className="bg-card sticky top-0 z-20 shadow-sm border-b border-border/40">
        <div className="flex items-center justify-between p-4 max-w-2xl mx-auto w-full">
          <div className="h-6 w-6 rounded-full bg-muted/70" />
          <div className="h-5 w-32 bg-muted/70 rounded-md" />
          <div className="w-6" />
        </div>
      </div>

      <div className="flex-1 px-4 pt-4 pb-12 max-w-2xl mx-auto w-full space-y-6">
        {[1, 2].map((group) => (
          <div key={group} className="space-y-3">
            <div className="h-4 w-24 bg-muted/70 rounded-md" />
            <div className="flex flex-col bg-card border border-border/40 rounded-xl divide-y divide-border/40 overflow-hidden shadow-sm">
              {[1, 2, 3].map((idx) => (
                <div key={idx} className="flex items-start gap-3 p-4">
                  <div className="w-10 h-10 rounded-full bg-muted/60 shrink-0" />
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="h-4 w-40 bg-muted/70 rounded-md" />
                    <div className="h-3 w-full bg-muted/50 rounded-md" />
                    <div className="h-3 w-20 bg-muted/40 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
