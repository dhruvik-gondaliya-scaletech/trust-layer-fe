"use client";

import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { PhoneInputInput } from "@/lib/validations/verify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, ChevronLeft, Loader2, Smartphone, Shield } from "lucide-react";
import { BottomActionBar } from "@/components/ui/bottom-action-bar";

interface PhoneInputStepProps {
  register: UseFormRegister<PhoneInputInput>;
  errors: FieldErrors<PhoneInputInput>;
  isPending: boolean;
  onSubmit: (data: PhoneInputInput) => void;
  handleSubmit: any;
  onBack: () => void;
  phoneVerified?: boolean;
  onContinue?: () => void;
  renderTracker?: () => React.ReactNode;
}

export const PhoneInputStep: React.FC<PhoneInputStepProps> = ({
  register,
  errors,
  isPending,
  onSubmit,
  handleSubmit,
  onBack,
  phoneVerified = false,
  onContinue,
  renderTracker,
}) => {
  if (phoneVerified) {
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
            <div className="w-20 h-20 bg-gradient-to-br from-green-50 to-green-100/50 rounded-full flex items-center justify-center border-4 border-white shadow-sm relative">
              <div className="absolute inset-0 rounded-full border border-green-100/50" />
              <Check className="w-8 h-8 text-green-600" strokeWidth={3} />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-[28px] font-extrabold mb-2 text-foreground leading-tight tracking-tight">
              Phone Verified
            </h1>
            <p className="text-[15px] text-muted-foreground font-medium">
              Your phone number is already verified
            </p>
          </div>

          {/* Premium Card Container */}
          <div className="bg-white rounded-[24px] p-6 shadow-xl shadow-blue-900/5 border border-gray-100 text-center space-y-6">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto border border-green-100">
              <Check className="w-8 h-8 text-green-600" strokeWidth={3} />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-foreground">Verified Successfully</h2>
              <p className="text-sm text-muted-foreground">
                Your phone has been successfully verified. Please continue to proceed to the next step.
              </p>
            </div>
          </div>
        </div>

        <BottomActionBar>
          <Button onClick={onContinue} className="w-full h-14 text-[16px] font-bold">
            Continue
          </Button>
        </BottomActionBar>
      </div>
    );
  }

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
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
              <Shield className="w-5 h-5 text-green-500" fill="currentColor" />
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-[28px] font-extrabold mb-2 text-foreground leading-tight tracking-tight">
            Verify Your Phone
          </h1>
          <p className="text-[15px] text-muted-foreground font-medium">
            Add your number to secure your account
          </p>
        </div>

        {/* Premium Card Container */}
        <div className="bg-white rounded-[24px] p-5 shadow-xl shadow-blue-900/5 border border-gray-100">
          <form id="phone-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <div className="space-y-3">
              <Label htmlFor="register-phone" className="text-[13px] font-bold text-foreground ml-1">Phone Number</Label>
              <div className="flex gap-2">
                <Input
                  id="register-phone"
                  type="tel"
                  disabled={isPending}
                  placeholder="+1 (555) 000-0000"
                  className={`h-14 w-full text-[16px] font-bold bg-gray-50/50 border-gray-200 focus-visible:ring-primary/20 ${errors.phoneNumber ? "border-destructive focus-visible:ring-destructive/20" : ""}`}
                  {...register("phoneNumber")}
                />
              </div>
              {errors.phoneNumber && (
                <p className="text-red-500 text-[12px] font-medium text-left ml-1">{errors.phoneNumber.message}</p>
              )}
            </div>
          </form>
        </div>
      </div>

      <BottomActionBar>
        <Button form="phone-form" type="submit" disabled={isPending} className="w-full h-14 text-[16px] font-bold">
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Sending Code...
            </span>
          ) : (
            "Send Code"
          )}
        </Button>
      </BottomActionBar>
    </div>
  );
};
