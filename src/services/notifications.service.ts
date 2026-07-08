import httpService from "@/lib/http-services";
import { API_CONFIG } from "@/lib/contants";
import type { PaginatedNotifications } from "@/types/api.types";

/**
 * NOTIFICATIONS SERVICE
 *
 * Wraps all `/notifications/*` endpoints from the TrustLayer API.
 * The HTTP client automatically unwraps the global `{ success, data, timestamp }`
 * envelope, so methods here resolve to the inner `data` payload directly.
 */
const notificationsService = {
  /**
   * GET /notifications 🔒 Auth Required
   * Fetch a paginated list of the authenticated user's in-platform notifications.
   */
  getNotifications: async (page = 1, limit = 10): Promise<PaginatedNotifications> => {
    const res = await httpService.get<PaginatedNotifications>(
      API_CONFIG.NOTIFICATIONS.LIST,
      { params: { page, limit } }
    );
    return res.data;
  },

  /**
   * GET /notifications/unread-count 🔒 Auth Required
   * Get the count of unread in-platform notifications for the authenticated user.
   */
  getUnreadCount: async (): Promise<number> => {
    const res = await httpService.get<number>(API_CONFIG.NOTIFICATIONS.UNREAD_COUNT);
    return res.data;
  },

  /**
   * PATCH /notifications/:id/read 🔒 Auth Required
   * Mark a specific notification as read.
   */
  markAsRead: async (id: string): Promise<null> => {
    const res = await httpService.patch<null>(API_CONFIG.NOTIFICATIONS.MARK_READ(id));
    return res.data;
  },

  /**
   * PATCH /notifications/read-all 🔒 Auth Required
   * Mark all of the authenticated user's unread in-platform notifications as read.
   */
  markAllAsRead: async (): Promise<null> => {
    const res = await httpService.patch<null>(API_CONFIG.NOTIFICATIONS.MARK_ALL_READ);
    return res.data;
  },
};

export default notificationsService;
