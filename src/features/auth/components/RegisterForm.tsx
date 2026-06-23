"use client";

import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { RegisterInput } from "@/lib/validations/register";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, Shield, Lock } from "lucide-react";
import { FRONTEND_ROUTES } from "@/lib/contants";
import Link from "next/link";

interface RegisterFormProps {
  register: UseFormRegister<RegisterInput>;
  errors: FieldErrors<RegisterInput>;
  isPending: boolean;
  onSubmit: (data: RegisterInput) => void;
  handleSubmit: any;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  register,
  errors,
  isPending,
  onSubmit,
  handleSubmit,
}) => {
  return (
    <div className="flex-1 flex flex-col justify-between px-6 pb-8 pt-8">
      <div className="flex-1 flex flex-col justify-center gap-6">
        {/* Logo and Header */}
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-2 text-primary font-bold text-lg select-none">
            <Shield className="w-6 h-6 fill-primary/10 stroke-[2]" />
            <span>TrustLayer</span>
          </div>
        </div>

        {/* Title */}
        <div className="flex flex-col gap-1 text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground leading-tight tracking-tight">
            Create Account
          </h1>
          <p className="text-xs text-muted-foreground">
            Create your account to start trusted transactions.
          </p>
        </div>

        {/* Form Fields */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 text-left"
          noValidate
        >
          {/* First Name & Last Name (Side by Side Grid) */}
          <div className="grid grid-cols-2 gap-4">
            {/* First Name */}
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="register-firstname"
                className="text-xs font-semibold text-foreground/80"
              >
                First Name
              </Label>
              <Input
                id="register-firstname"
                type="text"
                disabled={isPending}
                placeholder="John"
                className={
                  errors.firstName
                    ? "border-destructive focus-visible:ring-destructive/20"
                    : "border-border/80"
                }
                aria-invalid={errors.firstName ? "true" : "false"}
                aria-describedby={
                  errors.firstName ? "firstname-error" : undefined
                }
                {...register("firstName")}
              />
              {errors.firstName && (
                <span
                  id="firstname-error"
                  className="text-[11px] font-medium text-destructive mt-0.5"
                  role="alert"
                >
                  {errors.firstName.message}
                </span>
              )}
            </div>

            {/* Last Name */}
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="register-lastname"
                className="text-xs font-semibold text-foreground/80"
              >
                Last Name
              </Label>
              <Input
                id="register-lastname"
                type="text"
                disabled={isPending}
                placeholder="Smith"
                className={
                  errors.lastName
                    ? "border-destructive focus-visible:ring-destructive/20"
                    : "border-border/80"
                }
                aria-invalid={errors.lastName ? "true" : "false"}
                aria-describedby={
                  errors.lastName ? "lastname-error" : undefined
                }
                {...register("lastName")}
              />
              {errors.lastName && (
                <span
                  id="lastname-error"
                  className="text-[11px] font-medium text-destructive mt-0.5"
                  role="alert"
                >
                  {errors.lastName.message}
                </span>
              )}
            </div>
          </div>

          {/* Email Address */}
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="register-email"
              className="text-xs font-semibold text-foreground/80"
            >
              Email
            </Label>
            <Input
              id="register-email"
              type="email"
              disabled={isPending}
              placeholder="john@example.com"
              className={
                errors.email
                  ? "border-destructive focus-visible:ring-destructive/20"
                  : "border-border/80"
              }
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register("email")}
            />
            {errors.email && (
              <span
                id="email-error"
                className="text-[11px] font-medium text-destructive mt-0.5"
                role="alert"
              >
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="register-password"
              className="text-xs font-semibold text-foreground/80"
            >
              Password
            </Label>
            <Input
              id="register-password"
              type="password"
              disabled={isPending}
              placeholder="••••••••"
              className={
                errors.password
                  ? "border-destructive focus-visible:ring-destructive/20"
                  : "border-border/80"
              }
              aria-invalid={errors.password ? "true" : "false"}
              aria-describedby={errors.password ? "password-error" : undefined}
              {...register("password")}
            />
            {errors.password && (
              <span
                id="password-error"
                className="text-[11px] font-medium text-destructive mt-0.5"
                role="alert"
              >
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="register-confirm-password"
              className="text-xs font-semibold text-foreground/80"
            >
              Confirm Password
            </Label>
            <Input
              id="register-confirm-password"
              type="password"
              disabled={isPending}
              placeholder="••••••••"
              className={
                errors.confirmPassword
                  ? "border-destructive focus-visible:ring-destructive/20"
                  : "border-border/80"
              }
              aria-invalid={errors.confirmPassword ? "true" : "false"}
              aria-describedby={
                errors.confirmPassword ? "confirmpassword-error" : undefined
              }
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <span
                id="confirmpassword-error"
                className="text-[11px] font-medium text-destructive mt-0.5"
                role="alert"
              >
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          {/* Already have an account link */}
          <div className="text-center mt-2">
            <span className="text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link
                href={FRONTEND_ROUTES.LOGIN}
                className="font-semibold text-primary hover:underline"
              >
                Sign In
              </Link>
            </span>
          </div>

          {/* Consent Checkbox */}
          <div className="flex flex-col gap-1 mt-2">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                disabled={isPending}
                className="w-4 h-4 mt-0.5 rounded border-border/80 text-primary focus:ring-primary/20 cursor-pointer"
                aria-invalid={errors.agreeTerms ? "true" : "false"}
                aria-describedby={
                  errors.agreeTerms ? "terms-error" : undefined
                }
                {...register("agreeTerms")}
              />
              <span className="text-xs text-muted-foreground leading-relaxed">
                I agree to the{" "}
                <Link
                  href="#"
                  className="font-semibold text-primary hover:underline"
                >
                  Terms
                </Link>
                ,{" "}
                <Link
                  href="#"
                  className="font-semibold text-primary hover:underline"
                >
                  Privacy Policy
                </Link>
                , and{" "}
                <Link
                  href="#"
                  className="font-semibold text-primary hover:underline"
                >
                  Escrow Terms
                </Link>
                .
              </span>
            </label>
            {errors.agreeTerms && (
              <span
                id="terms-error"
                className="text-[11px] font-medium text-destructive mt-0.5"
                role="alert"
              >
                {errors.agreeTerms.message}
              </span>
            )}
          </div>

          {/* Security badge statement */}
          <div className="flex items-center gap-1.5 justify-center text-[11px] text-muted-foreground select-none mt-2">
            <Lock className="w-3 h-3 text-muted-foreground/60" />
            <span>Built for secure buyer and seller transactions.</span>
          </div>

          {/* Action Button at bottom */}
          <div className="mt-6">
            <Button
              type="submit"
              disabled={isPending}
              size="lg"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/95 shadow-md shadow-primary/10 rounded-2xl h-12 text-sm font-bold active:scale-[0.98] transition-all"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
