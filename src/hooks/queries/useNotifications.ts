import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import notificationsService from "@/services/notifications.service";

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const notificationKeys = {
  all: ["notifications"] as const,
  list: (page: number, limit: number) => [...notificationKeys.all, "list", page, limit] as const,
  unreadCount: () => [...notificationKeys.all, "unread-count"] as const,
};

// ─── useNotifications ─────────────────────────────────────────────────────────

/**
 * Query: GET /notifications
 * Fetches a paginated list of the authenticated user's in-platform notifications.
 * Cached for 30 seconds.
 */
export function useNotifications(page = 1, limit = 10) {
  return useQuery({
    queryKey: notificationKeys.list(page, limit),
    queryFn: () => notificationsService.getNotifications(page, limit),
    staleTime: 30_000,
    retry: 1,
  });
}

// ─── useUnreadNotificationsCount ──────────────────────────────────────────────

/**
 * Query: GET /notifications/unread-count
 * Fetches the count of unread in-platform notifications for the authenticated user.
 * Cached for 30 seconds.
 */
export function useUnreadNotificationsCount(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: () => notificationsService.getUnreadCount(),
    enabled: options?.enabled ?? true,
    staleTime: 30_000,
    retry: 1,
  });
}

// ─── useMarkNotificationAsRead ─────────────────────────────────────────────────

/**
 * Mutation: PATCH /notifications/:id/read
 * Marks a specific notification as read. Invalidates notification caches.
 */
export function useMarkNotificationAsRead({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationsService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
      onSuccess?.();
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });
}

// ─── useMarkAllNotificationsAsRead ─────────────────────────────────────────────

/**
 * Mutation: PATCH /notifications/read-all
 * Marks all unread in-platform notifications as read. Invalidates notification caches.
 */
export function useMarkAllNotificationsAsRead({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationsService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
      onSuccess?.();
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });
}
