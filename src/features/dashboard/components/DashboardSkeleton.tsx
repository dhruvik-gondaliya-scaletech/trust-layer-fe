import React from "react";

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="w-full flex flex-col gap-8 pb-12 animate-pulse select-none">
      {/* Header skeleton */}
      <div className="px-6 pt-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-muted" />
            <div className="flex flex-col gap-2">
              <div className="h-5 w-32 bg-muted rounded-md" />
              <div className="h-3.5 w-44 bg-muted rounded-md" />
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-muted" />
        </div>
        <div className="flex gap-2">
          <div className="h-5 w-24 bg-muted rounded-full" />
          <div className="h-5 w-24 bg-muted rounded-full" />
        </div>
      </div>

      {/* Quick Actions skeleton */}
      <div className="px-6 flex flex-col gap-3">
        <div className="h-4 w-36 bg-muted rounded-md" />
        <div className="h-20 bg-muted rounded-2xl border border-border/40" />
      </div>

      {/* Recent Deals skeleton */}
      <div className="px-6 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div className="h-4.5 w-24 bg-muted rounded-md" />
          <div className="h-3 w-12 bg-muted rounded-md" />
        </div>
        <div className="flex flex-col bg-card border border-border/40 rounded-2xl divide-y divide-border/40 overflow-hidden">
          {[1, 2, 3].map((idx) => (
            <div key={idx} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-muted" />
                <div className="flex flex-col gap-1.5">
                  <div className="h-4 w-36 bg-muted rounded-md" />
                  <div className="h-3 w-20 bg-muted rounded-md" />
                  <div className="h-3 w-28 bg-muted rounded-md" />
                </div>
              </div>
              <div className="h-4 w-12 bg-muted rounded-md" />
            </div>
          ))}
        </div>
      </div>

      {/* Quick Insights skeleton */}
      <div className="px-6 flex flex-col gap-3">
        <div className="h-4.5 w-28 bg-muted rounded-md" />
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((idx) => (
            <div key={idx} className="h-20 bg-muted rounded-2xl border border-border/40" />
          ))}
        </div>
      </div>

      {/* Wallet skeleton */}
      <div className="px-6 flex flex-col gap-3">
        <div className="h-4.5 w-16 bg-muted rounded-md" />
        <div className="h-44 bg-muted rounded-3xl" />
      </div>
    </div>
  );
};
