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
import { FRONTEND_ROUTES, VerificationStep } from "@/lib/contants";



export const VerifyContainer: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [step, setStep] = useState<VerificationStep>(VerificationStep.EMAIL_VERIFY);
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
      setStep(VerificationStep.EMAIL_SUCCESS);
    },
    onError: (err) => {
      toast.error(err.message || "Email verification failed.");
    },
  });

  const sendPhoneMutation = useSendPhoneMutation({
    onSuccess: (data) => {
      toast.success("SMS verification code sent!");
      setPhoneNumber(data.phoneNumber);
      setStep(VerificationStep.PHONE_VERIFY);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to send SMS code.");
    },
  });

  const verifyPhoneMutation = useVerifyPhoneMutation({
    onSuccess: () => {
      toast.success("Phone verified successfully!");
      setStep(VerificationStep.PHONE_SUCCESS);
    },
    onError: (err) => {
      toast.error(err.message || "Phone verification failed.");
    },
  });

  const profileSetupMutation = useProfileSetupMutation({
    onSuccess: () => {
      toast.success("Profile setup complete! Welcome to TrustLayer!");
      router.push(FRONTEND_ROUTES.DASHBOARD);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to save profile.");
    },
  });

  // Back button event handlers
  const handleBack = () => {
    if (step === VerificationStep.EMAIL_VERIFY) {
      router.push(FRONTEND_ROUTES.REGISTER);
    } else if (step === VerificationStep.PHONE_INPUT) {
      setStep(VerificationStep.EMAIL_VERIFY);
    } else if (step === VerificationStep.PHONE_VERIFY) {
      setStep(VerificationStep.PHONE_INPUT);
    } else if (step === VerificationStep.PROFILE_SETUP) {
      setStep(VerificationStep.PHONE_INPUT);
    }
  };

  return (
    <>
      {step === VerificationStep.EMAIL_VERIFY && (
        <EmailVerifyStep
          register={emailForm.register}
          errors={emailForm.formState.errors}
          isPending={verifyEmailMutation.isPending}
          onSubmit={(data) => verifyEmailMutation.mutate(data)}
          handleSubmit={emailForm.handleSubmit}
          setValue={emailForm.setValue}
          onBack={handleBack}
          defaultCode={emailForm.getValues("code")}
        />
      )}

      {step === VerificationStep.EMAIL_SUCCESS && (
        <EmailSuccessStep
          email={email}
          onContinue={() => setStep(VerificationStep.PHONE_INPUT)}
        />
      )}

      {step === VerificationStep.PHONE_INPUT && (
        <PhoneInputStep
          register={phoneInputForm.register}
          errors={phoneInputForm.formState.errors}
          isPending={sendPhoneMutation.isPending}
          onSubmit={(data) => sendPhoneMutation.mutate(data)}
          handleSubmit={phoneInputForm.handleSubmit}
          onBack={handleBack}
        />
      )}

      {step === VerificationStep.PHONE_VERIFY && (
        <PhoneVerifyStep
          register={phoneVerifyForm.register}
          errors={phoneVerifyForm.formState.errors}
          isPending={verifyPhoneMutation.isPending}
          onSubmit={(data) => verifyPhoneMutation.mutate(data)}
          handleSubmit={phoneVerifyForm.handleSubmit}
          setValue={phoneVerifyForm.setValue}
          onBack={handleBack}
          defaultCode={phoneVerifyForm.getValues("code")}
        />
      )}

      {step === VerificationStep.PHONE_SUCCESS && (
        <PhoneSuccessStep
          phoneNumber={`+1 ${phoneNumber}`}
          onContinue={() => setStep(VerificationStep.PROFILE_SETUP)}
        />
      )}

      {step === VerificationStep.PROFILE_SETUP && (
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
