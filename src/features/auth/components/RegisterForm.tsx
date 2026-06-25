"use client";

import React, { useState } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { RegisterInput } from "@/lib/validations/register";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Loader2, Eye, EyeOff } from "lucide-react";
import { FRONTEND_ROUTES } from "@/lib/contants";
import Link from "next/link";
import { BottomActionBar } from "@/components/ui/bottom-action-bar";

interface RegisterFormProps {
  register: UseFormRegister<RegisterInput>;
  errors: FieldErrors<RegisterInput>;
  isPending: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  register,
  errors,
  isPending,
  onSubmit,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-background pb-[160px]">
      {/* Top Header */}
      <div className="flex items-center justify-center p-6 bg-background">
        <div className="flex items-center gap-2 text-primary font-bold text-lg select-none">
          <Shield className="h-6 w-6" />
          <span>TrustLayer</span>
        </div>
      </div>

      <div className="flex-1 px-5 pt-2 max-w-sm mx-auto w-full">
        <h1 className="text-[28px] font-extrabold mb-2 text-foreground leading-tight tracking-tight">
          Create Account
        </h1>
        <p className="text-[15px] text-muted-foreground mb-8">
          Create your account to start trusted transactions.
        </p>

        <form id="register-form" onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-[13px] font-medium text-foreground">First Name</label>
              <Input
                id="firstName"
                autoComplete="given-name"
                required
                disabled={isPending}
                placeholder="John"
                className={errors.firstName ? "border-destructive focus-visible:ring-destructive/20" : ""}
                {...register("firstName")}
              />
              {errors.firstName && (
                <p className="text-red-500 text-[12px] font-medium">{errors.firstName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="text-[13px] font-medium text-foreground">Last Name</label>
              <Input
                id="lastName"
                autoComplete="family-name"
                required
                disabled={isPending}
                placeholder="Smith"
                className={errors.lastName ? "border-destructive focus-visible:ring-destructive/20" : ""}
                {...register("lastName")}
              />
              {errors.lastName && (
                <p className="text-red-500 text-[12px] font-medium">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-[13px] font-medium text-foreground">Email</label>
            <Input
              id="email"
              autoComplete="email"
              required
              type="email"
              disabled={isPending}
              placeholder="john@example.com"
              className={errors.email ? "border-destructive focus-visible:ring-destructive/20" : ""}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-[12px] font-medium">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-[13px] font-medium text-foreground">Password</label>
            <div className="relative">
              <Input
                id="password"
                autoComplete="new-password"
                required
                type={showPassword ? "text" : "password"}
                disabled={isPending}
                placeholder="••••••••"
                className={`pr-10 ${errors.password ? "border-destructive focus-visible:ring-destructive/20" : ""}`}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                disabled={isPending}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-[12px] font-medium">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-[13px] font-medium text-foreground">Confirm Password</label>
            <div className="relative">
              <Input
                id="confirmPassword"
                autoComplete="new-password"
                required
                type={showConfirmPassword ? "text" : "password"}
                disabled={isPending}
                placeholder="••••••••"
                className={`pr-10 ${errors.confirmPassword ? "border-destructive focus-visible:ring-destructive/20" : ""}`}
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                disabled={isPending}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-[12px] font-medium">{errors.confirmPassword.message}</p>
            )}
          </div>
        </form>

        <p className="text-center text-[14px] text-muted-foreground mt-8">
          Already have an account?{" "}
          <Link href={FRONTEND_ROUTES.LOGIN} className="text-primary font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>

      <BottomActionBar>
        <div className="mb-3 flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="consent"
              disabled={isPending}
              className="mt-0.5 flex-shrink-0 w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
              {...register("agreeTerms")}
            />
            <label htmlFor="consent" className="text-[13px] leading-tight text-slate-500 cursor-pointer select-none">
              I agree to the{" "}
              <Link href="#" className="text-primary hover:underline">
                Terms
              </Link>
              ,{" "}
              <Link href="#" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              , and{" "}
              <Link href="#" className="text-primary hover:underline">
                Escrow Terms
              </Link>
              .
            </label>
          </div>
          {errors.agreeTerms && (
            <p className="text-red-500 text-[12px] font-medium">
              {errors.agreeTerms.message}
            </p>
          )}
          <div className="text-center mt-1">
            <p className="text-[12px] text-slate-400 font-medium flex items-center justify-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> Built for secure buyer and seller transactions.
            </p>
          </div>
        </div>
        <Button form="register-form" type="submit" disabled={isPending} className="w-full h-14 text-[16px]">
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating Account...
            </span>
          ) : (
            "Continue"
          )}
        </Button>
      </BottomActionBar>
    </div>
  );
};
