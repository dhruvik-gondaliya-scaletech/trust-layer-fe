"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDeal } from "@/hooks/queries/useDeals";
import DisputeFlow from "./DisputeFlow";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DisputeFormInput } from "@/lib/validations/dispute";
import { FRONTEND_ROUTES } from "@/lib/contants";
import { toast } from "sonner";

export default function DisputeFlowContainer() {
  const params = useParams();
  const router = useRouter();
  const dealNumber = (params.id || params.dealNumber) as string;

  const { data: deal, isLoading, isError } = useDeal(dealNumber);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDisputeSubmit = async (data: DisputeFormInput & { files: File[] }) => {
    if (!deal) return;
    try {
      setIsSubmitting(true);
      // Simulate submission delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast.success("Dispute filed successfully.");
      setIsSubmitting(false);
      // Redirect to the timeline or dashboard
      router.push(FRONTEND_ROUTES.DEAL_TIMELINE(deal.dealNumber));
    } catch (e) {
      console.error("Dispute submission failed", e);
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
          We could not load the deal information for disputing.
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

  return (
    <DisputeFlow
      onSubmit={handleDisputeSubmit}
      isSubmitting={isSubmitting}
      onBack={() => router.back()}
    />
  );
}
