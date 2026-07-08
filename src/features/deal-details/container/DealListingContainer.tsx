"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useMyDeals } from "@/hooks/queries/useDeals";
import { useAuth } from "@/providers/auth-provider";
import { FRONTEND_ROUTES } from "@/lib/contants";
import { DealListingView } from "../components/DealListingView";
import type { Deal } from "@/types/api.types";

export default function DealListingContainer() {
  const router = useRouter();
  const { user } = useAuth();
  const currentUserId = user?.id || "";

  // ─── State Management ───────────────────────────────────────────────────────
  const [roleFilter, setRoleFilter] = useState<"all" | "seller" | "buyer">("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // ─── Query Hook ────────────────────────────────────────────────────────────
  // Pass the selected role filter to the API query so server-side filtering is utilized.
  const { data: deals = [], isLoading, isError, error, refetch } = useMyDeals(roleFilter);

  // ─── In-Memory Search & Status Filtering ────────────────────────────────────
  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      // 1. Status Filter
      if (statusFilter !== "all" && deal.status !== statusFilter) {
        return false;
      }

      // 2. Search Filter (matches title, deal number, or product type)
      if (searchTerm.trim() !== "") {
        const query = searchTerm.toLowerCase();
        const matchesTitle = (deal.title || "").toLowerCase().includes(query);
        const matchesNumber = (deal.dealNumber || "").toLowerCase().includes(query);
        const matchesProduct = (deal.productType || "").toLowerCase().includes(query);
        return matchesTitle || matchesNumber || matchesProduct;
      }

      return true;
    });
  }, [deals, statusFilter, searchTerm]);

  // ─── Action Handlers ────────────────────────────────────────────────────────
  const handleDealClick = (deal: Deal) => {
    router.push(FRONTEND_ROUTES.DEAL_DETAILS(deal.id));
  };

  const handleCreateDealClick = () => {
    router.push(FRONTEND_ROUTES.CREATE_DEAL);
  };

  return (
    <DealListingView
      deals={filteredDeals}
      isLoading={isLoading}
      isError={isError}
      error={error}
      currentUserId={currentUserId}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      roleFilter={roleFilter}
      onRoleFilterChange={setRoleFilter}
      statusFilter={statusFilter}
      onStatusFilterChange={setStatusFilter}
      onDealClick={handleDealClick}
      onCreateDealClick={handleCreateDealClick}
      onRetry={refetch}
    />
  );
}
