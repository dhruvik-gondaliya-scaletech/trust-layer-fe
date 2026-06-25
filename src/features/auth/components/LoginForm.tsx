"use client";

import React, { useState } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { LoginInput } from "@/lib/validations/login";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Loader2, Eye, EyeOff } from "lucide-react";
import { FRONTEND_ROUTES } from "@/lib/contants";
import Link from "next/link";
import { BottomActionBar } from "@/components/ui/bottom-action-bar";

interface LoginFormProps {
  register: UseFormRegister<LoginInput>;
  errors: FieldErrors<LoginInput>;
  isPending: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  register,
  errors,
  isPending,
  onSubmit,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-background pb-[140px]">
      {/* Top Header */}
      <div className="flex items-center justify-center p-6 bg-background">
        <div className="flex items-center gap-2 text-primary font-bold text-lg select-none">
          <Shield className="h-6 w-6" />
          <span>TrustLayer</span>
        </div>
      </div>

      <div className="flex-1 px-5 pt-10 max-w-sm mx-auto w-full">
        <h1 className="text-[28px] font-extrabold mb-8 text-foreground leading-tight tracking-tight">
          Sign In
        </h1>

        <form id="login-form" onSubmit={onSubmit} className="space-y-4" noValidate>
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
                autoComplete="current-password"
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

          <div className="flex justify-end pt-1">
            <Link
              href="#"
              className="text-[14px] font-bold text-primary hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
        </form>

        <p className="text-center text-[14px] text-muted-foreground mt-8">
          Don't have an account?{" "}
          <Link href={FRONTEND_ROUTES.REGISTER} className="text-primary font-bold hover:underline">
            Create Account
          </Link>
        </p>
      </div>

      <BottomActionBar>
        <Button form="login-form" type="submit" disabled={isPending} className="w-full h-14 text-[16px]">
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Signing In...
            </span>
          ) : (
            "Sign In"
          )}
        </Button>
      </BottomActionBar>
    </div>
  );
};
