"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle2, Circle } from "lucide-react";

interface EmailSuccessStepProps {
  email: string;
  onContinue: () => void;
}

export const EmailSuccessStep: React.FC<EmailSuccessStepProps> = ({
  email,
  onContinue,
}) => {
  return (
    <div className="flex-1 flex flex-col justify-between relative min-h-screen sm:min-h-[840px] px-6 pb-8 pt-16">
      {/* Icon and Main Body */}
      <div className="flex-1 flex flex-col justify-center gap-8">
        {/* Verification Icon Box */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-emerald-500/5 flex items-center justify-center border border-emerald-500/15">
              <Mail className="w-9 h-9 text-emerald-500 stroke-[1.5]" />
            </div>
            <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-sm">
              <CheckCircle2 className="w-4.5 h-4.5 text-white stroke-[2.5]" />
            </div>
          </div>

          <div className="text-center flex flex-col gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground leading-tight tracking-tight">
              Email Verified
            </h1>
            <span className="text-sm font-bold text-primary">{email}</span>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-[320px] mx-auto px-2">
              Your email has been successfully verified and can now be used for account security and transaction notifications.
            </p>
          </div>
        </div>

        {/* Checklist Card */}
        <div className="w-full max-w-sm mx-auto p-5 bg-card border border-border/40 rounded-[1.5rem] shadow-sm flex flex-col gap-4 text-left">
          {/* Email Verified Item */}
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 stroke-[2.5] shrink-0" />
            <span className="text-xs font-bold text-emerald-500">
              Email Verified
            </span>
          </div>

          {/* Phone Verification Item */}
          <div className="flex items-center gap-3">
            <Circle className="w-5 h-5 text-muted-foreground/60 stroke-[2] shrink-0" />
            <span className="text-xs font-semibold text-muted-foreground/80">
              Phone Verification
            </span>
          </div>

          {/* Profile Setup Item */}
          <div className="flex items-center gap-3">
            <Circle className="w-5 h-5 text-muted-foreground/60 stroke-[2] shrink-0" />
            <span className="text-xs font-semibold text-muted-foreground/80">
              Profile Setup
            </span>
          </div>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="mt-8">
        <Button
          onClick={onContinue}
          size="lg"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/95 shadow-md shadow-primary/10 rounded-2xl h-12 text-sm font-bold active:scale-[0.98] transition-all"
        >
          Continue to Phone Verification
        </Button>
      </div>
    </div>
  );
};
