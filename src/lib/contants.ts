export const API_CONFIG = {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1",

    // ─── Auth Endpoints ───────────────────────────────────────────────────────
    AUTH: {
        REGISTER: "/auth/register",
        LOGIN: "/auth/login",
        VERIFY_OTP: "/auth/verify-otp",
        RESEND_OTP: "/auth/resend-otp",
        SEND_PHONE_OTP: "/auth/send-phone-otp",
        FORGOT_PASSWORD: "/auth/forgot-password",
        VERIFY_RESET_OTP: "/auth/verify-reset-otp",
        RESET_PASSWORD: "/auth/reset-password",
    },

    // ─── User Endpoints ───────────────────────────────────────────────────────
    USERS: {
        ME: "/users/me",
        BY_USERNAME: (username: string) => `/users/${username}`,
        ADDRESSES: "/users/me/addresses",
        ADDRESS_BY_ID: (id: string) => `/users/me/addresses/${id}`,
    },

    // ─── S3 Endpoints ─────────────────────────────────────────────────────────
    S3: {
        PRE_SIGNED_URL: "/s3/pre-signed-url",
    },

    // ─── Deal Endpoints ───────────────────────────────────────────────────────
    DEALS: {
        CREATE: "/deals",
        MY_DEALS: "/deals/my",
        BY_DEAL_NUMBER: (dealNumber: string) => `/deals/${dealNumber}`,
        BY_ID: (id: string) => `/deals/id/${id}`,
        STATUS: (dealNumber: string) => `/deals/${dealNumber}/status`,
        UPDATE: (id: string) => `/deals/${id}`,
        DELETE: (id: string) => `/deals/${id}`,
        ADD_MEDIA: (id: string) => `/deals/${id}/media`,
        DELETE_MEDIA: (id: string, mediaId: string) => `/deals/${id}/media/${mediaId}`,
        DECLINE: (id: string) => `/deals/${id}/decline`,
        SHIP: (id: string) => `/deals/${id}/ship`,
        CONFIRM_DELIVERY: (id: string) => `/deals/${id}/confirm-delivery`,
    },

    // ─── Payment Endpoints ────────────────────────────────────────────────────
    PAYMENTS: {
        CREATE_CHECKOUT_SESSION: (dealId: string) => `/payments/deals/${dealId}/create-checkout-session`,
    },

    // ─── Wallet Endpoints ─────────────────────────────────────────────────────
    WALLET: {
        ME: "/wallet/me",
    },

    // ─── Notification Endpoints ───────────────────────────────────────────────
    NOTIFICATIONS: {
        LIST: "/notifications",
        UNREAD_COUNT: "/notifications/unread-count",
        MARK_READ: (id: string) => `/notifications/${id}/read`,
        MARK_ALL_READ: "/notifications/read-all",
    },

    // ─── Disputes Endpoints ───────────────────────────────────────────────────
    DISPUTES: {
        CREATE: "/disputes",
        BY_DEAL_ID: (dealId: string) => `/disputes/deal/${dealId}`,
        RESPOND: (id: string) => `/disputes/${id}/respond`,
        ESCALATE: (id: string) => `/disputes/${id}/escalate`,
        ACCEPT_DECLINE: (id: string) => `/disputes/${id}/accept-decline`,
        SHIP_RETURN: (id: string) => `/disputes/${id}/ship-return`,
        CONFIRM_RETURN: (id: string) => `/disputes/${id}/confirm-return`,
    },
}

export const FRONTEND_ROUTES = {
    LANDING: "/",
    REGISTER: "/register",
    VERIFY: "/verify",
    LOGIN: "/login",
    FORGET_PASSWORD: "/forget-password",
    DASHBOARD: "/dashboard",
    WALLET: "/wallet",
    TIMELINE: "/deal/details",
    NOTIFICATIONS: "/notifications",
    ADD_SHIPPING_ADDRESS: "/add-shipping-address",
    FUND_ESCROW: (id: string) => `/fund-escrow/${id}`,
    DISPUTE_FLOW: (id: string) => `/dispute/create/${id}`,
    DISPUTE_DETAILS: (dealId: string) => `/dispute/details/${dealId}`,
    DISPUTE_LISTING: "/dispute/listing",
    REVIEW_SELLER: (id: string) => `/review-seller/${id}`,
    DEAL_TIMELINE: (id: string) => `/deal/details/${id}`,
    BUYER_VIEW: (id: string) => `/open-deal/${id}`,
    CREATE_DEAL: "/deal/create",
    DEAL_LISTING: `/deal/details`,
    DEAL_DETAILS: (id: string) => `/deal/details/${id}`,
    DEAL_UPDATE: (id: string) => `/deal/update?dealId=${id}&update=true`,
    DEAL_DELETE: (id: string) => `/deal/delete/${id}`,
    ADD_TRACKING: (id: string) => `/tracking/add/${id}`,
    VIEW_TRACKING: (id: string) => `/tracking/view/${id}`,
}

export const AUTH_STORAGE_KEYS = {
    ACCESS_TOKEN: "tl_access_token",
    REFRESH_TOKEN: "tl_refresh_token",
    REGISTRATION_TOKEN: "tl_registration_token",
    EMAIL_VERIFIED: "tl_email_verified",
    PHONE_VERIFIED: "tl_phone_verified",
    PROFILE_COMPLETE: "tl_profile_complete",
} as const;

export const DEAL_STORAGE_KEYS = {
    DRAFT_EXISTS: "tl_deal_draft_exists",
} as const;

export const CODE_RESEND_TIME_OUT = 60;