"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMyDeals } from "@/hooks/queries/useDeals";
import { useAuth } from "@/providers/auth-provider";
import { useRole } from "@/providers/role-provider";
import { FRONTEND_ROUTES } from "@/lib/contants";
import { DealStatus } from "@/types/enums";
import type { Deal } from "@/types/api.types";
import DisputeListingView from "../components/DisputeListingView";

export default function DisputeListingContainer() {
  const router = useRouter();
  const { user } = useAuth();
  const { role, mounted } = useRole();
  const currentUserId = user?.id || "";

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch all user deals
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMyDeals("all", {
    enabled: mounted && !!user,
  });

  // Flatten and filter for dispute-related statuses
  const disputeDeals = useMemo(() => {
    const allDeals = data?.pages.flatMap((page) => page.items) ?? [];

    // Filter for dispute statuses only
    const disputeStatuses = [
      DealStatus.DISPUTED,
      DealStatus.RETURN_APPROVED,
      DealStatus.RETURN_SHIPPED,
      DealStatus.RETURN_DELIVERED,
      DealStatus.RETURN_COMPLETED,
    ];

    return allDeals.filter((deal) => {
      // 1. Must be a dispute status
      const isDisputeStatus = disputeStatuses.includes(deal.status as DealStatus);
      if (!isDisputeStatus) return false;

      // 2. Local status dropdown filter
      if (statusFilter !== "all" && deal.status !== statusFilter) return false;

      // 3. Local text search matching title, number, etc.
      if (searchTerm.trim() !== "") {
        const query = searchTerm.toLowerCase();
        const matchesTitle = (deal.title || "").toLowerCase().includes(query);
        const matchesNumber = (deal.dealNumber || "").toLowerCase().includes(query);
        return matchesTitle || matchesNumber;
      }

      return true;
    });
  }, [data?.pages, statusFilter, searchTerm]);

  const handleDisputeClick = (deal: Deal) => {
    router.push(FRONTEND_ROUTES.DISPUTE_DETAILS(deal.id));
  };

  return (
    <DisputeListingView
      deals={disputeDeals}
      isLoading={isLoading || !mounted || !user}
      isError={isError}
      error={error}
      currentUserId={currentUserId}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      statusFilter={statusFilter}
      onStatusFilterChange={setStatusFilter}
      onDisputeClick={handleDisputeClick}
      onRetry={refetch}
      hasNextPage={!!hasNextPage}
      fetchNextPage={fetchNextPage}
      isFetchingNextPage={isFetchingNextPage}
      onBack={() => router.push(FRONTEND_ROUTES.DASHBOARD)}
    />
  );
}
