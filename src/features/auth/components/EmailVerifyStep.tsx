"use client";

import { Spinner } from "@/components/ui/spinner";
import React, { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { EmailVerifyInput } from "@/lib/validations/verify";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Mail, Shield, ChevronLeft, Check } from "lucide-react";
import { BottomActionBar } from "@/components/ui/bottom-action-bar";
import { toast } from "sonner";
import { CODE_RESEND_TIME_OUT } from "@/lib/contants";
import { cn } from "@/lib/utils";

import { Form, FormField, FormControl, Field, FieldLabel, FieldError } from "@/components/ui/field";

interface EmailVerifyStepProps {
  form: UseFormReturn<EmailVerifyInput>;
  isPending: boolean;
  onSubmit: (data: EmailVerifyInput) => void;
  onBack: () => void;
  onResend?: (onSuccess: () => void) => void;
  isResending?: boolean;
  emailVerified?: boolean;
  onContinue?: () => void;
  renderTracker?: () => React.ReactNode;
}

export const EmailVerifyStep: React.FC<EmailVerifyStepProps> = ({
  form,
  isPending,
  onSubmit,
  onBack,
  onResend,
  isResending = false,
  emailVerified = false,
  onContinue,
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
        setResendCountdown(60);
      });
    }
  };

  if (emailVerified) {
    return (
      <div className="flex flex-col min-h-full pb-[120px] lg:pb-0 justify-center">
        {/* Top Header */}
        <div className="flex items-center justify-center p-3 relative bg-transparent border-none">
          <button
            onClick={onBack}
            type="button"
            className="absolute left-4 p-2 rounded-full text-foreground hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="text-sm font-bold text-slate-400 tracking-wide uppercase">Step 1 of 3</h1>
        </div>

        <div className="flex-1 px-5 pt-4 max-w-sm mx-auto w-full flex flex-col justify-center">
          {/* Progress Tracker */}
          {renderTracker?.()}

          {/* Hero Section */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 shadow-sm relative">
              <Check className="w-6 h-6 text-emerald-600" strokeWidth={3} />
            </div>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-black mb-1.5 text-foreground leading-tight tracking-tight">
              Email Verified
            </h1>
            <p className="text-sm text-muted-foreground font-medium">
              Your email address is already verified
            </p>
          </div>

          {/* Premium Card Container */}
          <div className="text-center space-y-6">
            <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
              <Check className="w-7 h-7 text-emerald-600" strokeWidth={3} />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-foreground">Verified Successfully</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your email is active and verified. Please continue to proceed to the next step.
              </p>
            </div>
          </div>
          <BottomActionBar>
            <Button onClick={onContinue} className="w-full h-14 text-[15px] font-bold rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/10 transition-all duration-200 active:scale-[0.98]">
              Continue
            </Button>
          </BottomActionBar>
        </div>
      </div>
    );
  }

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
        <h1 className="text-sm font-bold text-slate-400 tracking-wide uppercase">Step 1 of 3</h1>
      </div>

      <div className="flex-1 px-5 pt-4 max-w-sm mx-auto w-full flex flex-col justify-center">
        {/* Progress Tracker */}
        {renderTracker?.()}

        {/* Hero Section */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 shadow-sm relative animate-fade-in">
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-black mb-1.5 text-foreground leading-tight tracking-tight">
            Verify Your Email
          </h1>
          <p className="text-sm text-muted-foreground font-medium">
            We sent a secure code to your inbox
          </p>
        </div>

        {/* Premium Card Container */}
        <div>
          <Form {...form}>
            <form id="verify-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
              <FormField control={form.control} name="code" render={({ field }) => (
                <Field className="space-y-3 border-none">
                  <FieldLabel className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">6-Digit Code</FieldLabel>
                  <div className="flex justify-center">
                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        disabled={isPending}
                        autoFocus
                        {...field}
                      >
                        <InputOTPGroup className="gap-2 flex justify-between w-full">
                          <InputOTPSlot index={0} className="h-16 w-12 text-xl font-extrabold border-blue-500 focus-within:border-blue-600" />
                          <InputOTPSlot index={1} className="h-16 w-12 text-xl font-extrabold border-blue-500 focus-within:border-blue-600" />
                          <InputOTPSlot index={2} className="h-16 w-12 text-xl font-extrabold border-blue-500 focus-within:border-blue-600" />
                          <InputOTPSlot index={3} className="h-16 w-12 text-xl font-extrabold border-blue-500 focus-within:border-blue-600" />
                          <InputOTPSlot index={4} className="h-16 w-12 text-xl font-extrabold border-blue-500 focus-within:border-blue-600" />
                          <InputOTPSlot index={5} className="h-16 w-12 text-xl font-extrabold border-blue-500 focus-within:border-blue-600" />
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
            <Button form="verify-form" type="submit" disabled={isPending} className="w-full lg:flex-1 h-14 text-[15px] font-bold rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/10 transition-all duration-200 active:scale-[0.98]">
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner className="w-4 h-4" />
                  Verifying...
                </span>
              ) : (
                "Continue"
              )}
            </Button>
            <Button
              variant="outline"
              type="button"
              className="w-full lg:flex-1 h-14 border-blue-500 text-blue-600 hover:bg-blue-50 text-[15px] font-bold rounded-2xl transition-all duration-200 active:scale-[0.98]"
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
