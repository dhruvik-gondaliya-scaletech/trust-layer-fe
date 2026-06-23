"use client";

import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { PhoneInputInput } from "@/lib/validations/verify";
import { Button } from "@/components/ui/button";
import { Check, ChevronLeft, Loader2, Smartphone } from "lucide-react";

interface PhoneInputStepProps {
  register: UseFormRegister<PhoneInputInput>;
  errors: FieldErrors<PhoneInputInput>;
  isPending: boolean;
  onSubmit: (data: PhoneInputInput) => void;
  handleSubmit: any;
  onBack: () => void;
}

export const PhoneInputStep: React.FC<PhoneInputStepProps> = ({
  register,
  errors,
  isPending,
  onSubmit,
  handleSubmit,
  onBack,
}) => {
  return (
    <div className="flex-1 flex flex-col justify-between relative min-h-screen sm:min-h-[840px]">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between px-6 py-5 select-none border-b border-border/10">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="w-9 h-9 rounded-full"
          >
            <ChevronLeft className="w-5 h-5 text-foreground/80" />
          </Button>
          <span className="text-sm font-bold text-foreground">Step 2 of 3</span>
          <div className="w-9" />
        </div>

        {/* Wizard Progress Indicator Row */}
        <div className="flex items-center justify-center gap-3 px-6 py-4 border-b border-border/5 select-none">
          <div className="flex items-center gap-1 px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[11px] font-bold text-emerald-600">
            <Check className="w-3 h-3 text-emerald-500 stroke-[3]" />
            <span>Email</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-xs font-bold text-primary">
            <span className="w-1.5 h-1.5 bg-primary rounded-full" />
            <span>Phone</span>
          </div>
          <div className="text-xs text-muted-foreground font-medium">Profile</div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="flex-1 flex flex-col justify-center px-6 py-8 gap-8">
        {/* Phone Icon Box */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10 relative">
            <Smartphone className="w-7 h-7 text-primary stroke-[1.5]" />
            <div className="absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-emerald-500 border border-white flex items-center justify-center">
              <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
            </div>
          </div>
          <div className="text-center flex flex-col gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground leading-tight tracking-tight">
              Verify Your Phone
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-[285px] mx-auto">
              Add your number to secure your account
            </p>
          </div>
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 text-left max-w-sm mx-auto w-full"
          noValidate
        >
          {/* Phone Number Field */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="register-phone"
              className="text-xs font-bold text-foreground/80"
            >
              Phone Number
            </label>
            <div className="flex gap-2">
              <div className="w-16 bg-muted border border-border/80 rounded-xl flex items-center justify-center text-sm font-semibold text-muted-foreground select-none">
                +1
              </div>
              <input
                id="register-phone"
                type="tel"
                disabled={isPending}
                placeholder="(555) 000-0000"
                className={`flex-1 px-3.5 py-2.5 text-sm bg-background border rounded-xl outline-none transition-all focus:ring-2 focus:ring-primary/20 ${
                  errors.phoneNumber
                    ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                    : "border-border/80 focus:border-primary"
                }`}
                aria-invalid={errors.phoneNumber ? "true" : "false"}
                aria-describedby={
                  errors.phoneNumber ? "phone-error" : undefined
                }
                {...register("phoneNumber")}
              />
            </div>
            {errors.phoneNumber && (
              <span
                id="phone-error"
                className="text-[11px] font-medium text-destructive mt-0.5"
                role="alert"
              >
                {errors.phoneNumber.message}
              </span>
            )}
          </div>

          {/* Action Button at bottom */}
          <div className="mt-8">
            <Button
              type="submit"
              disabled={isPending}
              size="lg"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/95 shadow-md shadow-primary/10 rounded-2xl h-12 text-sm font-bold active:scale-[0.98] transition-all"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending Code...
                </>
              ) : (
                "Send Code"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
