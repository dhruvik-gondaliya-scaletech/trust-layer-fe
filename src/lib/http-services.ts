import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from "axios";
import { API_CONFIG, AUTH_STORAGE_KEYS, FRONTEND_ROUTES } from "./contants";
import { getStorageItem, removeStorageItems } from "./storage";


// ─── API Response Types ───────────────────────────────────────────────────────

/**
 * Shape of every successful response from the TrustLayer backend.
 * The TransformInterceptor wraps all data in this envelope.
 *
 * {
 *   "success": true,
 *   "data": <T>,
 *   "timestamp": "2024-01-15T10:30:00.000Z"
 * }
 */
export interface ApiSuccessResponse<T> {
    success: true;
    data: T;
    timestamp: string;
}

/**
 * Shape of every error response from the TrustLayer backend.
 * The AllExceptionsFilter emits this when any HTTP exception is thrown.
 *
 * {
 *   "statusCode": 400,
 *   "timestamp": "2024-01-15T10:30:00.000Z",
 *   "path": "/api/v1/auth/login",
 *   "message": "Invalid credentials"
 * }
 */
export interface ApiErrorResponse {
    statusCode: number;
    timestamp: string;
    path: string;
    message: string;
}

/** Typed error thrown by the response interceptor so callers get a clean message */
export class ApiError extends Error {
    public readonly statusCode: number;
    public readonly path: string;
    public readonly timestamp: string;

    constructor(payload: ApiErrorResponse) {
        super(payload.message);
        this.name = "ApiError";
        this.statusCode = payload.statusCode;
        this.path = payload.path;
        this.timestamp = payload.timestamp;
    }
}

// ─── Http Service ─────────────────────────────────────────────────────────────

/** Public routes where a 401 should NOT trigger a redirect to login */
const PUBLIC_ROUTES: string[] = [
    FRONTEND_ROUTES.LANDING,
    FRONTEND_ROUTES.LOGIN,
    FRONTEND_ROUTES.REGISTER,
    FRONTEND_ROUTES.VERIFY,
];

class HttpService {
    private static instance: HttpService;
    private readonly axiosInstance: AxiosInstance;

    private constructor() {
        this.axiosInstance = axios.create({
            baseURL: API_CONFIG.BASE_URL,
            withCredentials: false,
            headers: {
                "Content-Type": "application/json",
            },
        });

        this.attachRequestInterceptor();
        this.attachResponseInterceptor();
    }

    // ─── Request interceptor ─────────────────────────────────────────────────

    private attachRequestInterceptor(): void {
        this.axiosInstance.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                if (typeof window !== "undefined") {
                    try {
                        let token: string | null = null;
                        const isVerificationOrResend = config.url && (
                            config.url.endsWith("/auth/verify-otp") ||
                            config.url.endsWith("/auth/resend-otp") ||
                            config.url.endsWith("/auth/send-phone-otp")
                        );

                        if (isVerificationOrResend) {
                            token = getStorageItem(AUTH_STORAGE_KEYS.REGISTRATION_TOKEN);
                        } else {
                            token = getStorageItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
                            if (!token) {
                                token = getStorageItem(AUTH_STORAGE_KEYS.REGISTRATION_TOKEN);
                            }
                        }

                        if (token) {
                            config.headers.Authorization = `Bearer ${token}`;
                        }
                    } catch {
                        // Silently ignore storage access errors (e.g. private browsing restrictions)
                    }
                }
                return config;
            },
            (error) => Promise.reject(error)
        );
    }

    // ─── Response interceptor ────────────────────────────────────────────────

    private attachResponseInterceptor(): void {
        this.axiosInstance.interceptors.response.use(
            // ── Success handler ──────────────────────────────────────────────
            (response: AxiosResponse) => {
                const envelope = response.data as ApiSuccessResponse<unknown>;

                // Backend always returns { success: true, data, timestamp }
                // Unwrap the envelope so callers receive `data` directly.
                if (
                    envelope &&
                    typeof envelope === "object" &&
                    "success" in envelope &&
                    envelope.success === true &&
                    "data" in envelope
                ) {
                    return {
                        ...response,
                        data: envelope.data,
                    } as AxiosResponse;
                }

                // Fallback: return raw response for any non-enveloped endpoint
                return response;
            },

            // ── Error handler ────────────────────────────────────────────────
            (error) => {
                // --- Parse backend error envelope ---
                if (error.response?.data) {
                    const errorData = error.response.data as ApiErrorResponse;

                    // Re-throw as a typed ApiError when the backend error shape is present
                    if (
                        typeof errorData === "object" &&
                        "statusCode" in errorData &&
                        "message" in errorData
                    ) {
                        const apiError = new ApiError({
                            statusCode: errorData.statusCode ?? error.response.status,
                            timestamp: errorData.timestamp ?? new Date().toISOString(),
                            path: errorData.path ?? "",
                            message:
                                typeof errorData.message === "string"
                                    ? errorData.message
                                    : "Request failed",
                        });
                        return Promise.reject(apiError);
                    }
                }

                // --- Handle 401: redirect to login unless on a public route ---
                if (error.response?.status === 401) {
                    if (typeof window !== "undefined") {
                        const currentPath = window.location.pathname;
                        const isPublicRoute = PUBLIC_ROUTES.some(
                            (route) => currentPath === route || currentPath.startsWith(route + "/")
                        );

                        if (!isPublicRoute) {
                            // Remove stored tokens
                            try {
                                removeStorageItems([
                                    AUTH_STORAGE_KEYS.ACCESS_TOKEN,
                                    AUTH_STORAGE_KEYS.REFRESH_TOKEN,
                                    AUTH_STORAGE_KEYS.REGISTRATION_TOKEN,
                                    AUTH_STORAGE_KEYS.EMAIL_VERIFIED,
                                    AUTH_STORAGE_KEYS.PHONE_VERIFIED,
                                    AUTH_STORAGE_KEYS.PROFILE_COMPLETE,
                                ]);
                            } catch {
                                // ignore
                            }
                            window.location.href = FRONTEND_ROUTES.LOGIN;
                        }
                    }
                }

                return Promise.reject(error);
            }
        );
    }

    // ─── Singleton ───────────────────────────────────────────────────────────

    public static getInstance(): HttpService {
        if (!HttpService.instance) {
            HttpService.instance = new HttpService();
        }
        return HttpService.instance;
    }

    // ─── HTTP Methods ────────────────────────────────────────────────────────

    public get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.axiosInstance.get<T>(url, config);
    }

    public post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.axiosInstance.post<T>(url, data, config);
    }

    public put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.axiosInstance.put<T>(url, data, config);
    }

    public patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.axiosInstance.patch<T>(url, data, config);
    }

    public delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.axiosInstance.delete<T>(url, config);
    }
}

export default HttpService.getInstance();
