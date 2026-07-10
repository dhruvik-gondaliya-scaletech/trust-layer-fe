"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useDealById, useShipDeal, useUploadDealMedia } from "@/hooks/queries/useDeals";
import AddTracking from "../components/AddTracking";
import { TrackingFormInput } from "@/lib/validations/tracking";
import { ProofType } from "@/types/enums";
import { toast } from "sonner";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FRONTEND_ROUTES } from "@/lib/contants";

export default function AddTrackingContainer() {
  const router = useRouter();
  const params = useParams();
  const dealId = params.id as string;

  const { data: deal, isLoading, isError } = useDealById(dealId);

  const shipMutation = useShipDeal({
    dealId,
    onSuccess: () => {
      toast.success("Tracking details uploaded successfully!");
      router.push(FRONTEND_ROUTES.DEAL_TIMELINE(dealId));
    },
    onError: (err) => {
      toast.error("Failed to mark as shipped: " + err.message);
    },
  });

  const uploadMediaMutation = useUploadDealMedia({
    onError: (err) => {
      toast.error("Failed to upload drop-off receipt: " + err.message);
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTrackingSubmit = async (
    data: TrackingFormInput & { receiptFile: File | null }
  ) => {
    if (!deal) return;

    try {
      setIsSubmitting(true);

      // 1. If there's a receipt file, upload it first
      if (data.receiptFile) {
        await uploadMediaMutation.mutateAsync({
          dealId: deal.id,
          file: data.receiptFile,
          sortOrder: 1,
          proofType: ProofType.DROP_OFF_RECEIPT,
        });
      }

      // 2. Submit the shipping details
      const isoDate = new Date(data.estimatedDeliveryAt).toISOString();
      await shipMutation.mutateAsync({
        id: deal.id,
        dto: {
          carrier: data.carrier === "Other" ? (data.customCarrier || "") : data.carrier,
          shippingType: "standard", // default shipping type
          trackingNumber: data.trackingNumber,
          estimatedDeliveryAt: isoDate,
          isInsured: data.isInsured,
          notes: data.notes || undefined,
          trackingUrl: data.carrier === "Other" ? data.trackingUrl : undefined,
        },
      });
    } catch (e) {
      console.error("Submission failed", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-dvh bg-background flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-primary animate-spin" strokeWidth={2.5} />
            <div className="absolute w-2 h-2 bg-primary rounded-full animate-ping" />
          </div>
          <p className="text-sm font-semibold text-muted-foreground animate-pulse">
            Loading deal details...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !deal) {
    return (
      <div className="w-full min-h-dvh bg-background flex flex-col items-center justify-center p-6 text-center max-w-sm mx-auto select-none">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h3 className="text-lg font-extrabold text-foreground tracking-tight mb-2">
          Failed to load deal
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          This deal invitation link is invalid or the deal could not be fetched.
        </p>
        <Button onClick={() => router.push(FRONTEND_ROUTES.DASHBOARD)} className="w-full rounded-2xl h-12">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <AddTracking
      onSubmit={handleTrackingSubmit}
      isSubmitting={isSubmitting}
      onBack={() => router.push(FRONTEND_ROUTES.DEAL_TIMELINE(dealId))}
    />
  );
}
