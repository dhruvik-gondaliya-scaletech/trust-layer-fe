"use client";

import React from "react";
import { AlertCircle, RefreshCw, Layers, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Deal } from "@/types/api.types";
import { DealListingCard } from "./DealListingCard";
import { cn } from "@/lib/utils";
import { BackButton } from "@/components/shared/BackButton";
import { InfiniteScroll } from "@/components/shared/InfiniteScroll";

interface DealListingViewProps {
  deals: Deal[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  currentUserId: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  onDealClick: (deal: Deal) => void;
  onRetry: () => void;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
}

const STATUS_OPTIONS = [
  { label: "All Statuses", value: "all" },
  { label: "Draft", value: "draft" },
  { label: "Open", value: "open" },
  { label: "Funded", value: "funded" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Disputed", value: "disputed" },
  { label: "Completed", value: "closed" },
  { label: "Cancelled", value: "cancelled" },
];

const STATUS_DOT_CLASSES: Record<string, string> = {
  all: "bg-slate-400 dark:bg-slate-600",
  draft: "bg-slate-500",
  open: "bg-cyan-500",
  funded: "bg-indigo-500",
  shipped: "bg-purple-500",
  delivered: "bg-amber-500",
  disputed: "bg-red-500",
  closed: "bg-emerald-500",
  cancelled: "bg-slate-500",
};

export const DealListingView: React.FC<DealListingViewProps> = ({
  deals,
  isLoading,
  isError,
  error,
  currentUserId,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onDealClick,
  onRetry,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
}) => {
  return (
    <div className="w-full bg-background min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div className="flex items-start gap-3">
            <BackButton />
            <div className="space-y-1">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
                Deals Directory
              </h1>
              <p className="text-[14px] text-muted-foreground font-medium">
                Manage, monitor, and track your secure transactions.
              </p>
            </div>
          </div>
        </div>

        {/* Filters and Search Bar Container */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search Input */}
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search by title, deal number..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 h-11 w-full bg-background border-border rounded-xl text-[14px]"
            />
          </div>

          {/* Status Select Dropdown */}
          <div className="w-full sm:w-48">
            <Select
              value={STATUS_OPTIONS.find((opt) => opt.value === statusFilter)?.label || "All Statuses"}
              onValueChange={(label) => {
                const opt = STATUS_OPTIONS.find((o) => o.label === label);
                if (opt) onStatusFilterChange(opt.value);
              }}
            >
              <SelectTrigger className="w-full h-11 rounded-xl font-semibold text-[13px] flex items-center gap-2">
                <span className={cn("w-2 h-2 rounded-full shrink-0", STATUS_DOT_CLASSES[statusFilter] || STATUS_DOT_CLASSES.all)} />
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.label} className="text-[13px] flex items-center gap-2">
                    <span className={cn("w-2 h-2 rounded-full shrink-0", STATUS_DOT_CLASSES[opt.value] || STATUS_DOT_CLASSES.all)} />
                    <span>{opt.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Content Section */}
        {isLoading ? (
          /* Skeleton Loader */
          <>
            {/* Desktop Skeletons */}
            <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 xl:gap-6 animate-pulse">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
                <div
                  key={idx}
                  className="bg-card border border-border/40 rounded-2xl h-[290px] flex flex-col overflow-hidden shadow-xs"
                >
                  {/* Image area skeleton */}
                  <div className="w-full h-[150px] bg-muted/40 animate-pulse" />
                  {/* Content area skeleton */}
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="h-3 w-16 bg-muted/50 rounded" />
                        <div className="h-2 w-2 bg-muted/50 rounded-full" />
                      </div>
                      <div className="h-4 w-3/4 bg-muted/70 rounded" />
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-border/30">
                      <div className="space-y-1">
                        <div className="h-2.5 w-10 bg-muted/40 rounded" />
                        <div className="h-4.5 w-20 bg-muted/70 rounded" />
                      </div>
                      <div className="w-8 h-8 rounded-full bg-muted/40" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Mobile Skeletons */}
            <div className="flex sm:hidden flex-col gap-3 animate-pulse">
              {[1, 2, 3, 4, 5].map((idx) => (
                <div
                  key={idx}
                  className="bg-card border border-border/40 rounded-2xl h-[76px] px-4 flex items-center justify-between shadow-xs"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 bg-muted/40 rounded-full shrink-0 animate-pulse" />
                    <div className="flex flex-col gap-2">
                      <div className="h-4 w-32 bg-muted/50 rounded animate-pulse" />
                      <div className="flex items-center gap-2">
                        <div className="h-3.5 w-12 bg-muted/45 rounded animate-pulse" />
                        <div className="h-3.5 w-16 bg-muted/45 rounded-full animate-pulse" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-16 bg-muted/50 rounded animate-pulse" />
                    <div className="w-4 h-4 bg-muted/40 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : isError ? (
          /* Error State */
          <div className="flex flex-col items-center justify-center p-8 text-center bg-card border border-border/60 rounded-2xl shadow-sm">
            <AlertCircle className="w-12 h-12 text-destructive mb-3" />
            <h3 className="text-lg font-bold text-foreground">Failed to Load Deals</h3>
            <p className="text-[13px] text-muted-foreground mt-1 mb-5 max-w-xs">
              {error?.message || "There was an error retrieving your transaction list."}
            </p>
            <Button
              onClick={onRetry}
              className="h-10 rounded-xl px-5 font-semibold text-[13px] flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry</span>
            </Button>
          </div>
        ) : deals.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center p-12 text-center bg-card border border-border/60 rounded-2xl shadow-sm">
            <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-900 border border-border flex items-center justify-center text-muted-foreground mb-4">
              <Layers className="w-8 h-8 opacity-70" />
            </div>
            <h3 className="text-lg font-bold text-foreground">No Deals Found</h3>
            <p className="text-[13px] text-muted-foreground mt-1 mb-6 max-w-sm">
              We couldn&apos;t find any deals matching your search criteria or selected filters.
            </p>
          </div>
        ) : (
          /* Deals List with InfiniteScroll */
          <InfiniteScroll
            dataLength={deals.length}
            next={fetchNextPage}
            hasMore={hasNextPage}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 xl:gap-6"
          >
            {deals.map((deal) => (
              <DealListingCard
                key={deal.id}
                deal={deal}
                currentUserId={currentUserId}
                onClick={onDealClick}
              />
            ))}
          </InfiniteScroll>
        )}

      </div>
    </div>
  );
};
