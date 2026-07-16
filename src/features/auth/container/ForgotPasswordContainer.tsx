"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { zodResolver } from "@/lib/validations/resolver";
import {
  forgotEmailSchema,
  forgotOtpSchema,
  forgotResetSchema,
  ForgotEmailInput,
  ForgotOtpInput,
  ForgotResetInput,
} from "@/lib/validations/forgot-password";
import {
  useForgotPasswordMutation,
  useVerifyResetOtpMutation,
  useResetPasswordMutation,
} from "@/hooks/queries/useAuth";
import { ForgotEmailStep } from "../components/ForgotEmailStep";
import { ForgotOtpStep } from "../components/ForgotOtpStep";
import { ForgotResetStep } from "../components/ForgotResetStep";
import { FRONTEND_ROUTES } from "@/lib/contants";

export const ForgotPasswordContainer: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryEmail = searchParams.get("email") || "";
  const queryStep = searchParams.get("step") || "email";

  const [resetToken, setResetToken] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Form Hooks for each step
  const emailForm = useForm<ForgotEmailInput>({
    resolver: zodResolver(forgotEmailSchema),
    defaultValues: { email: queryEmail },
  });

  const otpForm = useForm<ForgotOtpInput>({
    resolver: zodResolver(forgotOtpSchema),
    defaultValues: { code: "" },
  });

  const resetForm = useForm<ForgotResetInput>({
    resolver: zodResolver(forgotResetSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  // Sync email input field if query parameter updates
  useEffect(() => {
    if (queryEmail) {
      emailForm.setValue("email", queryEmail);
    }
  }, [queryEmail, emailForm]);

  // Step redirection safety guards
  useEffect(() => {
    if (isMounted) {
      if (queryStep === "otp" && !queryEmail) {
        router.replace(FRONTEND_ROUTES.FORGET_PASSWORD);
      } else if (queryStep === "reset" && (!queryEmail || !resetToken)) {
        toast.error("Session expired. Please request a new OTP code.");
        router.replace(FRONTEND_ROUTES.FORGET_PASSWORD);
      }
    }
  }, [queryStep, queryEmail, resetToken, isMounted, router]);

  // Mutations
  const forgotPasswordMutation = useForgotPasswordMutation({
    onSuccess: (data) => {
      toast.success("Verification code sent successfully.");
      const emailVal = emailForm.getValues("email");
      router.push(`${FRONTEND_ROUTES.FORGET_PASSWORD}?email=${encodeURIComponent(emailVal)}&step=otp`);
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to send verification code. Please try again.");
    },
  });

  const verifyResetOtpMutation = useVerifyResetOtpMutation({
    onSuccess: (data) => {
      toast.success("OTP verified successfully.");
      setResetToken(data.resetToken);
      router.push(`${FRONTEND_ROUTES.FORGET_PASSWORD}?email=${encodeURIComponent(queryEmail)}&step=reset`);
    },
    onError: (err: any) => {
      toast.error(err.message || "Invalid or expired code. Please try again.");
    },
  });

  const resetPasswordMutation = useResetPasswordMutation({
    onSuccess: () => {
      toast.success("Password reset successfully. Please log in with your new password.");
      router.replace(FRONTEND_ROUTES.LOGIN);
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to reset password. Please try again.");
    },
  });

  // Submission Handlers
  const handleEmailSubmit = (data: ForgotEmailInput) => {
    forgotPasswordMutation.mutate(data);
  };

  const handleOtpSubmit = (data: ForgotOtpInput) => {
    verifyResetOtpMutation.mutate({
      email: queryEmail,
      code: data.code,
    });
  };

  const handleResetSubmit = (data: ForgotResetInput) => {
    if (!resetToken) {
      toast.error("Session expired. Please restart the forgot password process.");
      router.replace(FRONTEND_ROUTES.FORGET_PASSWORD);
      return;
    }
    resetPasswordMutation.mutate({
      dto: { newPassword: data.password },
      resetToken,
    });
  };

  const handleResend = (onSuccessCallback: () => void) => {
    forgotPasswordMutation.mutate(
      { email: queryEmail },
      {
        onSuccess: () => {
          toast.success("A new OTP code has been sent to your email.");
          onSuccessCallback();
        },
      }
    );
  };

  const handleBackToEmail = () => {
    router.push(FRONTEND_ROUTES.FORGET_PASSWORD);
  };

  if (!isMounted) return null;

  switch (queryStep) {
    case "otp":
      return (
        <ForgotOtpStep
          form={otpForm}
          isPending={verifyResetOtpMutation.isPending}
          onSubmit={handleOtpSubmit}
          email={queryEmail}
          onBack={handleBackToEmail}
          onResend={handleResend}
          isResending={forgotPasswordMutation.isPending}
        />
      );
    case "reset":
      return (
        <ForgotResetStep
          form={resetForm}
          isPending={resetPasswordMutation.isPending}
          onSubmit={handleResetSubmit}
        />
      );
    case "email":
    default:
      return (
        <ForgotEmailStep
          form={emailForm}
          isPending={forgotPasswordMutation.isPending}
          onSubmit={handleEmailSubmit}
        />
      );
  }
};
