"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { zodResolver } from "@/lib/validations/resolver";
import {
  emailVerifySchema,
  phoneInputSchema,
  phoneVerifySchema,
  profileSetupSchema,
  EmailVerifyInput,
  PhoneInputInput,
  PhoneVerifyInput,
  ProfileSetupInput,
} from "@/lib/validations/verify";
import {
  useVerifyEmailMutation,
  useSendPhoneMutation,
  useVerifyPhoneMutation,
  useProfileSetupMutation,
} from "@/hooks/queries/useVerify";
import { EmailVerifyStep } from "../components/EmailVerifyStep";
import { EmailSuccessStep } from "../components/EmailSuccessStep";
import { PhoneInputStep } from "../components/PhoneInputStep";
import { PhoneVerifyStep } from "../components/PhoneVerifyStep";
import { PhoneSuccessStep } from "../components/PhoneSuccessStep";
import { ProfileSetupStep } from "../components/ProfileSetupStep";
import { FRONTEND_ROUTES } from "@/lib/contants";

type StepState =
  | "email-verify"
  | "email-success"
  | "phone-input"
  | "phone-verify"
  | "phone-success"
  | "profile-setup";

export const VerifyContainer: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "alex@email.com";

  const [step, setStep] = useState<StepState>("email-verify");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Forms definition for each step
  const emailForm = useForm<EmailVerifyInput>({
    resolver: zodResolver(emailVerifySchema),
    defaultValues: { code: "" },
  });

  const phoneInputForm = useForm<PhoneInputInput>({
    resolver: zodResolver(phoneInputSchema),
    defaultValues: { phoneNumber: "" },
  });

  const phoneVerifyForm = useForm<PhoneVerifyInput>({
    resolver: zodResolver(phoneVerifySchema),
    defaultValues: { code: "" },
  });

  const profileSetupForm = useForm<ProfileSetupInput>({
    resolver: zodResolver(profileSetupSchema),
    defaultValues: { username: "", bio: "", avatar: "🐶" },
  });

  // Mutations definition
  const verifyEmailMutation = useVerifyEmailMutation({
    onSuccess: () => {
      toast.success("Email verified successfully!");
      setStep("email-success");
    },
    onError: (err) => {
      toast.error(err.message || "Email verification failed.");
    },
  });

  const sendPhoneMutation = useSendPhoneMutation({
    onSuccess: (data) => {
      toast.success("SMS verification code sent!");
      setPhoneNumber(data.phoneNumber);
      setStep("phone-verify");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to send SMS code.");
    },
  });

  const verifyPhoneMutation = useVerifyPhoneMutation({
    onSuccess: () => {
      toast.success("Phone verified successfully!");
      setStep("phone-success");
    },
    onError: (err) => {
      toast.error(err.message || "Phone verification failed.");
    },
  });

  const profileSetupMutation = useProfileSetupMutation({
    onSuccess: () => {
      toast.success("Profile setup complete! Welcome to TrustLayer!");
      router.push(FRONTEND_ROUTES.LANDING);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to save profile.");
    },
  });

  // Back button event handlers
  const handleBack = () => {
    if (step === "email-verify") {
      router.push(FRONTEND_ROUTES.REGISTER);
    } else if (step === "phone-input") {
      setStep("email-verify");
    } else if (step === "phone-verify") {
      setStep("phone-input");
    } else if (step === "profile-setup") {
      setStep("phone-input");
    }
  };

  return (
    <>
      {step === "email-verify" && (
        <EmailVerifyStep
          register={emailForm.register}
          errors={emailForm.formState.errors}
          isPending={verifyEmailMutation.isPending}
          onSubmit={(data) => verifyEmailMutation.mutate(data)}
          handleSubmit={emailForm.handleSubmit}
          setValue={emailForm.setValue}
          onBack={handleBack}
        />
      )}

      {step === "email-success" && (
        <EmailSuccessStep
          email={email}
          onContinue={() => setStep("phone-input")}
        />
      )}

      {step === "phone-input" && (
        <PhoneInputStep
          register={phoneInputForm.register}
          errors={phoneInputForm.formState.errors}
          isPending={sendPhoneMutation.isPending}
          onSubmit={(data) => sendPhoneMutation.mutate(data)}
          handleSubmit={phoneInputForm.handleSubmit}
          onBack={handleBack}
        />
      )}

      {step === "phone-verify" && (
        <PhoneVerifyStep
          register={phoneVerifyForm.register}
          errors={phoneVerifyForm.formState.errors}
          isPending={verifyPhoneMutation.isPending}
          onSubmit={(data) => verifyPhoneMutation.mutate(data)}
          handleSubmit={phoneVerifyForm.handleSubmit}
          setValue={phoneVerifyForm.setValue}
          onBack={handleBack}
        />
      )}

      {step === "phone-success" && (
        <PhoneSuccessStep
          phoneNumber={`+1 ${phoneNumber}`}
          onContinue={() => setStep("profile-setup")}
        />
      )}

      {step === "profile-setup" && (
        <ProfileSetupStep
          register={profileSetupForm.register}
          errors={profileSetupForm.formState.errors}
          isPending={profileSetupMutation.isPending}
          onSubmit={(data) => profileSetupMutation.mutate(data)}
          handleSubmit={profileSetupForm.handleSubmit}
          setValue={profileSetupForm.setValue}
          onBack={handleBack}
        />
      )}
    </>
  );
};
