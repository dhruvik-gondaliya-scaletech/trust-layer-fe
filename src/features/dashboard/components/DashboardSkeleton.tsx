import React from "react";

export const DashboardSkeleton: React.FC = () => {
  return (
    <>
      {/* ── MOBILE SKELETON (< md) ─────────────────────────────────────── */}
      <div className="md:hidden w-full min-h-dvh bg-background flex flex-col">
        <div className="w-full max-w-[430px] mx-auto flex flex-col flex-1 animate-pulse select-none">
          <div className="flex flex-col gap-6 pb-12 bg-background">
            {/* Header skeleton */}
            <div className="px-5 pt-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-[52px] h-[52px] rounded-full bg-muted/70 shrink-0" />
                  <div className="flex flex-col gap-2">
                    <div className="h-5 w-36 bg-muted/70 rounded-md" />
                    <div className="h-3 w-28 bg-muted/60 rounded-md" />
                  </div>
                </div>
                <div className="h-11 w-11 rounded-full bg-muted/70" />
              </div>
              <div className="h-10 w-full bg-muted/60 rounded-xl" />
              <div className="flex gap-2">
                <div className="h-6 w-28 bg-muted/50 rounded-full" />
                <div className="h-6 w-28 bg-muted/50 rounded-full" />
              </div>
            </div>

            {/* Wallet */}
            <div className="px-5">
              <div className="h-[168px] w-full bg-muted/70 rounded-[20px]" />
            </div>

            {/* Quick Actions */}
            <div className="px-5 flex flex-col gap-3">
              <div className="h-4 w-44 bg-muted/70 rounded-md" />
              <div className="h-24 bg-muted/60 rounded-2xl border border-border/40" />
            </div>

            {/* Quick Insights */}
            <div className="px-5 flex flex-col gap-3">
              <div className="h-4 w-32 bg-muted/70 rounded-md" />
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((idx) => (
                  <div key={idx} className="h-[96px] bg-muted/60 rounded-[14px] border border-border/40" />
                ))}
              </div>
            </div>

            {/* Recent Deals */}
            <div className="px-5 flex flex-col gap-3">
              <div className="flex justify-between items-center px-1">
                <div className="h-5 w-28 bg-muted/70 rounded-md" />
                <div className="h-3.5 w-14 bg-muted/50 rounded-md" />
              </div>
              <div className="flex flex-col bg-card border border-border/40 rounded-2xl divide-y divide-border/40 overflow-hidden shadow-sm">
                {[1, 2, 3].map((idx) => (
                  <div key={idx} className="flex items-center justify-between p-3.5">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-muted/60" />
                      <div className="flex flex-col gap-1.5">
                        <div className="h-4 w-32 bg-muted/70 rounded-md" />
                        <div className="h-3 w-20 bg-muted/50 rounded-md" />
                        <div className="h-3 w-24 bg-muted/50 rounded-md" />
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <div className="h-4 w-14 bg-muted/70 rounded-md" />
                      <div className="h-3 w-4 bg-muted/50 rounded-md" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── DESKTOP SKELETON (≥ md) ────────────────────────────────────── */}
      <div className="hidden md:block w-full bg-background min-h-[calc(100vh-4rem)] animate-pulse select-none">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header row */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-[52px] h-[52px] rounded-full bg-muted/70 shrink-0" />
            <div className="flex flex-col gap-2">
              <div className="h-6 w-48 bg-muted/70 rounded-md" />
              <div className="h-4 w-36 bg-muted/60 rounded-md" />
            </div>
          </div>

          {/* Two-column grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-6 xl:gap-8 items-start">
            {/* Left */}
            <div className="flex flex-col gap-6">
              <div className="h-[168px] w-full bg-muted/70 rounded-[20px]" />
              <div className="flex flex-col gap-3">
                <div className="h-4 w-32 bg-muted/70 rounded-md" />
                <div className="grid grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map((idx) => (
                    <div key={idx} className="h-[96px] bg-muted/60 rounded-[14px] border border-border/40" />
                  ))}
                </div>
              </div>
              <div className="h-12 w-full bg-muted/60 rounded-2xl" />
            </div>

            {/* Right */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <div className="h-4 w-44 bg-muted/70 rounded-md" />
                <div className="h-24 bg-muted/60 rounded-2xl border border-border/40" />
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <div className="h-5 w-28 bg-muted/70 rounded-md" />
                  <div className="h-3.5 w-14 bg-muted/50 rounded-md" />
                </div>
                <div className="flex flex-col bg-card border border-border/40 rounded-2xl divide-y divide-border/40 overflow-hidden shadow-sm">
                  {[1, 2, 3].map((idx) => (
                    <div key={idx} className="flex items-center justify-between p-3.5">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-muted/60" />
                        <div className="flex flex-col gap-1.5">
                          <div className="h-4 w-40 bg-muted/70 rounded-md" />
                          <div className="h-3 w-24 bg-muted/50 rounded-md" />
                          <div className="h-3 w-28 bg-muted/50 rounded-md" />
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <div className="h-4 w-16 bg-muted/70 rounded-md" />
                        <div className="h-3 w-4 bg-muted/50 rounded-md" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
