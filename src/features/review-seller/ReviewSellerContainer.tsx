"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDeal } from "@/hooks/queries/useDeals";
import ReviewSeller from "./ReviewSeller";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FRONTEND_ROUTES } from "@/lib/contants";
import { toast } from "sonner";

export default function ReviewSellerContainer() {
  const params = useParams();
  const router = useRouter();
  const dealNumber = (params.id || params.dealNumber) as string;

  const { data: deal, isLoading, isError } = useDeal(dealNumber);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReviewSubmit = async (data: { rating: number; comment?: string }) => {
    if (!deal) return;
    try {
      setIsSubmitting(true);
      // Simulate submission delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast.success("Review submitted successfully.");
      setIsSubmitting(false);
      // Redirect back to dashboard or timeline
      router.push(FRONTEND_ROUTES.DEAL_TIMELINE(deal.dealNumber));
    } catch (e) {
      console.error("Seller review submission failed", e);
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <Loader2 size={36} className="text-primary animate-spin" />
        <p className="text-[13px] text-slate-400 font-bold mt-3">Loading deal details...</p>
      </div>
    );
  }

  if (isError || !deal) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-4">
          <AlertCircle size={28} />
        </div>
        <h2 className="text-[18px] font-extrabold tracking-tight">Deal Not Found</h2>
        <p className="text-[13px] text-slate-500 mt-2 max-w-[280px] mx-auto">
          We could not load the deal information to write a seller review.
        </p>
        <Button
          onClick={() => router.push(FRONTEND_ROUTES.DASHBOARD)}
          className="mt-6 h-12 bg-primary hover:bg-primary/95 rounded-[14px] text-white px-6 font-bold text-[14px]"
        >
          Return to Dashboard
        </Button>
      </div>
    );
  }

  // Derive seller info safely
  const sellerName = deal.seller
    ? [deal.seller.firstName, deal.seller.lastName].filter(Boolean).join(" ") || deal.seller.username || "Seller"
    : "Seller";
  const sellerUsername = deal.seller?.username || "seller";
  const sellerAvatarUrl = deal.seller?.profilePhotoUrl || null;
  const isVerified = Boolean(deal.seller?.emailVerifiedAt || deal.seller?.phoneVerifiedAt);
  const sellerRating = (deal.seller as { rating?: number })?.rating || 4.8;
  const dealTitle = deal.title || "Deal Transaction";

  return (
    <ReviewSeller
      sellerName={sellerName}
      sellerUsername={sellerUsername}
      sellerAvatarUrl={sellerAvatarUrl}
      isVerified={isVerified}
      sellerRating={sellerRating}
      dealTitle={dealTitle}
      onSubmit={handleReviewSubmit}
      isSubmitting={isSubmitting}
      onBack={() => router.back()}
    />
  );
}
