"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { signupSchema, SignupInput } from "@/lib/validations/signup";
import { zodResolver } from "@/lib/validations/resolver";
import { useSignupMutation } from "@/hooks/queries/useSignup";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface AccountFormContainerProps {
  onSuccess: () => void;
}

export const AccountFormContainer: React.FC<AccountFormContainerProps> = ({
  onSuccess,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      agreeTerms: false,
    },
  });

  const mutation = useSignupMutation({
    onSuccess: (data) => {
      toast.success("Account created successfully!", {
        description: `Welcome to TrustLayer, ${data.user.name}!`,
      });
      reset();
      onSuccess();
    },
    onError: (error) => {
      toast.error("Registration failed", {
        description: error.message,
      });
    },
  });

  const onSubmit = (data: SignupInput) => {
    mutation.mutate(data);
  };

  const isPending = mutation.isPending;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 text-left"
      noValidate
    >
      {/* Full Name */}
      <div className="flex flex-col gap-1.5">
        <Label
          htmlFor="signup-name"
          className="text-xs font-semibold text-foreground/80"
        >
          Full Name
        </Label>
        <Input
          id="signup-name"
          type="text"
          disabled={isPending}
          placeholder="John Doe"
          className={
            errors.name
              ? "border-destructive focus-visible:ring-destructive/20"
              : "border-border/80"
          }
          aria-invalid={errors.name ? "true" : "false"}
          aria-describedby={errors.name ? "name-error" : undefined}
          {...register("name")}
        />
        {errors.name && (
          <span
            id="name-error"
            className="text-[11px] font-medium text-destructive mt-0.5"
            role="alert"
          >
            {errors.name.message}
          </span>
        )}
      </div>

      {/* Email Address */}
      <div className="flex flex-col gap-1.5">
        <Label
          htmlFor="signup-email"
          className="text-xs font-semibold text-foreground/80"
        >
          Email Address
        </Label>
        <Input
          id="signup-email"
          type="email"
          disabled={isPending}
          placeholder="your@email.com"
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
          htmlFor="signup-password"
          className="text-xs font-semibold text-foreground/80"
        >
          Password
        </Label>
        <Input
          id="signup-password"
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

      {/* Terms & Conditions Checkbox */}
      <div className="flex flex-col gap-1 mt-1">
        <label className="flex items-start gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            disabled={isPending}
            className="w-4 h-4 mt-0.5 rounded border-border/80 text-primary focus:ring-primary/20 cursor-pointer"
            aria-invalid={errors.agreeTerms ? "true" : "false"}
            aria-describedby={errors.agreeTerms ? "terms-error" : undefined}
            {...register("agreeTerms")}
          />
          <span className="text-xs text-muted-foreground leading-relaxed">
            I agree to the{" "}
            <a href="#" className="font-semibold text-primary hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="font-semibold text-primary hover:underline">
              Privacy Policy
            </a>
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

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isPending}
        className="w-full mt-2 h-11 text-sm font-bold rounded-xl"
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Creating Account...
          </>
        ) : (
          "Create Account"
        )}
      </Button>
    </form>
  );
};
