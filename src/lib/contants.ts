export const FRONTEND_ROUTES = {
    LANDING: "/",
    REGISTER: "/register",
    VERIFY: "/verify",
    LOGIN: "/login",
    DASHBOARD: "/dashboard",
}

export enum VerificationStep {
    EMAIL_VERIFY = "email-verify",
    EMAIL_SUCCESS = "email-success",
    PHONE_INPUT = "phone-input",
    PHONE_VERIFY = "phone-verify",
    PHONE_SUCCESS = "phone-success",
    PROFILE_SETUP = "profile-setup",
}