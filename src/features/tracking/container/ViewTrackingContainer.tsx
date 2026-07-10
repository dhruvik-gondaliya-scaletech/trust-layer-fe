"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { useDeal, useDealById, useConfirmDelivery, dealKeys } from "@/hooks/queries/useDeals";
import { useAuth } from "@/providers/auth-provider";
import { useRole } from "@/providers/role-provider";
import { Role } from "@/types/enums";
import ViewTracking from "../components/ViewTracking";
import { toast } from "sonner";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FRONTEND_ROUTES } from "@/lib/contants";
import { useQueryClient } from "@tanstack/react-query";

export default function ViewTrackingContainer() {
  const router = useRouter();
  const { user } = useAuth();
  const { role } = useRole();
  const params = useParams();
  const queryClient = useQueryClient();

  const idParam = params.id as string;
  const isDealNumber = idParam?.startsWith("TRUST-");

  // Load deal details by either dealNumber or UUID id
  const {
    data: dealByNo,
    isLoading: loadingNo,
    isError: errorNo,
  } = useDeal(isDealNumber ? idParam : undefined);

  const {
    data: dealById,
    isLoading: loadingId,
    isError: errorId,
  } = useDealById(!isDealNumber ? idParam : undefined);

  const deal = isDealNumber ? dealByNo : dealById;
  const isLoading = isDealNumber ? loadingNo : loadingId;
  const isError = isDealNumber ? errorNo : errorId;

  // Confirm delivery mutation
  const confirmDeliveryMutation = useConfirmDelivery({
    dealId: deal?.id ?? "",
    onSuccess: () => {
      toast.success("Delivery confirmed — funds released to the seller!");
      if (deal) {
        queryClient.invalidateQueries({ queryKey: dealKeys.byId(deal.id) });
        queryClient.invalidateQueries({ queryKey: dealKeys.byDealNumber(deal.dealNumber) });
      }
      router.push(FRONTEND_ROUTES.DEAL_TIMELINE(deal?.dealNumber ?? ""));
    },
    onError: (err) => {
      toast.error("Failed to confirm delivery: " + err.message);
    },
  });

  const handleConfirmDelivery = async () => {
    if (!deal) return;
    try {
      await confirmDeliveryMutation.mutateAsync(deal.id);
    } catch (e) {
      console.error(e);
    }
  };

  const handleReportIssue = () => {
    if (!deal) return;
    router.push(FRONTEND_ROUTES.DISPUTE_FLOW(deal.dealNumber));
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
            Fetching tracking details...
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
          Failed to load tracking
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          This tracking page link is invalid or the deal details could not be loaded.
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

  const isSeller = role === Role.SELLER || Boolean(user && deal.sellerId === user.id);
  const isBuyer = role === Role.BUYER || Boolean(user && deal.buyerId === user.id);

  return (
    <ViewTracking
      deal={deal}
      isBuyer={isBuyer}
      isSeller={isSeller}
      onBack={() => router.push(FRONTEND_ROUTES.DEAL_TIMELINE(deal.dealNumber))}
      onConfirmDelivery={handleConfirmDelivery}
      onReportIssue={handleReportIssue}
      isConfirming={confirmDeliveryMutation.isPending}
    />
  );
}
