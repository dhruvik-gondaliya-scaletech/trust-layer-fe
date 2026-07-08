"use client";

import { ChevronLeft, Shield, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WizardHeaderProps {
  title?: string;
  onBack: () => void;
  /** If provided, shows an X button that triggers the exit modal */
  onRequestExit?: () => void;
}

export function WizardHeader({ title, onBack, onRequestExit }: WizardHeaderProps) {
  return (
    <div className="bg-background border-b border-slate-100 sticky top-0 z-20">
      <div className="max-w-2xl mx-auto flex items-center justify-between px-4 py-3 w-full">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-full text-foreground hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        {/* Secure Checkout Badge */}
        <div className="flex items-center gap-1.5 text-primary bg-primary/10 px-3 py-1 rounded-full">
          <Shield className="w-3.5 h-3.5 fill-primary text-primary" />
          <span className="text-[12px] font-bold">Secure Checkout</span>
        </div>

        {/* Right side: X button or spacer */}
        {onRequestExit ? (
          <button
            onClick={onRequestExit}
            className="p-2 -mr-2 rounded-full text-foreground hover:bg-gray-100 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        ) : (
          <div className="w-10" />
        )}
      </div>
    </div>
  );
}
