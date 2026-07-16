"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { ForgotEmailInput } from "@/lib/validations/forgot-password";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormControl, Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Shield, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { FRONTEND_ROUTES } from "@/lib/contants";

interface ForgotEmailStepProps {
  form: UseFormReturn<ForgotEmailInput>;
  isPending: boolean;
  onSubmit: (data: ForgotEmailInput) => void;
}

export const ForgotEmailStep: React.FC<ForgotEmailStepProps> = ({
  form,
  isPending,
  onSubmit,
}) => {
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
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        <h1 className="text-[28px] font-extrabold mb-2 text-foreground leading-tight tracking-tight text-center">
          Forgot Password?
        </h1>
        <p className="text-[15px] text-muted-foreground text-center mb-8">
          Enter your email address and we&apos;ll send you an OTP to reset your password.
        </p>

        <Form {...form}>
          <form id="forgot-email-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
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

            <Button type="submit" disabled={isPending} className="w-full h-14 text-[16px] mt-4">
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner className="w-4 h-4" />
                  Sending OTP...
                </span>
              ) : (
                "Send OTP"
              )}
            </Button>

            <div className="text-center mt-6">
              <Link
                href={FRONTEND_ROUTES.LOGIN}
                className="inline-flex items-center gap-2 text-[14px] font-bold text-primary hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Sign In
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
