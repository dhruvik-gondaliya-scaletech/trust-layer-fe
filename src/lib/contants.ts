export const API_CONFIG = {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1",

    // ─── Auth Endpoints ───────────────────────────────────────────────────────
    AUTH: {
        REGISTER: "/auth/register",
        LOGIN: "/auth/login",
        REFRESH: "/auth/refresh",
        VERIFY_OTP: "/auth/verify-otp",
        RESEND_OTP: "/auth/resend-otp",
        SEND_PHONE_OTP: "/auth/send-phone-otp",
    },

    // ─── User Endpoints ───────────────────────────────────────────────────────
    USERS: {
        ME: "/users/me",
        ME_PHOTO: "/users/me/photo",
        BY_USERNAME: (username: string) => `/users/${username}`,
    },

    // ─── Deal Endpoints ───────────────────────────────────────────────────────
    DEALS: {
        CREATE: "/deals",
        MY_DEALS: "/deals/my",
        BY_DEAL_NUMBER: (dealNumber: string) => `/deals/${dealNumber}`,
        UPDATE: (id: string) => `/deals/${id}`,
        PUBLISH: (id: string) => `/deals/${id}/publish`,
        DELETE: (id: string) => `/deals/${id}`,
        UPLOAD_MEDIA: (id: string) => `/deals/${id}/media`,
        DELETE_MEDIA: (id: string, mediaId: string) => `/deals/${id}/media/${mediaId}`,
    },
}

export const FRONTEND_ROUTES = {
    LANDING: "/",
    REGISTER: "/register",
    VERIFY: "/verify",
    LOGIN: "/login",
    DASHBOARD: "/dashboard",
    CREATE_DEAL: "/create-deal",

}

export enum VerificationStep {
    EMAIL_VERIFY = "email-verify",
    EMAIL_SUCCESS = "email-success",
    PHONE_INPUT = "phone-input",
    PHONE_VERIFY = "phone-verify",
    PHONE_SUCCESS = "phone-success",
    PROFILE_SETUP = "profile-setup",
}

export const AUTH_STORAGE_KEYS = {
    ACCESS_TOKEN: "tl_access_token",
    REFRESH_TOKEN: "tl_refresh_token",
    REGISTRATION_TOKEN: "tl_registration_token",
} as const;
