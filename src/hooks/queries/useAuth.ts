import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import authService from "@/services/auth.service";
import { AUTH_STORAGE_KEYS, FRONTEND_ROUTES } from "@/lib/contants";
import { userKeys } from "@/hooks/queries/useUsers";
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

function storeTokens(accessToken: string, refreshToken: string) {
  try {
    localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  } catch {
    // Silently ignore storage errors (e.g. private browsing)
  }
}

function clearTokens() {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
  } catch {
    // ignore
  }
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
  onSuccess?: () => void;
  onError?: (error: Error) => void;
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: RegisterDto) => authService.register(dto),
    onSuccess: (data) => {
      storeTokens(data.accessToken, data.refreshToken);
      // Invalidate so AuthProvider's useCurrentUser re-fetches immediately
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
      toast.success("Account created! Please verify your email.");
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Registration failed. Please try again.");
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
  onSuccess?: () => void;
  onError?: (error: Error) => void;
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: LoginDto) => authService.login(dto),
    onSuccess: (data) => {
      storeTokens(data.accessToken, data.refreshToken);
      // Invalidate so AuthProvider's useCurrentUser re-fetches immediately
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
      toast.success("Welcome back!");
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Login failed. Please check your credentials.");
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
  onSuccess?: () => void;
  onError?: (error: Error) => void;
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: VerifyOtpDto) => authService.verifyOtp(dto),
    onSuccess: (data) => {
      toast.success(data.message ?? "Verification successful!");
      // Invalidate user profile so it reflects the new verified state
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Verification failed. Please try again.");
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
      toast.success(data.message ?? "Verification code sent.");
      onSuccess?.(variables.type);
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Failed to resend code. Please try again.");
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
      toast.success(data.message ?? "Verification code sent to your phone.");
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Failed to send SMS code. Please try again.");
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
