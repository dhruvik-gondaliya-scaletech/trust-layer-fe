"use client";

import React from "react";
import { Search, Plus, AlertCircle, RefreshCw, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Deal } from "@/types/api.types";
import { DealListingCard } from "./DealListingCard";
import { cn } from "@/lib/utils";

interface DealListingViewProps {
  deals: Deal[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  currentUserId: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  roleFilter: "all" | "seller" | "buyer";
  onRoleFilterChange: (value: "all" | "seller" | "buyer") => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  onDealClick: (deal: Deal) => void;
  onCreateDealClick: () => void;
  onRetry: () => void;
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
  roleFilter,
  onRoleFilterChange,
  statusFilter,
  onStatusFilterChange,
  onDealClick,
  onCreateDealClick,
  onRetry,
}) => {
  return (
    <div className="w-full bg-background min-h-screen py-6 md:py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
              Deals Directory
            </h1>
            <p className="text-[14px] text-muted-foreground font-medium">
              Manage, monitor, and track your escrow transactions.
            </p>
          </div>
          <Button
            onClick={onCreateDealClick}
            className="sm:w-auto w-full h-12 bg-primary hover:bg-primary/95 text-primary-foreground font-bold rounded-2xl shadow-md shadow-primary/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>Create Deal</span>
          </Button>
        </div>

        {/* Filters and Search Bar Container */}
        <Card className="flex flex-col gap-4 border-border/60 rounded-2xl p-4 shadow-sm space-y-4 mb-6">
          {/* Role Filter Tabs & Status Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Custom Tab list for Role Filter */}
            <div className="bg-slate-100 dark:bg-slate-900 p-1 rounded-xl flex gap-1 self-start sm:self-auto">
              {(["all", "seller", "buyer"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => onRoleFilterChange(r)}
                  className={cn(
                    "px-4 py-2 text-[13px] font-bold rounded-lg uppercase tracking-wider transition-all duration-150 cursor-pointer",
                    roleFilter === r
                      ? "bg-white dark:bg-slate-800 text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {r === "all" ? "All" : r === "seller" ? "Selling" : "Buying"}
                </button>
              ))}
            </div>

            {/* Status Dropdown */}
            <Select
              value={STATUS_OPTIONS.find((opt) => opt.value === statusFilter)?.label || "All Statuses"}
              onValueChange={(label) => {
                const opt = STATUS_OPTIONS.find((o) => o.label === label);
                if (opt) onStatusFilterChange(opt.value);
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px] h-10 rounded-xl font-semibold text-[13px] flex items-center gap-2">
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

          {/* Search Input */}
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/85" />
            <Input
              type="text"
              placeholder="Search by title, deal number..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 h-11 w-full bg-background border-border rounded-xl text-[14px]"
            />
          </div>
        </Card>

        {/* Content Section */}
        {isLoading ? (
          /* Skeleton Loader */
          <div className="flex flex-col gap-3 animate-pulse">
            {[1, 2, 3, 4].map((idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-card border border-border/40 rounded-2xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-muted/65" />
                  <div className="flex flex-col gap-2">
                    <div className="h-4 w-40 bg-muted/70 rounded-md" />
                    <div className="h-3 w-28 bg-muted/50 rounded-md" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-6 w-20 bg-muted/60 rounded-full" />
                  <div className="h-4 w-16 bg-muted/70 rounded-md" />
                </div>
              </div>
            ))}
          </div>
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
            <Button
              onClick={onCreateDealClick}
              className="h-11 px-6 font-bold rounded-xl text-[13px] cursor-pointer"
            >
              Start Your First Deal
            </Button>
          </div>
        ) : (
          /* Deals List */
          <div className="flex flex-col gap-3">
            {deals.map((deal) => (
              <DealListingCard
                key={deal.id}
                deal={deal}
                currentUserId={currentUserId}
                onClick={onDealClick}
              />
            ))}
          </div>
        )}
        
      </div>
    </div>
  );
};
