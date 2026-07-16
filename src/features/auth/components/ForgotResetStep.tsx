"use client";

import React, { useState } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";
import { ForgotResetInput } from "@/lib/validations/forgot-password";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormControl, Field, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Shield, Lock, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface ForgotResetStepProps {
  form: UseFormReturn<ForgotResetInput>;
  isPending: boolean;
  onSubmit: (data: ForgotResetInput) => void;
}

export const ForgotResetStep: React.FC<ForgotResetStepProps> = ({
  form,
  isPending,
  onSubmit,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Watch the password field for live visual validation indicators
  const password = useWatch({
    control: form.control,
    name: "password",
    defaultValue: "",
  }) || "";

  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);

  return (
    <div className="flex flex-col min-h-full pb-8">
      {/* Top Header for Mobile */}
      <div className="flex items-center justify-center p-6 bg-background lg:hidden">
        <div className="flex items-center gap-2 text-primary font-bold text-lg select-none">
          <Shield className="h-6 w-6" />
          <span>TrustLayer</span>
        </div>
      </div>

      <div className="flex-1 px-5 max-w-sm mx-auto w-full flex flex-col justify-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 shadow-sm">
            <Lock className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        <h1 className="text-[28px] font-extrabold mb-2 text-foreground leading-tight tracking-tight text-center">
          Reset Password
        </h1>
        <p className="text-[15px] text-muted-foreground text-center mb-8">
          Enter your new password below. Make sure it is secure and unique.
        </p>

        <Form {...form}>
          <form id="forgot-reset-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <FormField control={form.control} name="password" render={({ field }) => (
              <Field>
                <FieldLabel className="text-[13px]">New Password</FieldLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      autoComplete="new-password"
                      required
                      type={showPassword ? "text" : "password"}
                      disabled={isPending}
                      placeholder="••••••••"
                      className="pr-10"
                      {...field}
                    />
                  </FormControl>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    disabled={isPending}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <FieldDescription className="text-[12px] mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 leading-normal">
                  <span className="text-muted-foreground mr-0.5">Must contain:</span>
                  <span className={cn("transition-all duration-200 flex items-center gap-0.5 text-[11px]", hasMinLength ? "text-emerald-600 font-semibold" : "text-slate-400")}>
                    {hasMinLength && <span className="text-[10px]">✓</span>} 8+ characters
                  </span>
                  <span className="text-slate-300 text-[10px]">•</span>
                  <span className={cn("transition-all duration-200 flex items-center gap-0.5 text-[11px]", hasUpper ? "text-emerald-600 font-semibold" : "text-slate-400")}>
                    {hasUpper && <span className="text-[10px]">✓</span>} uppercase
                  </span>
                  <span className="text-slate-300 text-[10px]">•</span>
                  <span className={cn("transition-all duration-200 flex items-center gap-0.5 text-[11px]", hasLower ? "text-emerald-600 font-semibold" : "text-slate-400")}>
                    {hasLower && <span className="text-[10px]">✓</span>} lowercase
                  </span>
                  <span className="text-slate-300 text-[10px]">•</span>
                  <span className={cn("transition-all duration-200 flex items-center gap-0.5 text-[11px]", hasNumber ? "text-emerald-600 font-semibold" : "text-slate-400")}>
                    {hasNumber && <span className="text-[10px]">✓</span>} number
                  </span>
                </FieldDescription>
                <FieldError />
              </Field>
            )} />

            <FormField control={form.control} name="confirmPassword" render={({ field }) => (
              <Field className="pt-2">
                <FieldLabel className="text-[13px]">Confirm Password</FieldLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      autoComplete="new-password"
                      required
                      type={showConfirmPassword ? "text" : "password"}
                      disabled={isPending}
                      placeholder="••••••••"
                      className="pr-10"
                      {...field}
                    />
                  </FormControl>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    disabled={isPending}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <FieldError />
              </Field>
            )} />

            <Button type="submit" disabled={isPending} className="w-full h-14 text-[16px] mt-4">
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner className="w-4 h-4" />
                  Resetting Password...
                </span>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
