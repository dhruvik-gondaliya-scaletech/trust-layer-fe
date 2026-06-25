import httpService from "@/lib/http-services";
import { API_CONFIG } from "@/lib/contants";
import type {
  RegisterDto,
  LoginDto,
  RefreshTokenDto,
  VerifyOtpDto,
  ResendOtpDto,
  SendPhoneOtpDto,
  RegisterResponse,
  AuthTokenResponse,
  MessageResponse,
} from "@/types/api.types";

/**
 * AUTH SERVICE
 *
 * Wraps all `/auth/*` endpoints from the TrustLayer API.
 * The HTTP client automatically unwraps the global `{ success, data, timestamp }`
 * envelope, so methods here resolve to the inner `data` payload directly.
 */
const authService = {
  /**
   * POST /auth/register 🔓 Public
   * Register a new user. Returns JWT tokens + success message.
   */
  register: async (dto: RegisterDto): Promise<RegisterResponse> => {
    const res = await httpService.post<RegisterResponse>(
      API_CONFIG.AUTH.REGISTER,
      dto
    );
    return res.data;
  },

  /**
   * POST /auth/login 🔓 Public
   * Authenticate with email & password. Returns JWT tokens.
   */
  login: async (dto: LoginDto): Promise<AuthTokenResponse> => {
    const res = await httpService.post<AuthTokenResponse>(
      API_CONFIG.AUTH.LOGIN,
      dto
    );
    return res.data;
  },

  /**
   * POST /auth/refresh 🔓 Public
   * Exchange a valid refresh token for a new access/refresh pair.
   */
  refreshToken: async (dto: RefreshTokenDto): Promise<AuthTokenResponse> => {
    const res = await httpService.post<AuthTokenResponse>(
      API_CONFIG.AUTH.REFRESH,
      dto
    );
    return res.data;
  },

  /**
   * POST /auth/verify-otp 🔒 Auth Required
   * Verify an email or phone OTP code.
   */
  verifyOtp: async (dto: VerifyOtpDto): Promise<MessageResponse> => {
    const res = await httpService.post<MessageResponse>(
      API_CONFIG.AUTH.VERIFY_OTP,
      dto
    );
    return res.data;
  },

  /**
   * POST /auth/resend-otp 🔒 Auth Required
   * Resend an OTP to the user's email or phone.
   */
  resendOtp: async (dto: ResendOtpDto): Promise<MessageResponse> => {
    const res = await httpService.post<MessageResponse>(
      API_CONFIG.AUTH.RESEND_OTP,
      dto
    );
    return res.data;
  },

  /**
   * POST /auth/send-phone-otp 🔒 Auth Required
   * Save a phone number on the account and send a verification SMS OTP.
   */
  sendPhoneOtp: async (dto: SendPhoneOtpDto): Promise<MessageResponse> => {
    const res = await httpService.post<MessageResponse>(
      API_CONFIG.AUTH.SEND_PHONE_OTP,
      dto
    );
    return res.data;
  },
};

export default authService;
