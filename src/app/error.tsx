"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertOctagon, RefreshCw, Home, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FRONTEND_ROUTES } from "@/lib/contants";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to console or error tracker
    console.error("Application error captured:", error);
  }, [error]);

  return (
    <div className="mobile-constraint bg-[#F8FAFC]">
      <div className="flex flex-col min-h-dvh justify-between p-6">
        {/* Top Header */}
        <div className="flex justify-center pt-8">
          <div className="flex items-center gap-2 text-primary font-bold">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-md">
              <Compass className="h-4.5 w-4.5 text-white animate-spin-slow" />
            </div>
            <span className="tracking-tight text-slate-800">TrustLayer</span>
          </div>
        </div>

        {/* Center Content */}
        <div className="flex-1 flex flex-col justify-center items-center py-12">
          <div className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-sm border border-slate-100/80 flex flex-col items-center text-center relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-[-30px] left-[-30px] w-24 h-24 rounded-full bg-red-500/5 blur-xl pointer-events-none" />
            <div className="absolute bottom-[-30px] right-[-30px] w-24 h-24 rounded-full bg-orange-500/5 blur-xl pointer-events-none" />

            {/* Glowing Icon Badge */}
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-red-500/10 rounded-full blur-xl scale-125 animate-pulse" />
              <div className="relative w-18 h-18 rounded-2xl bg-red-50 flex items-center justify-center border border-red-100 shadow-sm">
                <AlertOctagon className="w-9 h-9 text-red-500" strokeWidth={1.8} />
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
              Something went wrong
            </h1>

            {/* Description */}
            <p className="text-slate-500 text-[14px] leading-relaxed mb-6 max-w-[280px]">
              An unexpected error occurred. Rest assured, your funds and active transaction data remain fully protected.
            </p>

            {/* Error Message Details (if present) */}
            {error?.message && (
              <div className="w-full mb-8 bg-slate-50 rounded-xl p-3.5 border border-slate-100 text-left max-h-24 overflow-y-auto">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Error Details
                </span>
                <p className="text-[12px] font-mono text-slate-600 break-words leading-relaxed">
                  {error.message}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="w-full space-y-3 relative z-10">
              <Button
                className="w-full h-12 bg-primary text-white hover:bg-primary/95 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-sm transition-all duration-200 active:scale-[0.98]"
                onClick={() => reset()}
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>

              <Button
                variant="outline"
                className="w-full h-12 border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98]"
                onClick={() => router.push(FRONTEND_ROUTES.DASHBOARD)}
              >
                <Home className="w-4 h-4" />
                Go to Dashboard
              </Button>
            </div>
          </div>
        </div>

        {/* Security Footer */}
        <div className="flex flex-col items-center gap-1 pb-4">
          <div className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            TrustLayer Secure Protection
          </div>
        </div>
      </div>
    </div>
  );
}
