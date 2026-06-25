"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Check } from "lucide-react";
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
  useResendOtpMutation,
} from "@/hooks/queries/useVerify";
import { EmailVerifyStep } from "../components/EmailVerifyStep";
import { PhoneInputStep } from "../components/PhoneInputStep";
import { PhoneVerifyStep } from "../components/PhoneVerifyStep";
import { ProfileSetupStep } from "../components/ProfileSetupStep";
import { FRONTEND_ROUTES, VerificationStep, AUTH_STORAGE_KEYS } from "@/lib/contants";
import { getStorageItem } from "@/lib/storage";

export const VerifyContainer: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [step, setStep] = useState<VerificationStep>(VerificationStep.EMAIL_VERIFY);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [profileComplete, setProfileComplete] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const emailVal = getStorageItem(AUTH_STORAGE_KEYS.EMAIL_VERIFIED) === "true";
      const phoneVal = getStorageItem(AUTH_STORAGE_KEYS.PHONE_VERIFIED) === "true";
      const profileVal = getStorageItem(AUTH_STORAGE_KEYS.PROFILE_COMPLETE) === "true";

      setEmailVerified(emailVal);
      setPhoneVerified(phoneVal);
      setProfileComplete(profileVal);

      if (emailVal && phoneVal) {
        setStep(VerificationStep.PROFILE_SETUP);
      } else if (emailVal) {
        setStep(VerificationStep.PHONE_INPUT);
      } else {
        setStep(VerificationStep.EMAIL_VERIFY);
      }
    } catch {}
  }, []);

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
      setEmailVerified(true);
      setStep(VerificationStep.PHONE_INPUT);
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
      setPhoneVerified(true);
      setStep(VerificationStep.PROFILE_SETUP);
    },
    onError: (err) => {
      toast.error(err.message || "Phone verification failed.");
    },
  });

  const profileSetupMutation = useProfileSetupMutation({
    onSuccess: () => {
      toast.success("Profile setup complete! Welcome to TrustLayer!");
      setProfileComplete(true);
      router.push(FRONTEND_ROUTES.DASHBOARD);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to save profile.");
    },
  });

  const resendOtpMutation = useResendOtpMutation({
    onSuccess: (_, type) => {
      const message =
        type === "email_verification"
          ? "Verification code resent via email!"
          : "Verification code resent via SMS!";
      toast.success(message);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to resend verification code.");
    },
  });

  const handleResendEmail = (onSuccessCallback: () => void) => {
    resendOtpMutation.mutate("email_verification", {
      onSuccess: () => {
        onSuccessCallback();
      },
    });
  };

  const handleResendPhone = (onSuccessCallback: () => void) => {
    resendOtpMutation.mutate("phone_verification", {
      onSuccess: () => {
        onSuccessCallback();
      },
    });
  };

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

  const renderTracker = () => {
    return (
      <div className="flex items-center justify-center gap-2 mb-8 select-none">
        {/* Email Tab */}
        <button
          type="button"
          onClick={() => {
            setStep(VerificationStep.EMAIL_VERIFY);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-bold border transition-all ${
            step === VerificationStep.EMAIL_VERIFY
              ? "bg-blue-50 text-blue-700 border-blue-100"
              : emailVerified
              ? "bg-green-50 text-green-700 border-green-100 hover:bg-green-100/50"
              : "text-gray-400 border-gray-200 hover:bg-gray-50"
          }`}
        >
          {emailVerified ? (
            <Check className="w-3.5 h-3.5 text-green-600" strokeWidth={3} />
          ) : (
            step === VerificationStep.EMAIL_VERIFY && <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
          )}
          Email
        </button>

        <div className="h-px w-4 bg-gray-200" />

        {/* Phone Tab */}
        <button
          type="button"
          onClick={() => {
            setStep(VerificationStep.PHONE_INPUT);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-bold border transition-all ${
            step === VerificationStep.PHONE_INPUT || step === VerificationStep.PHONE_VERIFY
              ? "bg-blue-50 text-blue-700 border-blue-100"
              : phoneVerified
              ? "bg-green-50 text-green-700 border-green-100 hover:bg-green-100/50"
              : "text-gray-400 border-gray-200 hover:bg-gray-50"
          }`}
        >
          {phoneVerified ? (
            <Check className="w-3.5 h-3.5 text-green-600" strokeWidth={3} />
          ) : (
            (step === VerificationStep.PHONE_INPUT || step === VerificationStep.PHONE_VERIFY) && (
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
            )
          )}
          Phone
        </button>

        <div className="h-px w-4 bg-gray-200" />

        {/* Profile Tab */}
        <button
          type="button"
          onClick={() => {
            if (emailVerified && phoneVerified) {
              setStep(VerificationStep.PROFILE_SETUP);
            } else {
              toast.error("Please verify your email and phone first.");
            }
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-bold border transition-all ${
            step === VerificationStep.PROFILE_SETUP
              ? "bg-blue-50 text-blue-700 border-blue-100"
              : profileComplete
              ? "bg-green-50 text-green-700 border-green-100 hover:bg-green-100/50"
              : "text-gray-400 border-gray-200 hover:bg-gray-50"
          }`}
        >
          {profileComplete ? (
            <Check className="w-3.5 h-3.5 text-green-600" strokeWidth={3} />
          ) : (
            step === VerificationStep.PROFILE_SETUP && <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
          )}
          Profile
        </button>
      </div>
    );
  };

  if (!isMounted) {
    return null;
  }

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
          onResend={handleResendEmail}
          isResending={resendOtpMutation.isPending}
          emailVerified={emailVerified}
          onContinue={() => setStep(VerificationStep.PHONE_INPUT)}
          renderTracker={renderTracker}
        />
      )}

      {(step === VerificationStep.PHONE_INPUT) && (
        <PhoneInputStep
          register={phoneInputForm.register}
          errors={phoneInputForm.formState.errors}
          isPending={sendPhoneMutation.isPending}
          onSubmit={(data) => sendPhoneMutation.mutate(data)}
          handleSubmit={phoneInputForm.handleSubmit}
          onBack={handleBack}
          phoneVerified={phoneVerified}
          onContinue={() => setStep(VerificationStep.PROFILE_SETUP)}
          renderTracker={renderTracker}
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
          onResend={handleResendPhone}
          isResending={resendOtpMutation.isPending}
          renderTracker={renderTracker}
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
          renderTracker={renderTracker}
        />
      )}
    </>
  );
};
