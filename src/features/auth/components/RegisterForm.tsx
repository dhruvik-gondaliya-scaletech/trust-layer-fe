"use client";

import { Spinner } from "@/components/ui/spinner";
import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { RegisterInput } from "@/lib/validations/register";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Eye, EyeOff } from "lucide-react";
import { FRONTEND_ROUTES } from "@/lib/contants";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Form, FormField, FormControl, Field, FieldLabel, FieldError } from "@/components/ui/field";

interface RegisterFormProps {
  form: UseFormReturn<RegisterInput>;
  isPending: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  form,
  isPending,
  onSubmit,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const loginUrl = redirect
    ? `${FRONTEND_ROUTES.LOGIN}?redirect=${encodeURIComponent(redirect)}`
    : FRONTEND_ROUTES.LOGIN;

  return (
    <div className="flex flex-col min-h-full pb-8">
      {/* Top Header */}
      <div className="flex items-center justify-center p-6 bg-background lg:hidden">
        <div className="flex items-center gap-2 text-primary font-bold text-lg select-none">
          <Shield className="h-6 w-6" />
          <span>TrustLayer</span>
        </div>
      </div>

      <div className="flex-1 px-5 pt-2 max-w-sm mx-auto w-full lg:flex lg:flex-col lg:justify-center lg:pt-0">
        <h1 className="text-[28px] font-extrabold mb-2 text-foreground leading-tight tracking-tight">
          Create Account
        </h1>
        <p className="text-[15px] text-muted-foreground mb-8">
          Create your account to start trusted transactions.
        </p>

        <Form {...form}>
          <form id="register-form" onSubmit={onSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="firstName" render={({ field }) => (
                <Field>
                  <FieldLabel className="text-[13px]">First Name</FieldLabel>
                  <FormControl>
                    <Input
                      autoComplete="given-name"
                      required
                      disabled={isPending}
                      placeholder="John"
                      {...field}
                    />
                  </FormControl>
                  <FieldError />
                </Field>
              )} />
              <FormField control={form.control} name="lastName" render={({ field }) => (
                <Field>
                  <FieldLabel className="text-[13px]">Last Name</FieldLabel>
                  <FormControl>
                    <Input
                      autoComplete="family-name"
                      required
                      disabled={isPending}
                      placeholder="Smith"
                      {...field}
                    />
                  </FormControl>
                  <FieldError />
                </Field>
              )} />
            </div>

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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isPending}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <FieldError />
              </Field>
            )} />

            <FormField control={form.control} name="confirmPassword" render={({ field }) => (
              <Field>
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isPending}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <FieldError />
              </Field>
            )} />

            <div className="mb-3 flex flex-col gap-3 pt-6">
              <FormField control={form.control} name="agreeTerms" render={({ field }) => (
                <Field className="flex-col gap-3 w-full border-none">
                  <div className="flex items-start gap-3">
                    <FormControl>
                      <input
                        type="checkbox"
                        disabled={isPending}
                        className="mt-0.5 flex-shrink-0 w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                        checked={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FieldLabel className="block text-[13px] leading-normal text-slate-500 cursor-pointer select-none border-none p-0">
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
                    </FieldLabel>
                  </div>
                  <FieldError />
                </Field>
              )} />
              <div className="text-center mt-1">
                <p className="text-[12px] text-slate-400 font-medium flex items-center justify-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" /> Built for secure buyer and seller transactions.
                </p>
              </div>
            </div>
            <Button type="submit" disabled={isPending} className="w-full h-14 text-[16px]">
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner className="w-4 h-4" />
                  Creating Account...
                </span>
              ) : (
                "Continue"
              )}
            </Button>
            <p className="text-center text-[14px] text-muted-foreground mt-4">
              Already have an account?{" "}
              <Link href={loginUrl} className="text-primary font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
};
