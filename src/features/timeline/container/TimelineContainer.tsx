"use client";

import { useRouter, useParams } from "next/navigation";
import { useDeal, useShipDeal, useConfirmDelivery } from "@/hooks/queries/useDeals";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, AlertCircle } from "lucide-react";
import { FRONTEND_ROUTES } from "@/lib/contants";
import Timeline from "../components/Timeline";

export default function TimelineContainer() {
  const router = useRouter();
  const params = useParams();
  const dealNumber = params.id as string;

  const { user } = useAuth();
  const { data: deal, isLoading, isError } = useDeal(dealNumber);

  const shipMutation = useShipDeal({
    dealNumber: dealNumber,
    onSuccess: () => {
      toast.success("Item marked as shipped!");
    },
    onError: (err) => {
      toast.error("Failed to mark as shipped: " + err.message);
    },
  });

  const confirmDeliveryMutation = useConfirmDelivery({
    dealNumber: dealNumber,
    onSuccess: () => {
      toast.success("Delivery confirmed and funds released!");
    },
    onError: (err) => {
      toast.error("Failed to confirm delivery: " + err.message);
    },
  });

  const handleShip = async () => {
    if (!deal) return;
    try {
      await shipMutation.mutateAsync({
        id: deal.id,
        dto: {
          carrier: "USPS",
          shippingType: "priority",
          trackingNumber: "940011189956" + Math.floor(Math.random() * 10000000000),
          estimatedDeliveryAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          isInsured: true,
          notes: "USPS Priority Package label created.",
        },
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleConfirmDelivery = async () => {
    if (!deal) return;
    try {
      await confirmDeliveryMutation.mutateAsync(deal.id);
    } catch (e) {
      console.error(e);
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
            Fetching deal timeline details...
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

  const isSeller = Boolean(user && deal.sellerId === user.id);
  const isBuyer = Boolean(user && deal.buyerId === user.id);

  return (
    <Timeline
      deal={{
        ...deal,
        serialNumber: deal.serialNumber ?? undefined,
        handlingTime: deal.handlingTime ?? undefined,
        carrier: deal.carrier ?? undefined,
        shippingType: deal.shippingType ?? undefined,
      }}
      currentStatus={deal.status}
      isSeller={isSeller}
      isBuyer={isBuyer}
      onBack={() => router.push(FRONTEND_ROUTES.DASHBOARD)}
      onFundEscrow={() => router.push(FRONTEND_ROUTES.FUND_ESCROW(deal.dealNumber))}
      onShip={handleShip}
      onConfirmDelivery={handleConfirmDelivery}
      onFileDispute={() => router.push(FRONTEND_ROUTES.DISPUTE_FLOW(deal.dealNumber))}
      onReviewSeller={() => router.push(FRONTEND_ROUTES.REVIEW_SELLER(deal.dealNumber))}
    />
  );
}
