"use client";

import { Spinner } from "@/components/ui/spinner";
import { useParams, useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDealById, useConfirmDelivery, usePublishDeal, useDeleteDeal, dealKeys } from "@/hooks/queries/useDeals";
import { useAuth } from "@/providers/auth-provider";
import { useRole } from "@/providers/role-provider";
import { FRONTEND_ROUTES } from "@/lib/contants";
import { toast } from "sonner";
import { DealDetailsView, type DealDetailsAction } from "../components/DealDetailsView";
import { Role } from "@/types/enums";
import { useQueryClient } from "@tanstack/react-query";

export default function DealDetailsContainer() {
  const params = useParams();
  const router = useRouter();
  const dealId = params.id as string;
  const queryClient = useQueryClient();

  const { data: deal, isLoading, isError } = useDealById(dealId);

  const { user } = useAuth();
  const { role } = useRole();

  const confirmDeliveryMutation = useConfirmDelivery({
    dealId: deal?.id ?? "",
    onSuccess: () => {
      if (deal) {
        queryClient.invalidateQueries({ queryKey: dealKeys.byId(deal.id) });
      }
      toast.success("Delivery confirmed — funds released to the seller.");
    },
    onError: (error) => toast.error(error.message || "Failed to confirm delivery."),
  });

  const publishDealMutation = usePublishDeal({
    dealNumber: deal?.dealNumber,
    onSuccess: () => {
      if (deal) {
        queryClient.invalidateQueries({ queryKey: dealKeys.byId(deal.id) });
      }
      toast.success("Deal published successfully!");
    },
    onError: (error) => toast.error(error.message || "Failed to publish deal."),
  });

  const deleteDealMutation = useDeleteDeal({
    onSuccess: () => {
      toast.success("Deal deleted successfully!");
      router.push(FRONTEND_ROUTES.DASHBOARD);
    },
    onError: (error) => toast.error(error.message || "Failed to delete deal."),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <Spinner className="text-primary size-9" />
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
          We couldn&apos;t retrieve the details for this transaction.
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

  const isBuyer = role === Role.BUYER || Boolean(user && deal.buyerId === user.id);
  const isSeller = role === Role.SELLER || Boolean(user && deal.sellerId === user.id);

  let action: DealDetailsAction = null;
  if (isBuyer && (deal.status === "shipped" || deal.status === "delivered")) {
    action = { type: "confirm-delivery", isPending: confirmDeliveryMutation.isPending };
  } else if (isBuyer && (deal.status === "closed" || (deal.status as string) === "completed")) {
    action = { type: "review" };
  }

  const handlePrimaryAction = async () => {
    if (action?.type === "confirm-delivery") {
      try {
        await confirmDeliveryMutation.mutateAsync(deal.id);
      } catch (e) {
        console.error("Failed to confirm delivery", e);
      }
    } else if (action?.type === "review") {
      router.push(FRONTEND_ROUTES.REVIEW_SELLER(deal.dealNumber));
    }
  };

  return (
    <DealDetailsView
      deal={deal}
      onBack={() => router.back()}
      action={action}
      onPrimaryAction={handlePrimaryAction}
      onReportIssue={
        action?.type === "confirm-delivery" ? () => router.push(FRONTEND_ROUTES.DISPUTE_FLOW(deal.dealNumber)) : undefined
      }
      onPublish={() => publishDealMutation.mutate(deal.id)}
      isPublishPending={publishDealMutation.isPending}
      onDelete={() => deleteDealMutation.mutate(deal.id)}
      isDeletePending={deleteDealMutation.isPending}
    />
  );
}
