import { useMutation } from "@tanstack/react-query";
import {
  EmailVerifyInput,
  PhoneInputInput,
  PhoneVerifyInput,
  ProfileSetupInput,
} from "@/lib/validations/verify";

export function useVerifyEmailMutation({
  onSuccess,
  onError,
}: {
  onSuccess: (data: { success: boolean }) => void;
  onError: (error: Error) => void;
}) {
  return useMutation({
    mutationFn: async (data: EmailVerifyInput) => {
      await new Promise((resolve) => setTimeout(resolve, 1200));

      if (data.code === "000000") {
        throw new Error("Invalid or expired verification code.");
      }

      return { success: true };
    },
    onSuccess,
    onError,
  });
}

export function useSendPhoneMutation({
  onSuccess,
  onError,
}: {
  onSuccess: (data: { success: boolean; phoneNumber: string }) => void;
  onError: (error: Error) => void;
}) {
  return useMutation({
    mutationFn: async (data: PhoneInputInput) => {
      await new Promise((resolve) => setTimeout(resolve, 1200));

      if (data.phoneNumber.includes("999999")) {
        throw new Error("This phone number is blocked.");
      }

      return { success: true, phoneNumber: data.phoneNumber };
    },
    onSuccess,
    onError,
  });
}

export function useVerifyPhoneMutation({
  onSuccess,
  onError,
}: {
  onSuccess: (data: { success: boolean }) => void;
  onError: (error: Error) => void;
}) {
  return useMutation({
    mutationFn: async (data: PhoneVerifyInput) => {
      await new Promise((resolve) => setTimeout(resolve, 1200));

      if (data.code === "000000") {
        throw new Error("Invalid or expired SMS verification code.");
      }

      return { success: true };
    },
    onSuccess,
    onError,
  });
}

export function useProfileSetupMutation({
  onSuccess,
  onError,
}: {
  onSuccess: (data: { success: boolean; profile: ProfileSetupInput }) => void;
  onError: (error: Error) => void;
}) {
  return useMutation({
    mutationFn: async (data: ProfileSetupInput) => {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (data.username.toLowerCase() === "admin") {
        throw new Error("The username 'admin' is reserved.");
      }

      return { success: true, profile: data };
    },
    onSuccess,
    onError,
  });
}
