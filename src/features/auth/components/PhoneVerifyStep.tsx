"use client";

import React, { useState, useEffect } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { PhoneVerifyInput } from "@/lib/validations/verify";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { Smartphone, Check, Loader2, ChevronLeft } from "lucide-react";
import { BottomActionBar } from "@/components/ui/bottom-action-bar";
import { toast } from "sonner";

interface PhoneVerifyStepProps {
  register: UseFormRegister<PhoneVerifyInput>;
  errors: FieldErrors<PhoneVerifyInput>;
  isPending: boolean;
  onSubmit: (data: PhoneVerifyInput) => void;
  handleSubmit: any;
  setValue: any;
  onBack: () => void;
  defaultCode?: string;
  onResend?: (onSuccess: () => void) => void;
  isResending?: boolean;
  renderTracker?: () => React.ReactNode;
}

export const PhoneVerifyStep: React.FC<PhoneVerifyStepProps> = ({
  register,
  errors,
  isPending,
  onSubmit,
  handleSubmit,
  setValue,
  onBack,
  defaultCode = "",
  onResend,
  isResending = false,
  renderTracker,
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
    if (resendCountdown === 0 && onResend) {
      onResend(() => {
        setResendCountdown(30);
      });
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
        <h1 className="text-[16px] font-semibold text-foreground">Step 2 of 3</h1>
      </div>

      <div className="flex-1 px-5 pt-2 max-w-sm mx-auto w-full">
        {/* Progress Tracker */}
        {renderTracker?.()}

        {/* Hero Section */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-full flex items-center justify-center border-4 border-white shadow-sm relative">
            <div className="absolute inset-0 rounded-full border border-blue-100/50" />
            <Smartphone className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-[28px] font-extrabold mb-2 text-foreground leading-tight tracking-tight">
            Enter Phone Code
          </h1>
          <p className="text-[15px] text-muted-foreground font-medium">
            We sent a secure code via SMS
          </p>
        </div>

        {/* Premium Card Container */}
        <div className="bg-white rounded-[24px] p-5 shadow-xl shadow-blue-900/5 border border-gray-100">
          <form id="verify-phone-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <div className="space-y-3">
              <Label className="text-[13px] font-bold text-foreground ml-1">6-Digit Code</Label>
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
              <input type="hidden" {...register("code")} />
            </div>
          </form>
        </div>
      </div>

      <BottomActionBar>
        <div className="space-y-3 w-full">
          <Button form="verify-phone-form" type="submit" disabled={isPending} className="w-full h-14 text-[16px] font-bold">
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Verifying...
              </span>
            ) : (
              "Verify"
            )}
          </Button>
          <Button
            variant="outline"
            type="button"
            className="w-full h-14 border-border text-foreground hover:bg-gray-50 text-[16px] font-bold"
            onClick={handleResend}
            disabled={resendCountdown > 0 || isPending || isResending}
          >
            {isResending ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Resending...
              </span>
            ) : resendCountdown > 0 ? (
              `Code sent! (${resendCountdown}s)`
            ) : (
              "Resend Code"
            )}
          </Button>
        </div>
      </BottomActionBar>
    </div>
  );
};
