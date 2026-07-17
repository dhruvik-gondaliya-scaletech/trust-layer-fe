"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useDealById } from "@/hooks/queries/useDeals";
import {
  useDisputeByDealId,
  useRespondToDispute,
  useEscalateDispute,
  useAcceptDecline,
  useShipReturn,
  useConfirmReturn,
} from "@/hooks/queries/useDisputes";
import { useAuth } from "@/providers/auth-provider";
import { useRole } from "@/providers/role-provider";
import { FRONTEND_ROUTES } from "@/lib/contants";
import { Spinner } from "@/components/ui/spinner";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Role } from "@/types/enums";
import DisputeDetailsView from "../components/DisputeDetailsView";

export default function DisputeDetailsContainer() {
  const params = useParams();
  const router = useRouter();
  const dealId = params.id as string;

  const { user } = useAuth();
  const { role } = useRole();

  // Load the Deal & corresponding Dispute
  const { data: deal, isLoading: isDealLoading, isError: isDealError } = useDealById(dealId);
  const {
    data: dispute,
    isLoading: isDisputeLoading,
    isError: isDisputeError,
    error: disputeError,
  } = useDisputeByDealId(dealId);

  // Mutations
  const respondMutation = useRespondToDispute({
    onSuccess: () => toast.success("Dispute response submitted successfully."),
    onError: (err) => toast.error(err.message || "Failed to submit response."),
  });

  const escalateMutation = useEscalateDispute({
    onSuccess: () => toast.success("Dispute escalated to admin team."),
    onError: (err) => toast.error(err.message || "Failed to escalate dispute."),
  });

  const acceptDeclineMutation = useAcceptDecline({
    onSuccess: () => toast.success("Seller's rejection accepted. Dispute resolved."),
    onError: (err) => toast.error(err.message || "Failed to accept dispute decline."),
  });

  const shipReturnMutation = useShipReturn({
    onSuccess: () => toast.success("Return shipment registered successfully."),
    onError: (err) => toast.error(err.message || "Failed to submit return shipment details."),
  });

  const confirmReturnMutation = useConfirmReturn({
    onSuccess: () => toast.success("Return receipt confirmed. Dispute resolved."),
    onError: (err) => toast.error(err.message || "Failed to confirm return receipt."),
  });

  const isLoading = isDealLoading || isDisputeLoading;
  const isError = isDealError || isDisputeError;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <Spinner className="text-primary size-9" />
        <p className="text-[13px] text-slate-400 font-bold mt-3">Loading dispute details...</p>
      </div>
    );
  }

  // Handle dispute not found (or deal not found)
  if (isError || !deal || !dispute) {
    const errorMsg = disputeError instanceof Error ? disputeError.message : "";
    const isDisputeNotFound = errorMsg.toLowerCase().includes("not found") || isDisputeError;

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-4">
          <AlertCircle size={28} />
        </div>
        <h2 className="text-[18px] font-extrabold tracking-tight">
          {isDisputeNotFound ? "No Active Dispute" : "Error Loading Dispute"}
        </h2>
        <p className="text-[13px] text-slate-500 mt-2 max-w-[320px] mx-auto">
          {isDisputeNotFound
            ? "There is no active dispute raised for this transaction."
            : "We couldn't retrieve the dispute information. Please try again."}
        </p>
        <div className="flex gap-3 mt-6">
          <Button
            onClick={() => router.push(FRONTEND_ROUTES.DASHBOARD)}
            className="h-12 bg-primary hover:bg-primary/95 rounded-[14px] text-white px-5 font-bold text-[14px]"
          >
            Dashboard
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push(FRONTEND_ROUTES.DEAL_DETAILS(dealId))}
            className="h-12 border-slate-200 hover:bg-slate-50 rounded-[14px] px-5 font-bold text-[14px]"
          >
            View Deal Details
          </Button>
        </div>
      </div>
    );
  }

  // Resolve current user's role on this deal
  const isBuyer = role === Role.BUYER || Boolean(user && deal.buyerId === user.id);
  const isSeller = role === Role.SELLER || Boolean(user && deal.sellerId === user.id);

  return (
    <DisputeDetailsView
      deal={deal}
      dispute={dispute}
      isBuyer={isBuyer}
      isSeller={isSeller}
      onRespond={async (dto) => {
        await respondMutation.mutateAsync({ id: dispute.id, dto });
      }}
      isRespondPending={respondMutation.isPending}
      onEscalate={async () => {
        await escalateMutation.mutateAsync(dispute.id);
      }}
      isEscalatePending={escalateMutation.isPending}
      onAcceptDecline={async () => {
        await acceptDeclineMutation.mutateAsync(dispute.id);
      }}
      isAcceptDeclinePending={acceptDeclineMutation.isPending}
      onShipReturn={async (dto) => {
        await shipReturnMutation.mutateAsync({ id: dispute.id, dto });
      }}
      isShipReturnPending={shipReturnMutation.isPending}
      onConfirmReturn={async () => {
        await confirmReturnMutation.mutateAsync(dispute.id);
      }}
      isConfirmReturnPending={confirmReturnMutation.isPending}
      onBack={() => router.back()}
    />
  );
}
