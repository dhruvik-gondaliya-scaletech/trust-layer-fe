"use client";

import { Spinner } from "@/components/ui/spinner";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import { PhoneInputInput } from "@/lib/validations/verify";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Check, ChevronLeft, Smartphone, Shield } from "lucide-react";
import { BottomActionBar } from "@/components/ui/bottom-action-bar";
import { cn } from "@/lib/utils";
import { Form, FormField, FormControl, Field, FieldLabel, FieldError } from "@/components/ui/field";

interface PhoneInputStepProps {
  form: UseFormReturn<PhoneInputInput>;
  isPending: boolean;
  onSubmit: (data: PhoneInputInput) => void;
  onBack: () => void;
  phoneVerified?: boolean;
  onContinue?: () => void;
  renderTracker?: () => React.ReactNode;
}

export const PhoneInputStep: React.FC<PhoneInputStepProps> = ({
  form,
  isPending,
  onSubmit,
  onBack,
  phoneVerified = false,
  onContinue,
  renderTracker,
}) => {
  if (phoneVerified) {
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
          <h1 className="text-sm font-bold text-slate-400 tracking-wide uppercase">Step 2 of 3</h1>
        </div>

        <div className="flex-1 px-5 pt-4 max-w-sm mx-auto w-full flex flex-col justify-center">
          {renderTracker?.()}

          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 shadow-sm relative">
              <Check className="w-6 h-6 text-emerald-600" strokeWidth={3} />
            </div>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-black mb-1.5 text-foreground leading-tight tracking-tight">
              Phone Verified
            </h1>
            <p className="text-sm text-muted-foreground font-medium">
              Your phone number is already verified
            </p>
          </div>

          <div className="text-center space-y-6">
            <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
              <Check className="w-7 h-7 text-emerald-600" strokeWidth={3} />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-foreground">Verified Successfully</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your phone has been successfully verified. Please continue to proceed to the next step.
              </p>
            </div>
          </div>
        </div>

        <BottomActionBar>
          <Button onClick={onContinue} className="w-full h-14 text-[15px] font-bold rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/10 transition-all duration-200 active:scale-[0.98]">
            Continue
          </Button>
        </BottomActionBar>
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
        <h1 className="text-sm font-bold text-slate-400 tracking-wide uppercase">Step 2 of 3</h1>
      </div>

      <div className="flex-1 px-5 pt-4 max-w-sm mx-auto w-full flex flex-col justify-center">
        {renderTracker?.()}

        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 shadow-sm relative">
            <Smartphone className="w-6 h-6 text-blue-600" />
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-slate-100">
              <Shield className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" />
            </div>
          </div>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-black mb-1.5 text-foreground leading-tight tracking-tight">
            Verify Your Phone
          </h1>
          <p className="text-sm text-muted-foreground font-medium">
            Add your number to secure your account
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-[28px] p-6 shadow-[0_20px_50px_rgba(8,15,30,0.03)] border border-slate-100">
          <Form {...form}>
            <form id="phone-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
              <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                <Field className="space-y-3 border-none">
                  <FieldLabel className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                    Phone Number
                  </FieldLabel>
                  <FormControl>
                    <PhoneInput
                      value={field.value || ""}
                      onChange={(val) => field.onChange(val ?? "")}
                      defaultCountry="US"
                      international
                      withCountryCallingCode
                      disabled={isPending}
                      placeholder="Enter phone number"
                    />
                  </FormControl>
                  <FieldError className="text-left ml-1 mt-1.5" />
                </Field>
              )} />
            </form>
          </Form>
        </div>

        <BottomActionBar>
          <Button
            form="phone-form"
            type="submit"
            disabled={isPending}
            className="w-full h-14 text-[15px] font-bold rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/10 transition-all duration-200 active:scale-[0.98]"
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner className="w-4 h-4" />
                Sending Code...
              </span>
            ) : (
              "Send Code"
            )}
          </Button>
        </BottomActionBar>
      </div>
    </div>
  );
};
