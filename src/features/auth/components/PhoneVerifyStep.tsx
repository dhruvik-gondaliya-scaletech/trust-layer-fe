"use client";

import { Spinner } from "@/components/ui/spinner";
import React, { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { PhoneVerifyInput } from "@/lib/validations/verify";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { Smartphone, Check, ChevronLeft } from "lucide-react";
import { BottomActionBar } from "@/components/ui/bottom-action-bar";
import { toast } from "sonner";
import { CODE_RESEND_TIME_OUT } from "@/lib/contants";
import { cn } from "@/lib/utils";
import { Form, FormField, FormControl, Field, FieldError } from "@/components/ui/field";

interface PhoneVerifyStepProps {
  form: UseFormReturn<PhoneVerifyInput>;
  isPending: boolean;
  onSubmit: (data: PhoneVerifyInput) => void;
  onBack: () => void;
  onResend?: (onSuccess: () => void) => void;
  isResending?: boolean;
  renderTracker?: () => React.ReactNode;
}

export const PhoneVerifyStep: React.FC<PhoneVerifyStepProps> = ({
  form,
  isPending,
  onSubmit,
  onBack,
  onResend,
  isResending = false,
  renderTracker,
}) => {
  const [resendCountdown, setResendCountdown] = useState(CODE_RESEND_TIME_OUT);

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleResend = () => {
    if (resendCountdown === 0 && onResend) {
      onResend(() => {
        setResendCountdown(CODE_RESEND_TIME_OUT);
      });
    }
  };


  return (
    <div className="flex flex-col min-h-full pb-[140px] lg:pb-0 justify-center">
      {/* Top Header */}
      <div className="flex items-center justify-center p-3 relative bg-transparent border-none">
        <button
          onClick={onBack}
          type="button"
          className="absolute left-4 p-2 rounded-full text-foreground hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="text-sm font-bold text-slate-400 tracking-wide uppercase">Step 2 of 3</h1>
      </div>

      <div className="flex-1 px-5 pt-4 max-w-sm mx-auto w-full flex flex-col justify-center">
        {/* Progress Tracker */}
        {renderTracker?.()}

        {/* Hero Section */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 shadow-sm relative">
            <Smartphone className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-black mb-1.5 text-foreground leading-tight tracking-tight">
            Enter Phone Code
          </h1>
          <p className="text-sm text-muted-foreground font-medium">
            We sent a secure code via SMS
          </p>
        </div>

        {/* Premium Card Container */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[28px] p-6 shadow-[0_20px_50px_rgba(8,15,30,0.03)] border border-slate-100">
          <Form {...form}>
            <form id="verify-phone-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
              <FormField control={form.control} name="code" render={({ field }) => (
                <Field className="space-y-3 border-none">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">6-Digit Code</Label>
                  <div className="flex justify-center">
                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        disabled={isPending}
                        {...field}
                      >
                        <InputOTPGroup className="gap-2 flex justify-between w-full">
                          <InputOTPSlot index={0} className="h-16 w-12 text-xl font-extrabold" />
                          <InputOTPSlot index={1} className="h-16 w-12 text-xl font-extrabold" />
                          <InputOTPSlot index={2} className="h-16 w-12 text-xl font-extrabold" />
                          <InputOTPSlot index={3} className="h-16 w-12 text-xl font-extrabold" />
                          <InputOTPSlot index={4} className="h-16 w-12 text-xl font-extrabold" />
                          <InputOTPSlot index={5} className="h-16 w-12 text-xl font-extrabold" />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                  </div>
                  <FieldError className="text-center" />
                </Field>
              )} />
            </form>
          </Form>
        </div>
        <BottomActionBar>
          <div className="flex flex-col lg:flex-row gap-3 w-full">
            <Button form="verify-phone-form" type="submit" disabled={isPending} className="w-full lg:flex-1 h-14 text-[15px] font-bold rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/10 transition-all duration-200 active:scale-[0.98]">
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner className="w-4 h-4" />
                  Verifying...
                </span>
              ) : (
                "Verify"
              )}
            </Button>
            <Button
              variant="outline"
              type="button"
              className="w-full lg:flex-1 h-14 border-slate-200 text-slate-700 hover:bg-slate-50 text-[15px] font-bold rounded-2xl transition-all duration-200 active:scale-[0.98]"
              onClick={handleResend}
              disabled={resendCountdown > 0 || isPending || isResending}
            >
              {isResending ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner className="w-4 h-4" />
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
    </div>
  );
};
