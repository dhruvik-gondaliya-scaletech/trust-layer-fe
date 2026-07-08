"use client";

import { Shield, ChevronLeft } from "lucide-react";

export function TopBar() {
  return (
    <div className="w-full flex items-center justify-between p-4 bg-white sticky top-0 z-40 shadow-sm border-b border-gray-100 shrink-0 max-w-2xl sm:rounded-b-[20px]">
      <div className="flex items-center gap-2">
        <button
          onClick={() => window.history.back()}
          className="p-1 -ml-1 rounded-full text-foreground hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          <span className="font-bold text-[15px]">TrustLayer</span>
        </div>
      </div>
    </div>
  );
}
