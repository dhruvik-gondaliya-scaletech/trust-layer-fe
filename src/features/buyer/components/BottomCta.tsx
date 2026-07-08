"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BottomCtaProps {
  isLoggedIn: boolean;
  totalDue: number;
  onFundEscrow: () => void;
  onDeclineClick: () => void;
  onLogin: () => void;
}

export function BottomCta({ isLoggedIn, totalDue, onFundEscrow, onDeclineClick, onLogin }: BottomCtaProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-2xl p-4 pb-6 bg-white/95 backdrop-blur-xl border-t border-gray-200 z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
      <div className="flex flex-col gap-3">
        <Button
          className="w-full h-[56px] text-[16px] font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white cursor-pointer"
          onClick={() => {
            if (isLoggedIn) {
              onFundEscrow();
            } else {
              onLogin();
            }
          }}
        >
          <Check className="w-5 h-5" /> {isLoggedIn ? "Continue to Payment" : "Approve Deal"} • ${totalDue.toLocaleString("en-US")}
        </Button>
        <Button
          variant="outline"
          className="w-full h-[48px] text-[14px] font-bold rounded-2xl flex items-center justify-center border-red-100 text-red-600 bg-white hover:bg-red-50 hover:text-red-700 cursor-pointer"
          onClick={() => {
            if (isLoggedIn) {
              onDeclineClick();
            } else {
              onLogin();
            }
          }}
        >
          Decline Deal
        </Button>
      </div>
    </div>
  );
}
