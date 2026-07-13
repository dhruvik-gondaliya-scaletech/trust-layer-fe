"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow, isToday, isYesterday, differenceInCalendarDays } from "date-fns";
import { ChevronRight, Check, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/shared/BackButton";
import { cn } from "@/lib/utils";
import type { Notification } from "@/types/api.types";
import { NotificationType } from "@/types/enums";

interface NotificationsListProps {
  notifications: Notification[];
  unreadCount: number;
  page: number;
  totalPages: number;
  onBack: () => void;
  onNotificationClick: (notification: Notification) => void;
  onMarkAllAsRead: () => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  isMarkingAllAsRead?: boolean;
}

const PERIOD_ORDER = ["Today", "Yesterday", "Last 7 Days", "Earlier"] as const;

function getPeriod(dateStr: string): (typeof PERIOD_ORDER)[number] {
  const date = new Date(dateStr);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  if (differenceInCalendarDays(new Date(), date) <= 7) return "Last 7 Days";
  return "Earlier";
}

function getNotificationRole(type: NotificationType): "SELLING" | "BUYING" | "SYSTEM" {
  if (type === NotificationType.DEAL_FUNDED_BUYER || type === NotificationType.DEAL_DECLINED) return "BUYING";
  if (
    [
      NotificationType.DEAL_CREATED,
      NotificationType.DEAL_PUBLISHED,
      NotificationType.DEAL_FUNDED_SELLER,
      NotificationType.DEAL_SHIPPED,
      NotificationType.DEAL_COMPLETED,
    ].includes(type)
  )
    return "SELLING";
  return "SYSTEM";
}

export const NotificationsList: React.FC<NotificationsListProps> = ({
  notifications,
  unreadCount,
  page,
  totalPages,
  onBack,
  onNotificationClick,
  onMarkAllAsRead,
  onPrevPage,
  onNextPage,
  isMarkingAllAsRead,
}) => {
  const [activeTab, setActiveTab] = useState<"All" | "Selling" | "Buying">("Selling");

  const counts = {
    All: notifications.length,
    Selling: notifications.filter((n) => getNotificationRole(n.type) === "SELLING").length,
    Buying: notifications.filter((n) => getNotificationRole(n.type) === "BUYING").length,
  };

  const filteredNotifications = notifications.filter((item) => {
    if (activeTab === "All") return true;
    return getNotificationRole(item.type) === activeTab.toUpperCase();
  });

  const grouped = filteredNotifications.reduce<Record<string, Notification[]>>((acc, item) => {
    const period = getPeriod(item.createdAt);
    if (!acc[period]) acc[period] = [];
    acc[period].push(item);
    return acc;
  }, {});

  const firstNonEmptyGroup = PERIOD_ORDER.find((period) => grouped[period]?.length > 0);

  return (
    <div className="w-full min-h-dvh bg-[#F8FAFC] flex flex-col select-none">
      {/* Header */}
      <div className="bg-card sticky top-0 z-20 shadow-sm border-b border-border/40">
        <div className="flex items-center justify-between p-4 max-w-2xl mx-auto w-full">
          <BackButton
            onClick={onBack}
            className="-ml-2"
          />
          <span className="font-extrabold text-[17px] text-foreground">Notifications</span>
          <div className="w-6" />
        </div>

        {/* Tabs */}
        <div className="max-w-2xl mx-auto w-full px-4 pb-4">
          <div className="flex items-center bg-muted/60 p-1 rounded-[20px]">
            {(["All", "Selling", "Buying"] as const).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "flex-1 py-1.5 rounded-2xl text-[13px] transition-all",
                    isActive
                      ? "bg-card shadow-sm text-primary font-bold"
                      : "text-muted-foreground font-semibold hover:text-foreground"
                  )}
                >
                  {tab} ({counts[tab]})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 pt-6 pb-12 max-w-2xl mx-auto w-full">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[15px] font-bold text-foreground">No notifications</p>
            <p className="text-[13px] text-muted-foreground mt-1">
              You don&apos;t have any {activeTab.toLowerCase()} notifications yet.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            <AnimatePresence mode="popLayout">
              {PERIOD_ORDER.map((period) => {
                const items = grouped[period];
                if (!items || items.length === 0) return null;

                return (
                  <motion.div
                    key={period}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-[17px] font-extrabold text-foreground">{period}</h3>
                      {period === firstNonEmptyGroup && unreadCount > 0 && (
                        <Button
                          variant="link"
                          onClick={onMarkAllAsRead}
                          disabled={isMarkingAllAsRead}
                          className="px-0 h-auto text-[13px] font-semibold text-primary flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Mark all as read
                        </Button>
                      )}
                    </div>

                    <div className="space-y-4">
                      {items.map((item) => {
                        const isUnread = !item.readAt;
                        const role = getNotificationRole(item.type);
                        const isIssue = item.subject?.toLowerCase().includes("issue") || item.subject?.toLowerCase().includes("updates");
                        const isReturn = item.subject?.toLowerCase().includes("return");

                        return (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={() => onNotificationClick(item)}
                            className="bg-card p-4 rounded-[20px] shadow-sm border border-border/40 cursor-pointer hover:bg-muted/30 transition-colors"
                          >
                            <div className="flex justify-between items-start mb-2.5">
                              <div className="flex items-center gap-1.5">
                                {isUnread && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                                <span className="text-[10px] font-bold text-primary tracking-widest uppercase">
                                  {role}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] font-semibold text-primary">
                                  {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                                </span>
                                {isUnread && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                              </div>
                            </div>

                            <h3 className="text-[15px] font-extrabold text-foreground mb-1 leading-snug pr-4">
                              {item.subject || "Notification"}
                            </h3>
                            <p className="text-[12px] font-bold text-muted-foreground mb-4">
                              Charizard Holo 1999 • {item.dealId ? `TRUST-${item.dealId.substring(0, 4).toUpperCase()}` : "TRUST-1024"}
                            </p>

                            {(isIssue || isReturn) && (
                              <div className="bg-[#F8FAFC] rounded-xl p-3 mb-4 border border-border/40">
                                <div className="flex justify-between items-center mb-1.5">
                                  <span className="text-[12px] text-muted-foreground font-semibold">Buyer:</span>
                                  <div className="flex items-center gap-1">
                                    <span className="text-[12px] font-bold text-foreground">Michael Smith</span>
                                    <ChevronRight className="w-3 h-3 text-muted-foreground" />
                                  </div>
                                </div>
                                {isIssue && (
                                  <div className="flex justify-between items-center">
                                    <span className="text-[12px] text-muted-foreground font-semibold">Reason:</span>
                                    <span className="text-[12px] font-bold text-destructive">Wrong Item Received</span>
                                  </div>
                                )}
                              </div>
                            )}

                            <p className="text-[13px] text-foreground font-medium leading-[1.6]">
                              {item.body}
                            </p>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Pagination */}
        {filteredNotifications.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-between mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={onPrevPage}
              disabled={page <= 1}
              className="rounded-xl"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <span className="text-[13px] font-semibold text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={onNextPage}
              disabled={page >= totalPages}
              className="rounded-xl"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

