"use client";

import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { LoginInput } from "@/lib/validations/login";
import { Button } from "@/components/ui/button";
import { Loader2, Shield } from "lucide-react";
import { FRONTEND_ROUTES } from "@/lib/contants";
import Link from "next/link";

interface LoginFormProps {
  register: UseFormRegister<LoginInput>;
  errors: FieldErrors<LoginInput>;
  isPending: boolean;
  onSubmit: (data: LoginInput) => void;
  handleSubmit: any;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  register,
  errors,
  isPending,
  onSubmit,
  handleSubmit,
}) => {
  return (
    <div className="flex-1 flex flex-col justify-between px-6 pb-8 pt-8">
      <div className="flex-1 flex flex-col justify-center gap-8">
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
            Sign In
          </h1>
        </div>

        {/* Form Fields */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 text-left"
          noValidate
        >
          {/* Email Address */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="login-email"
              className="text-xs font-semibold text-foreground/80"
            >
              Email
            </label>
            <input
              id="login-email"
              type="email"
              disabled={isPending}
              placeholder="john@example.com"
              className={`px-3.5 py-2 text-sm bg-background border rounded-xl outline-none transition-all focus:ring-2 focus:ring-primary/20 ${
                errors.email
                  ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                  : "border-border/80 focus:border-primary"
              }`}
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
            <label
              htmlFor="login-password"
              className="text-xs font-semibold text-foreground/80"
            >
              Password
            </label>
            <input
              id="login-password"
              type="password"
              disabled={isPending}
              placeholder="••••••••"
              className={`px-3.5 py-2 text-sm bg-background border rounded-xl outline-none transition-all focus:ring-2 focus:ring-primary/20 ${
                errors.password
                  ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                  : "border-border/80 focus:border-primary"
              }`}
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

            {/* Forgot Password */}
            <div className="flex justify-end mt-1">
              <Link
                href="#"
                className="text-xs font-semibold text-primary hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          {/* Navigation link */}
          <div className="text-center mt-4">
            <span className="text-xs text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href={FRONTEND_ROUTES.REGISTER}
                className="font-semibold text-primary hover:underline"
              >
                Create Account
              </Link>
            </span>
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
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
