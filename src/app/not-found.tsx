"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, ArrowLeft, Home, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FRONTEND_ROUTES } from "@/lib/contants";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-dvh w-full bg-[#F8FAFC] flex flex-col justify-between p-6 relative overflow-hidden">
      {/* Ambient Background Lights for Tablet & Desktop */}
      <div className="hidden sm:block absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-primary/10 to-blue-500/0 blur-[80px] pointer-events-none" />
      <div className="hidden sm:block absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-tl from-indigo-500/10 to-purple-500/0 blur-[80px] pointer-events-none" />

      {/* Top Spacer or Header */}
      <div className="flex justify-center pt-8 z-10">
        <div className="flex items-center gap-2 text-primary font-bold">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-md">
            <Compass className="h-4.5 w-4.5 text-white animate-spin-slow" />
          </div>
          <span className="tracking-tight text-slate-800">TrustLayer</span>
        </div>
      </div>

      {/* Center Content */}
      <div className="flex-1 flex flex-col justify-center items-center py-12 z-10">
        <div className="w-full max-w-sm sm:max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-100/80 flex flex-col items-center text-center relative overflow-hidden transition-all duration-300">
          {/* Ambient Background Glow */}
          <div className="absolute top-[-30px] left-[-30px] w-24 h-24 rounded-full bg-blue-500/5 blur-xl pointer-events-none" />
          <div className="absolute bottom-[-30px] right-[-30px] w-24 h-24 rounded-full bg-indigo-500/5 blur-xl pointer-events-none" />

          {/* Glowing Icon Badge */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl scale-125" />
            <div className="relative w-18 h-18 rounded-2xl bg-secondary flex items-center justify-center border border-primary/15 shadow-sm">
              <ShieldAlert className="w-9 h-9 text-primary" strokeWidth={1.8} />
            </div>
          </div>

          {/* Huge 404 Indicator */}
          <span className="text-[64px] sm:text-[76px] font-black tracking-tight leading-none bg-gradient-to-b from-primary to-blue-700 bg-clip-text text-transparent select-none filter drop-shadow-sm transition-all duration-300">
            404
          </span>

          {/* Title */}
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-2 mb-2 transition-all duration-300">
            Way Off Course
          </h1>

          {/* Description */}
          <p className="text-slate-500 text-[14px] sm:text-[15px] leading-relaxed mb-8 max-w-[280px] sm:max-w-[320px] transition-all duration-300">
            This link might be broken, or the page was moved. Don't worry, your funds and deals are always secure.
          </p>

          {/* Actions */}
          <div className="w-full space-y-3 relative z-10">
            <Button
              className="w-full h-12 bg-primary text-white hover:bg-primary/95 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-sm transition-all duration-200 active:scale-[0.98]"
              onClick={() => router.push(FRONTEND_ROUTES.DASHBOARD)}
            >
              <Home className="w-4 h-4" />
              Go to Dashboard
            </Button>

            <Button
              variant="outline"
              className="w-full h-12 border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98]"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
          </div>
        </div>
      </div>

      {/* Security Footer */}
      <div className="flex flex-col items-center gap-1 pb-4 z-10">
        <div className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
          Secure Connection Active
        </div>
      </div>
    </div>
  );
}
