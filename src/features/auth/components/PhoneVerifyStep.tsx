"use client";

import React, { useState } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { PhoneVerifyInput } from "@/lib/validations/verify";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Smartphone, Check, Loader2, ChevronLeft } from "lucide-react";

interface PhoneVerifyStepProps {
  register: UseFormRegister<PhoneVerifyInput>;
  errors: FieldErrors<PhoneVerifyInput>;
  isPending: boolean;
  onSubmit: (data: PhoneVerifyInput) => void;
  handleSubmit: any;
  setValue: any;
  onBack: () => void;
  defaultCode?: string;
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
}) => {
  const [code, setCode] = useState(defaultCode);

  React.useEffect(() => {
    if (defaultCode) {
      setValue("code", defaultCode, { shouldValidate: true });
    }
  }, [defaultCode, setValue]);

  const handleChange = (val: string) => {
    setCode(val);
    setValue("code", val, { shouldValidate: true });
  };

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
        {/* Phone Code Icon Box */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10">
            <Smartphone className="w-7 h-7 text-primary stroke-[1.5]" />
          </div>
          <div className="text-center flex flex-col gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground text-center leading-tight tracking-tight">
              Enter Phone Code
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground text-center leading-relaxed max-w-[285px] mx-auto">
              We sent a secure code via SMS
            </p>
          </div>
        </div>

        {/* PIN Fields Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 text-left"
          noValidate
        >
          {/* PIN Group Input Container */}
          <div className="flex flex-col gap-2.5">
            <div className="flex justify-between items-center max-w-sm mx-auto w-full px-1">
              <Label className="text-xs font-bold text-foreground/80">
                6-Digit Code
              </Label>
              <button
                type="button"
                className="text-xs font-bold text-primary hover:underline"
              >
                Resend Code
              </button>
            </div>
            <div className="flex justify-center max-w-sm mx-auto w-full">
              <InputOTP
                maxLength={6}
                value={code}
                onChange={handleChange}
                disabled={isPending}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} className={errors.code ? "border-destructive focus-visible:ring-destructive/20" : ""} />
                  <InputOTPSlot index={1} className={errors.code ? "border-destructive focus-visible:ring-destructive/20" : ""} />
                  <InputOTPSlot index={2} className={errors.code ? "border-destructive focus-visible:ring-destructive/20" : ""} />
                  <InputOTPSlot index={3} className={errors.code ? "border-destructive focus-visible:ring-destructive/20" : ""} />
                  <InputOTPSlot index={4} className={errors.code ? "border-destructive focus-visible:ring-destructive/20" : ""} />
                  <InputOTPSlot index={5} className={errors.code ? "border-destructive focus-visible:ring-destructive/20" : ""} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            {errors.code && (
              <span className="text-[11px] font-medium text-destructive text-center mt-1">
                {errors.code.message}
              </span>
            )}
            <input type="hidden" {...register("code")} />
          </div>

          {/* Action Buttons at bottom */}
          <div className="flex flex-col gap-3 mt-4">
            <Button
              type="submit"
              disabled={isPending}
              size="lg"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/95 shadow-md shadow-primary/10 rounded-2xl h-12 text-sm font-bold active:scale-[0.98] transition-all"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              size="lg"
              className="w-full bg-transparent border-border/80 text-foreground hover:bg-muted rounded-2xl h-12 text-sm font-bold active:scale-[0.98] transition-all"
            >
              Resend Code
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
