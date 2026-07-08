import { useMutation, useQueryClient } from "@tanstack/react-query";
import authService from "@/services/auth.service";
import usersService from "@/services/users.service";
import { AUTH_STORAGE_KEYS } from "@/lib/contants";
import {
  setStorageItem,
  setStorageItems,
  removeStorageItems,
} from "@/lib/storage";
import { userKeys } from "@/hooks/queries/useUsers";
import type {
  EmailVerifyInput,
  PhoneInputInput,
  PhoneVerifyInput,
  ProfileSetupInput,
} from "@/lib/validations/verify";
import type { OtpType } from "@/types/api.types";

function storeTokens(accessToken: string, refreshToken?: string) {
  setStorageItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  if (refreshToken) {
    setStorageItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  }
}

export function useResendOtpMutation({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: any, type: OtpType) => void;
  onError?: (error: Error) => void;
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (type: OtpType) => {
      return authService.resendOtp({ type });
    },
    onSuccess: (data, type) => {
      if (data.registrationToken) {
        setStorageItem(AUTH_STORAGE_KEYS.REGISTRATION_TOKEN, data.registrationToken);
      }
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
      onSuccess?.(data, type);
    },
    onError,
  });
}

export function useVerifyEmailMutation({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: EmailVerifyInput) => {
      return authService.verifyOtp({
        code: data.code,
        type: "email_verification",
      });
    },
    onSuccess: (data) => {
      if (data.accessToken) {
        storeTokens(data.accessToken, data.refreshToken);
        setStorageItems({
          [AUTH_STORAGE_KEYS.EMAIL_VERIFIED]: "true",
          [AUTH_STORAGE_KEYS.PHONE_VERIFIED]: "true",
          [AUTH_STORAGE_KEYS.PROFILE_COMPLETE]: "false",
        });
        removeStorageItems([
          AUTH_STORAGE_KEYS.REGISTRATION_TOKEN,
        ]);
      } else if (data.registrationToken) {
        setStorageItems({
          [AUTH_STORAGE_KEYS.REGISTRATION_TOKEN]: data.registrationToken,
          [AUTH_STORAGE_KEYS.EMAIL_VERIFIED]: "true",
          [AUTH_STORAGE_KEYS.PHONE_VERIFIED]: "false",
          [AUTH_STORAGE_KEYS.PROFILE_COMPLETE]: "false",
        });
      }
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
      onSuccess?.(data);
    },
    onError,
  });
}

export function useSendPhoneMutation({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: { success: boolean; phoneNumber: string }) => void;
  onError?: (error: Error) => void;
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PhoneInputInput) => {
      let clean = data.phoneNumber.replace(/[^\d+]/g, "");
      if (!clean.startsWith("+")) {
        if (clean.length === 11 && clean.startsWith("1")) {
          clean = `+${clean}`;
        } else if (clean.length === 10) {
          clean = `+1${clean}`;
        } else {
          clean = `+${clean}`;
        }
      }
      const res = await authService.sendPhoneOtp({
        phone: clean,
      });
      return {
        ...res,
        formattedPhone: clean,
      };
    },
    onSuccess: (data) => {
      if (data.registrationToken) {
        setStorageItem(AUTH_STORAGE_KEYS.REGISTRATION_TOKEN, data.registrationToken);
      }
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
      onSuccess?.({ success: true, phoneNumber: data.formattedPhone });
    },
    onError,
  });
}

export function useVerifyPhoneMutation({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PhoneVerifyInput) => {
      return authService.verifyOtp({
        code: data.code,
        type: "phone_verification",
      });
    },
    onSuccess: (data) => {
      if (data.accessToken) {
        storeTokens(data.accessToken, data.refreshToken);
        setStorageItems({
          [AUTH_STORAGE_KEYS.EMAIL_VERIFIED]: "true",
          [AUTH_STORAGE_KEYS.PHONE_VERIFIED]: "true",
          [AUTH_STORAGE_KEYS.PROFILE_COMPLETE]: "false",
        });
        removeStorageItems([
          AUTH_STORAGE_KEYS.REGISTRATION_TOKEN,
        ]);
      } else if (data.registrationToken) {
        setStorageItems({
          [AUTH_STORAGE_KEYS.REGISTRATION_TOKEN]: data.registrationToken,
          [AUTH_STORAGE_KEYS.EMAIL_VERIFIED]: "true",
          [AUTH_STORAGE_KEYS.PHONE_VERIFIED]: "true",
          [AUTH_STORAGE_KEYS.PROFILE_COMPLETE]: "false",
        });
      }
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
      onSuccess?.(data);
    },
    onError,
  });
}

export function useProfileSetupMutation({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ProfileSetupInput) => {
      return usersService.updateMe({
        username: data.username,
        bio: data.bio ?? "",
        profilePhotoUrl: data.avatar || undefined,
      });
    },
    onSuccess: (data) => {
      setStorageItems({
        [AUTH_STORAGE_KEYS.EMAIL_VERIFIED]: "true",
        [AUTH_STORAGE_KEYS.PHONE_VERIFIED]: "true",
        [AUTH_STORAGE_KEYS.PROFILE_COMPLETE]: "true",
      });
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
      onSuccess?.(data);
    },
    onError,
  });
}
