"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { useDealById, useUploadDealMedia } from "@/hooks/queries/useDeals";
import { useCreateDispute } from "@/hooks/queries/useDisputes";
import { FRONTEND_ROUTES } from "@/lib/contants";
import CreateDisputeView from "../components/CreateDisputeView";
import { Spinner } from "@/components/ui/spinner";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { DisputeFormInput } from "@/lib/validations/dispute";
import { ProofType } from "@/types/enums";

export default function CreateDisputeContainer() {
  const router = useRouter();
  const params = useParams();
  const dealId = params.id as string;

  // Load the deal by UUID ID
  const { data: deal, isLoading, isError } = useDealById(dealId);

  // S3 upload mutation for dispute evidence files
  const uploadMediaMutation = useUploadDealMedia({
    onError: (err) => {
      toast.error("Failed to upload evidence: " + err.message);
    },
  });

  // Setup the create dispute mutation
  const createDisputeMutation = useCreateDispute({
    onSuccess: () => {
      toast.success("Dispute filed successfully!");
      router.push(FRONTEND_ROUTES.DISPUTE_DETAILS(dealId));
    },
    onError: (err) => {
      toast.error(`Failed to file dispute: ${err.message}`);
    },
  });

  const isSubmitting = uploadMediaMutation.isPending || createDisputeMutation.isPending;

  const handleDisputeSubmit = async (data: DisputeFormInput & { files: File[] }) => {
    if (!deal) return;

    try {
      // 1. Upload each evidence file with ProofType.DISPUTE_EVIDENCE before creating the dispute
      if (data.files.length > 0) {
        await Promise.all(
          data.files.map((file, index) =>
            uploadMediaMutation.mutateAsync({
              dealId: deal.id,
              file,
              sortOrder: index,
              proofType: ProofType.DISPUTE_EVIDENCE,
            })
          )
        );
      }

      // 2. Create the dispute record
      await createDisputeMutation.mutateAsync({
        dealId: deal.id,
        reason: data.reason,
        explanation: data.notes,
      });
    } catch (e) {
      console.error("Dispute filing error", e);
    }
  };

  const handleBack = () => {
    if (deal) {
      router.push(FRONTEND_ROUTES.DEAL_DETAILS(deal.dealNumber));
    } else {
      router.push(FRONTEND_ROUTES.DASHBOARD);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-dvh bg-background flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex items-center justify-center">
            <Spinner className="w-10 h-10 text-primary" strokeWidth={2.5} />
          </div>
          <p className="text-sm font-semibold text-muted-foreground animate-pulse">
            Loading deal information...
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
          The deal could not be loaded or the ID is invalid.
        </p>
        <Button
          onClick={() => router.push(FRONTEND_ROUTES.DASHBOARD)}
          className="w-full rounded-2xl h-12"
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <CreateDisputeView
      onSubmit={handleDisputeSubmit}
      isSubmitting={isSubmitting}
      onBack={handleBack}
    />
  );
}
