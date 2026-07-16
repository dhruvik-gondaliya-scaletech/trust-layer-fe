"use client";

import { Spinner } from "@/components/ui/spinner";
import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { LoginInput } from "@/lib/validations/login";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Eye, EyeOff } from "lucide-react";
import { FRONTEND_ROUTES } from "@/lib/contants";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Form, FormField, FormControl, Field, FieldLabel, FieldError } from "@/components/ui/field";

interface LoginFormProps {
  form: UseFormReturn<LoginInput>;
  isPending: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  form,
  isPending,
  onSubmit,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const registerUrl = redirect
    ? `${FRONTEND_ROUTES.REGISTER}?redirect=${encodeURIComponent(redirect)}`
    : FRONTEND_ROUTES.REGISTER;

  return (
    <div className="flex flex-col min-h-full pb-8">
      {/* Top Header */}
      <div className="flex items-center justify-center p-6 bg-background lg:hidden">
        <div className="flex items-center gap-2 text-primary font-bold text-lg select-none">
          <Shield className="h-6 w-6" />
          <span>TrustLayer</span>
        </div>
      </div>

      <div className="flex-1 px-5 max-w-sm mx-auto w-full flex flex-col justify-center">
        <h1 className="text-[28px] font-extrabold mb-8 text-foreground leading-tight tracking-tight">
          Sign In
        </h1>

        <Form {...form}>
          <form id="login-form" onSubmit={onSubmit} className="space-y-4" noValidate>
            <FormField control={form.control} name="email" render={({ field }) => (
              <Field>
                <FieldLabel className="text-[13px]">Email</FieldLabel>
                <FormControl>
                  <Input
                    autoComplete="email"
                    required
                    type="email"
                    disabled={isPending}
                    placeholder="john@example.com"
                    {...field}
                  />
                </FormControl>
                <FieldError />
              </Field>
            )} />

            <FormField control={form.control} name="password" render={({ field }) => (
              <Field>
                <FieldLabel className="text-[13px]">Password</FieldLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      autoComplete="current-password"
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isPending}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <div className="flex justify-end mt-1.5">
                  <Link
                    href={FRONTEND_ROUTES.FORGET_PASSWORD}
                    className="text-[13px] font-medium text-primary hover:underline transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <FieldError />
              </Field>
            )} />

            <Button type="submit" disabled={isPending} className="w-full h-14 text-[16px] mt-4">
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner className="w-4 h-4" />
                  Signing In...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
            <p className="text-center text-[14px] text-muted-foreground mt-4">
              Don&apos;t have an account?{" "}
              <Link href={registerUrl} className="text-primary font-bold hover:underline">
                Create Account
              </Link>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
};
