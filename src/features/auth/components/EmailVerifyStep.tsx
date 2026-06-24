"use client";

import React, { useState, useEffect } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { EmailVerifyInput } from "@/lib/validations/verify";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Mail, Shield, Loader2, ChevronLeft } from "lucide-react";
import { BottomActionBar } from "@/components/ui/bottom-action-bar";
import { toast } from "sonner";

interface EmailVerifyStepProps {
  register: UseFormRegister<EmailVerifyInput>;
  errors: FieldErrors<EmailVerifyInput>;
  isPending: boolean;
  onSubmit: (data: EmailVerifyInput) => void;
  handleSubmit: any;
  setValue: any;
  onBack: () => void;
  defaultCode?: string;
}

export const EmailVerifyStep: React.FC<EmailVerifyStepProps> = ({
  register,
  errors,
  isPending,
  onSubmit,
  handleSubmit,
  setValue,
  onBack,
  defaultCode = "",
}) => {
  const [code, setCode] = useState(defaultCode);
  const [resendCountdown, setResendCountdown] = useState(0);

  useEffect(() => {
    if (defaultCode) {
      setValue("code", defaultCode, { shouldValidate: true });
    }
  }, [defaultCode, setValue]);

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleChange = (val: string) => {
    setCode(val);
    setValue("code", val, { shouldValidate: true });
  };

  const handleResend = () => {
    if (resendCountdown === 0) {
      setResendCountdown(30);
      toast.success("Verification code resent to your inbox!");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background pb-[160px]">
      {/* Top Header */}
      <div className="flex items-center justify-center p-4 relative bg-background border-none">
        <button
          onClick={onBack}
          type="button"
          className="absolute left-4 p-2 -ml-2 rounded-full text-foreground hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h1 className="text-[16px] font-semibold text-foreground">Step 1 of 3</h1>
      </div>

      <div className="flex-1 px-5 pt-2 max-w-sm mx-auto w-full">
        {/* Progress Tracker */}
        <div className="flex items-center justify-center gap-2 mb-8 select-none">
          <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-[13px] font-bold border border-blue-100">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" /> Email
          </div>
          <div className="h-px w-4 bg-gray-200" />
          <div className="flex items-center gap-2 text-gray-400 px-4 py-2 rounded-full text-[13px] font-bold border border-gray-200">
            Phone
          </div>
          <div className="h-px w-4 bg-gray-200" />
          <div className="flex items-center gap-2 text-gray-400 px-4 py-2 rounded-full text-[13px] font-bold border border-gray-200">
            Profile
          </div>
        </div>

        {/* Hero Section */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-full flex items-center justify-center border-4 border-white shadow-sm relative">
            <div className="absolute inset-0 rounded-full border border-blue-100/50" />
            <Mail className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-[28px] font-extrabold mb-2 text-foreground leading-tight tracking-tight">
            Verify Your Email
          </h1>
          <p className="text-[15px] text-muted-foreground font-medium">
            We sent a secure code to your inbox
          </p>
        </div>

        {/* Premium Card Container */}
        <div className="bg-white rounded-[24px] p-5 shadow-xl shadow-blue-900/5 border border-gray-100">
          <form id="verify-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <div className="space-y-3">
              <label className="text-[13px] font-bold text-foreground ml-1">6-Digit Code</label>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={code}
                  onChange={handleChange}
                  disabled={isPending}
                >
                  <InputOTPGroup className="gap-2 flex justify-between w-full">
                    <InputOTPSlot index={0} className={`h-14 w-10 text-center text-lg font-bold bg-gray-50/50 border-gray-200 focus-visible:ring-primary/20 ${errors.code ? "border-destructive" : ""}`} />
                    <InputOTPSlot index={1} className={`h-14 w-10 text-center text-lg font-bold bg-gray-50/50 border-gray-200 focus-visible:ring-primary/20 ${errors.code ? "border-destructive" : ""}`} />
                    <InputOTPSlot index={2} className={`h-14 w-10 text-center text-lg font-bold bg-gray-50/50 border-gray-200 focus-visible:ring-primary/20 ${errors.code ? "border-destructive" : ""}`} />
                    <InputOTPSlot index={3} className={`h-14 w-10 text-center text-lg font-bold bg-gray-50/50 border-gray-200 focus-visible:ring-primary/20 ${errors.code ? "border-destructive" : ""}`} />
                    <InputOTPSlot index={4} className={`h-14 w-10 text-center text-lg font-bold bg-gray-50/50 border-gray-200 focus-visible:ring-primary/20 ${errors.code ? "border-destructive" : ""}`} />
                    <InputOTPSlot index={5} className={`h-14 w-10 text-center text-lg font-bold bg-gray-50/50 border-gray-200 focus-visible:ring-primary/20 ${errors.code ? "border-destructive" : ""}`} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              {errors.code && (
                <p className="text-red-500 text-[12px] font-medium text-center">{errors.code.message}</p>
              )}
              {/* Hidden field matching the react-hook-form name */}
              <input type="hidden" {...register("code")} />
            </div>

            <div className="bg-blue-50/50 border border-blue-100/50 rounded-2xl p-4 flex gap-3.5">
              <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="space-y-1 text-left">
                <p className="text-[13px] font-bold text-blue-900">Why verify your email?</p>
                <p className="text-[12px] text-blue-800/70 leading-relaxed font-medium">
                  We need to confirm your email so we can send important escrow and shipping updates securely.
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>

      <BottomActionBar>
        <div className="space-y-3 w-full">
          <Button form="verify-form" type="submit" disabled={isPending} className="w-full h-14 text-[16px]">
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Verifying...
              </span>
            ) : (
              "Continue"
            )}
          </Button>
          <Button
            variant="outline"
            type="button"
            className="w-full h-14 border-border text-foreground hover:bg-gray-50 text-[16px]"
            onClick={handleResend}
            disabled={resendCountdown > 0 || isPending}
          >
            {resendCountdown > 0 ? `Code sent! (${resendCountdown}s)` : "Resend Code"}
          </Button>
        </div>
      </BottomActionBar>
    </div>
  );
};
