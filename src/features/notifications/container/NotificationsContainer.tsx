"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FRONTEND_ROUTES } from "@/lib/contants";
import {
  useNotifications,
  useUnreadNotificationsCount,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from "@/hooks/queries/useNotifications";
import type { Notification } from "@/types/api.types";
import { NotificationsList } from "../components/NotificationsList";
import { NotificationsSkeleton } from "../components/NotificationsSkeleton";

const PAGE_LIMIT = 10;

export default function NotificationsContainer() {
  const router = useRouter();
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error, refetch } = useNotifications(page, PAGE_LIMIT);
  const { data: unreadCount = 0 } = useUnreadNotificationsCount();

  const markAsReadMutation = useMarkNotificationAsRead({
    onError: (err) => toast.error("Failed to mark notification as read: " + err.message),
  });

  const markAllAsReadMutation = useMarkAllNotificationsAsRead({
    onSuccess: () => toast.success("All notifications marked as read"),
    onError: (err) => toast.error("Failed to mark all as read: " + err.message),
  });

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.readAt) {
      markAsReadMutation.mutate(notification.id);
    }
    if (notification.dealId) {
      router.push(FRONTEND_ROUTES.DEAL_DETAILS(notification.dealId));
    }
  };

  if (isLoading) {
    return <NotificationsSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="w-full min-h-dvh bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center max-w-sm mx-auto select-none">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h3 className="text-lg font-extrabold text-foreground tracking-tight mb-2">
          Failed to load notifications
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          {error?.message || "Something went wrong while fetching your notifications."}
        </p>
        <Button onClick={() => refetch()} className="w-full rounded-2xl h-12">
          Try Again
        </Button>
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(data.total / data.limit));

  return (
    <NotificationsList
      notifications={data.items}
      unreadCount={unreadCount}
      page={data.page}
      totalPages={totalPages}
      onBack={() => router.push(FRONTEND_ROUTES.DASHBOARD)}
      onNotificationClick={handleNotificationClick}
      onMarkAllAsRead={() => markAllAsReadMutation.mutate()}
      onPrevPage={() => setPage((p) => Math.max(1, p - 1))}
      onNextPage={() => setPage((p) => Math.min(totalPages, p + 1))}
      isMarkingAllAsRead={markAllAsReadMutation.isPending}
    />
  );
}
