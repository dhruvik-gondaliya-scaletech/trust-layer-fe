import { useMutation, useQueryClient } from "@tanstack/react-query";
import authService from "@/services/auth.service";
import { AUTH_STORAGE_KEYS, FRONTEND_ROUTES } from "@/lib/contants";
import {
  setStorageItem,
  setStorageItems,
  removeStorageItem,
  removeStorageItems,
} from "@/lib/storage";
import { userKeys } from "@/hooks/queries/useUsers";
import { dashboardKeys } from "@/hooks/queries/useDashboardData";
import { useRouter } from "next/navigation";
import type {
  RegisterDto,
  LoginDto,
  VerifyOtpDto,
  ResendOtpDto,
  SendPhoneOtpDto,
  OtpType,
} from "@/types/api.types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function storeTokens(accessToken: string, refreshToken?: string) {
  setStorageItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  if (refreshToken) {
    setStorageItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  }
}

function clearTokens() {
  removeStorageItems([
    AUTH_STORAGE_KEYS.ACCESS_TOKEN,
    AUTH_STORAGE_KEYS.REFRESH_TOKEN,
    AUTH_STORAGE_KEYS.REGISTRATION_TOKEN,
    AUTH_STORAGE_KEYS.EMAIL_VERIFIED,
    AUTH_STORAGE_KEYS.PHONE_VERIFIED,
    AUTH_STORAGE_KEYS.PROFILE_COMPLETE,
  ]);
}

// ─── useRegisterMutation ──────────────────────────────────────────────────────

/**
 * Mutation: POST /auth/register
 * On success, stores tokens and calls the provided onSuccess callback.
 */
export function useRegisterMutation({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: any, variables: RegisterDto) => void;
  onError?: (error: Error) => void;
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: RegisterDto) => {
      const { firstName, lastName, email, password } = dto;
      return authService.register({ firstName, lastName, email, password });
    },
    onSuccess: (data, variables) => {
      if (data.registrationToken) {
        setStorageItems({
          [AUTH_STORAGE_KEYS.REGISTRATION_TOKEN]: data.registrationToken,
          [AUTH_STORAGE_KEYS.EMAIL_VERIFIED]: "false",
          [AUTH_STORAGE_KEYS.PHONE_VERIFIED]: "false",
          [AUTH_STORAGE_KEYS.PROFILE_COMPLETE]: "false",
        });
        removeStorageItems([
          AUTH_STORAGE_KEYS.ACCESS_TOKEN,
          AUTH_STORAGE_KEYS.REFRESH_TOKEN,
        ]);
      } else if (data.accessToken) {
        storeTokens(data.accessToken, data.refreshToken);
        removeStorageItems([
          AUTH_STORAGE_KEYS.REGISTRATION_TOKEN,
          AUTH_STORAGE_KEYS.EMAIL_VERIFIED,
          AUTH_STORAGE_KEYS.PHONE_VERIFIED,
          AUTH_STORAGE_KEYS.PROFILE_COMPLETE,
        ]);
      }
      // Invalidate so AuthProvider's useCurrentUser re-fetches immediately
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
      onSuccess?.(data, variables);
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });
}

// ─── useLoginMutation ─────────────────────────────────────────────────────────

/**
 * Mutation: POST /auth/login
 * On success, stores tokens and calls the provided onSuccess callback.
 */
export function useLoginMutation({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: any, variables: LoginDto) => void;
  onError?: (error: Error) => void;
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: LoginDto) => authService.login(dto),
    onSuccess: (data, variables) => {
      if (data.accessToken) {
        storeTokens(data.accessToken, data.refreshToken);
        setStorageItems({
          [AUTH_STORAGE_KEYS.EMAIL_VERIFIED]: String(data.emailVerified ?? true),
          [AUTH_STORAGE_KEYS.PHONE_VERIFIED]: String(data.phoneVerified ?? true),
          [AUTH_STORAGE_KEYS.PROFILE_COMPLETE]: String(data.profileComplete ?? false),
        });
        removeStorageItems([
          AUTH_STORAGE_KEYS.REGISTRATION_TOKEN,
        ]);
      } else if (data.registrationToken) {
        setStorageItems({
          [AUTH_STORAGE_KEYS.REGISTRATION_TOKEN]: data.registrationToken,
          [AUTH_STORAGE_KEYS.EMAIL_VERIFIED]: String(data.emailVerified ?? false),
          [AUTH_STORAGE_KEYS.PHONE_VERIFIED]: String(data.phoneVerified ?? false),
          [AUTH_STORAGE_KEYS.PROFILE_COMPLETE]: String(data.profileComplete ?? false),
        });
        removeStorageItems([
          AUTH_STORAGE_KEYS.ACCESS_TOKEN,
          AUTH_STORAGE_KEYS.REFRESH_TOKEN,
        ]);
      }
      // Invalidate so AuthProvider's useCurrentUser re-fetches immediately
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
      onSuccess?.(data, variables);
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });
}

// ─── useVerifyOtpMutation ─────────────────────────────────────────────────────

/**
 * Mutation: POST /auth/verify-otp
 * Verifies email or phone OTP code.
 */
export function useVerifyOtpMutation({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: VerifyOtpDto) => authService.verifyOtp(dto),
    onSuccess: (data) => {
      if (data.accessToken) {
        storeTokens(data.accessToken, data.refreshToken);
        removeStorageItem(AUTH_STORAGE_KEYS.REGISTRATION_TOKEN);
      }
      // Invalidate user profile so it reflects the new verified state
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
      onSuccess?.(data);
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });
}

// ─── useResendOtpMutation ─────────────────────────────────────────────────────

/**
 * Mutation: POST /auth/resend-otp
 * Resend OTP to email or phone.
 */
export function useResendOtpMutation({
  onSuccess,
  onError,
}: {
  onSuccess?: (type: OtpType) => void;
  onError?: (error: Error) => void;
} = {}) {
  return useMutation({
    mutationFn: (dto: ResendOtpDto) => authService.resendOtp(dto),
    onSuccess: (data, variables) => {
      onSuccess?.(variables.type);
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });
}

// ─── useSendPhoneOtpMutation ──────────────────────────────────────────────────

/**
 * Mutation: POST /auth/send-phone-otp
 * Saves phone number and sends SMS OTP.
 */
export function useSendPhoneOtpMutation({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
} = {}) {
  return useMutation({
    mutationFn: (dto: SendPhoneOtpDto) => authService.sendPhoneOtp(dto),
    onSuccess: (data) => {
      onSuccess?.();
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });
}

// ─── useLogout ────────────────────────────────────────────────────────────────

/**
 * Clears tokens from localStorage, resets the React Query cache,
 * and navigates the user to the login page.
 */
export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return () => {
    clearTokens();
    queryClient.clear();
    router.replace(FRONTEND_ROUTES.LOGIN);
  };
}
