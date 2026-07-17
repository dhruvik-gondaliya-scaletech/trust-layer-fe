"use client";

import React from "react";
import { AlertCircle, RefreshCw, Scale, Search, ShieldAlert, Layers, ChevronRight, Truck, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BackButton } from "@/components/shared/BackButton";
import { InfiniteScroll } from "@/components/shared/InfiniteScroll";
import type { Deal } from "@/types/api.types";
import { cn, formatCurrency } from "@/lib/utils";
import { getStatusBadgeStyle } from "@/utils/deal";
import Image from "next/image";
import { motion } from "framer-motion";

interface DisputeListingViewProps {
  deals: Deal[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  currentUserId: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  onDisputeClick: (deal: Deal) => void;
  onRetry: () => void;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  onBack?: () => void;
}

const DISPUTE_STATUS_OPTIONS = [
  { label: "All Cases", value: "all" },
  { label: "Disputed", value: "disputed" },
  { label: "Return Approved", value: "return_approved" },
  { label: "Return Shipped", value: "return_shipped" },
  { label: "Return Delivered", value: "return_delivered" },
  { label: "Return Completed", value: "return_completed" },
];

const STATUS_DOT_CLASSES: Record<string, string> = {
  all: "bg-slate-400 dark:bg-slate-600",
  disputed: "bg-red-500",
  return_approved: "bg-amber-500",
  return_shipped: "bg-indigo-500",
  return_delivered: "bg-blue-500",
  return_completed: "bg-emerald-500",
};

export default function DisputeListingView({
  deals,
  isLoading,
  isError,
  error,
  currentUserId,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onDisputeClick,
  onRetry,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  onBack,
}: DisputeListingViewProps) {
  return (
    <div className="w-full bg-slate-50 min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div className="flex items-start gap-3">
            <BackButton onClick={onBack} />
            <div className="space-y-1">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
                Dispute Resolution Center
              </h1>
              <p className="text-[14px] text-slate-500 font-medium">
                Track, respond to, and resolve active disputes or return claims.
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
              className="pl-10 h-11 w-full bg-white border-slate-100 rounded-xl text-[14px]"
            />
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
          </div>

          {/* Status Select Dropdown */}
          <div className="w-full sm:w-56">
            <Select
              value={DISPUTE_STATUS_OPTIONS.find((opt) => opt.value === statusFilter)?.label || "All Cases"}
              onValueChange={(label) => {
                const opt = DISPUTE_STATUS_OPTIONS.find((o) => o.label === label);
                if (opt) onStatusFilterChange(opt.value);
              }}
            >
              <SelectTrigger className="w-full h-11 rounded-xl bg-white border-slate-100 font-semibold text-[13px] flex items-center gap-2">
                <span className={cn("w-2 h-2 rounded-full shrink-0", STATUS_DOT_CLASSES[statusFilter] || STATUS_DOT_CLASSES.all)} />
                <SelectValue placeholder="All Cases" />
              </SelectTrigger>
              <SelectContent>
                {DISPUTE_STATUS_OPTIONS.map((opt) => (
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div key={idx} className="bg-white border border-slate-100 rounded-2xl h-[180px] p-5 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="h-3 w-16 bg-slate-200 rounded" />
                    <div className="h-4.5 w-20 bg-slate-200 rounded-full" />
                  </div>
                  <div className="h-4 w-3/4 bg-slate-200 rounded" />
                  <div className="h-3 w-1/2 bg-slate-200 rounded" />
                </div>
                <div className="h-10 w-full bg-slate-200 rounded-xl" />
              </div>
            ))}
          </div>
        ) : isError ? (
          /* Error State */
          <div className="flex flex-col items-center justify-center p-8 text-center bg-white border border-slate-100 rounded-2xl shadow-sm">
            <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
            <h3 className="text-lg font-bold text-slate-800">Failed to Load Disputes</h3>
            <p className="text-[13px] text-slate-500 mt-1 mb-5 max-w-xs">
              {error?.message || "There was an error retrieving your dispute list."}
            </p>
            <Button
              onClick={onRetry}
              className="h-10 rounded-xl bg-primary text-white px-5 font-semibold text-[13px] flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry</span>
            </Button>
          </div>
        ) : deals.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-slate-100 rounded-[28px] shadow-sm">
            <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-4">
              <Scale className="w-8 h-8 opacity-70" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No Disputes Found</h3>
            <p className="text-[13px] text-slate-500 mt-1 max-w-sm">
              Excellent! There are no transactions currently flagged with disputes or return requests.
            </p>
          </div>
        ) : (
          /* Disputes List with InfiniteScroll */
          <InfiniteScroll
            dataLength={deals.length}
            next={fetchNextPage}
            hasMore={hasNextPage}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {deals.map((deal) => {
              const isSeller = deal.sellerId === currentUserId;
              const roleLabel = isSeller ? "Selling" : "Buying";
              const primaryImageUrl = deal.media
                ?.filter((m) => m.mimeType?.startsWith("image/"))
                .sort((a, b) => a.sortOrder - b.sortOrder)[0]?.url ?? null;

              return (
                <motion.div
                  key={deal.id}
                  whileHover={{ y: -4, boxShadow: "0 12px 30px -10px rgba(0,0,0,0.06)" }}
                  onClick={() => onDisputeClick(deal)}
                  className="bg-white border border-slate-100/80 rounded-[24px] p-5 flex flex-col justify-between shadow-soft cursor-pointer hover:border-slate-200 transition-all select-none duration-300"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[11.5px] font-extrabold text-slate-400 uppercase tracking-wider">
                        {deal.dealNumber}
                      </span>
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide border leading-none uppercase shrink-0",
                        getStatusBadgeStyle(deal.status)
                      )}>
                        {deal.status.replace("_", " ")}
                      </span>
                    </div>

                    <div className="flex gap-3">
                      {primaryImageUrl ? (
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-50 shrink-0 border border-slate-100">
                          <Image src={primaryImageUrl} alt={deal.title} fill className="object-cover" unoptimized />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
                          <ShieldAlert className="w-6 h-6 text-rose-500" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-[14.5px] text-slate-800 truncate leading-snug">
                          {deal.title}
                        </h4>
                        <span className="text-[11.5px] font-bold text-slate-400">
                          Role: <span className="text-indigo-500 font-extrabold">{roleLabel}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div>
                      <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block leading-none">
                        Frozen Escrow
                      </span>
                      <span className="font-black text-[16px] text-rose-500 leading-tight">
                        {formatCurrency(deal.buyerPaysAmount)}
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-50 hover:bg-primary hover:text-white flex items-center justify-center transition-all">
                      <ChevronRight className="w-4.5 h-4.5 text-slate-400 hover:text-white" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </InfiniteScroll>
        )}

      </div>
    </div>
  );
}
