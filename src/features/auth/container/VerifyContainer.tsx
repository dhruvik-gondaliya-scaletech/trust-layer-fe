"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
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
import { FRONTEND_ROUTES, AUTH_STORAGE_KEYS } from "@/lib/contants";
import { getStorageItem } from "@/lib/storage";
import { VerificationStep } from "@/types/enums";

export const VerifyContainer: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const redirect = searchParams.get("redirect");

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
    } catch { }
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
    defaultValues: { username: "", bio: "", avatar: "" },
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
      if (redirect) {
        router.push(redirect);
      } else {
        router.push(FRONTEND_ROUTES.DASHBOARD);
      }
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
    const isEmailActive = step === VerificationStep.EMAIL_VERIFY;
    const isPhoneActive = step === VerificationStep.PHONE_INPUT || step === VerificationStep.PHONE_VERIFY;
    const isProfileActive = step === VerificationStep.PROFILE_SETUP;

    return (
      <div className="w-full max-w-sm mx-auto mb-10 select-none px-1">
        <div className="relative flex items-center justify-between">
          {/* Background Connecting Line */}
          <div className="absolute left-0 top-[20px] -translate-y-1/2 w-full h-[3px] bg-slate-100 rounded-full -z-10" />

          {/* Active Progress Connecting Line */}
          <div
            className="absolute left-0 top-[20px] -translate-y-1/2 h-[3px] bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 rounded-full transition-all duration-500 -z-10"
            style={{
              width: emailVerified && phoneVerified
                ? "100%"
                : emailVerified
                  ? "50%"
                  : "0%"
            }}
          />

          {/* Step 1: Email */}
          <div className="flex flex-col items-center flex-1">
            <button
              type="button"
              onClick={() => setStep(VerificationStep.EMAIL_VERIFY)}
              className="group focus:outline-none cursor-pointer"
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300",
                  emailVerified
                    ? "bg-emerald-500 border-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                    : isEmailActive
                      ? "bg-blue-600 border-blue-600 text-white ring-4 ring-blue-500/15 shadow-[0_0_12px_rgba(59,130,246,0.25)]"
                      : "bg-white border-slate-200 text-slate-400 group-hover:border-slate-300"
                )}
              >
                {emailVerified ? (
                  <Check className="w-5 h-5 text-white" strokeWidth={3} />
                ) : (
                  <span>1</span>
                )}
              </div>
            </button>
            <span className={cn(
              "text-xs mt-2 transition-colors duration-300",
              isEmailActive || emailVerified ? "text-slate-800 font-bold" : "text-slate-400 font-semibold"
            )}>
              Email
            </span>
          </div>

          {/* Step 2: Phone */}
          <div className="flex flex-col items-center flex-1">
            <button
              type="button"
              onClick={() => {
                if (emailVerified) {
                  setStep(VerificationStep.PHONE_INPUT);
                } else {
                  toast.error("Please verify your email first.");
                }
              }}
              className="group focus:outline-none cursor-pointer"
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300",
                  phoneVerified
                    ? "bg-emerald-500 border-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                    : isPhoneActive
                      ? "bg-blue-600 border-blue-600 text-white ring-4 ring-blue-500/15 shadow-[0_0_12px_rgba(59,130,246,0.25)]"
                      : "bg-white border-slate-200 text-slate-400 group-hover:border-slate-300"
                )}
              >
                {phoneVerified ? (
                  <Check className="w-5 h-5 text-white" strokeWidth={3} />
                ) : (
                  <span>2</span>
                )}
              </div>
            </button>
            <span className={cn(
              "text-xs mt-2 transition-colors duration-300",
              isPhoneActive || phoneVerified ? "text-slate-800 font-bold" : "text-slate-400 font-semibold"
            )}>
              Phone
            </span>
          </div>

          {/* Step 3: Profile */}
          <div className="flex flex-col items-center flex-1">
            <button
              type="button"
              onClick={() => {
                if (emailVerified && phoneVerified) {
                  setStep(VerificationStep.PROFILE_SETUP);
                } else {
                  toast.error("Please verify your email and phone first.");
                }
              }}
              className="group focus:outline-none cursor-pointer"
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300",
                  profileComplete
                    ? "bg-emerald-500 border-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                    : isProfileActive
                      ? "bg-blue-600 border-blue-600 text-white ring-4 ring-blue-500/15 shadow-[0_0_12px_rgba(59,130,246,0.25)]"
                      : "bg-white border-slate-200 text-slate-400 group-hover:border-slate-300"
                )}
              >
                {profileComplete ? (
                  <Check className="w-5 h-5 text-white" strokeWidth={3} />
                ) : (
                  <span>3</span>
                )}
              </div>
            </button>
            <span className={cn(
              "text-xs mt-2 transition-colors duration-300",
              isProfileActive || profileComplete ? "text-slate-800 font-bold" : "text-slate-400 font-semibold"
            )}>
              Profile
            </span>
          </div>
        </div>
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
          form={emailForm}
          isPending={verifyEmailMutation.isPending}
          onSubmit={(data) => verifyEmailMutation.mutate(data)}
          onBack={handleBack}
          onResend={handleResendEmail}
          isResending={resendOtpMutation.isPending}
          emailVerified={emailVerified}
          onContinue={() => setStep(VerificationStep.PHONE_INPUT)}
          renderTracker={renderTracker}
        />
      )}

      {(step === VerificationStep.PHONE_INPUT) && (
        <PhoneInputStep
          form={phoneInputForm}
          isPending={sendPhoneMutation.isPending}
          onSubmit={(data) => sendPhoneMutation.mutate(data)}
          onBack={handleBack}
          phoneVerified={phoneVerified}
          onContinue={() => setStep(VerificationStep.PROFILE_SETUP)}
          renderTracker={renderTracker}
        />
      )}

      {step === VerificationStep.PHONE_VERIFY && (
        <PhoneVerifyStep
          form={phoneVerifyForm}
          isPending={verifyPhoneMutation.isPending}
          onSubmit={(data) => verifyPhoneMutation.mutate(data)}
          onBack={handleBack}
          onResend={handleResendPhone}
          isResending={resendOtpMutation.isPending}
          renderTracker={renderTracker}
        />
      )}

      {step === VerificationStep.PROFILE_SETUP && (
        <ProfileSetupStep
          form={profileSetupForm}
          isPending={profileSetupMutation.isPending}
          onSubmit={(data) => profileSetupMutation.mutate(data)}
          onBack={handleBack}
          renderTracker={renderTracker}
        />
      )}
    </>
  );
};
