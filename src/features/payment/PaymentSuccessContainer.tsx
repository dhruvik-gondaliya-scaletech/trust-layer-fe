"use client";

import { Spinner } from "@/components/ui/spinner";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomActionBar } from "@/components/ui/bottom-action-bar";
import { useQueryClient } from "@tanstack/react-query";
import { useDeal, useDealStatus, dealKeys } from "@/hooks/queries/useDeals";
import { dashboardKeys } from "@/hooks/queries/useDashboardData";
import { SuccessStep } from "@/features/fund-escrow/components/SuccessStep";
import { FRONTEND_ROUTES } from "@/lib/contants";

export default function PaymentSuccessContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dealNumber = searchParams.get("dealNumber") ?? "";

  const [attempts, setAttempts] = useState(0);
  const [isFunded, setIsFunded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const { data: statusData, isError: isStatusError } = useDealStatus(
    dealNumber || undefined,
    {
      enabled: !!dealNumber && !isFunded && attempts < 4 && !hasError,
      refetchInterval: !isFunded && attempts < 4 && !hasError ? 1500 : false,
    }
  );

  useEffect(() => {
    if (isStatusError) {
      setHasError(true);
    }
  }, [isStatusError]);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (statusData) {
      if (statusData.status === "funded") {
        queryClient.invalidateQueries({ queryKey: dealKeys.byDealNumber(dealNumber) });
        queryClient.invalidateQueries({ queryKey: [...dealKeys.all, "my"] });
        queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
        setIsFunded(true);
      } else {
        setAttempts((prev) => prev + 1);
      }
    }
  }, [statusData, dealNumber, queryClient]);

  const hasFailed = (attempts >= 4 && !isFunded) || hasError;

  const { data: deal, isLoading: isDealLoading, isError: isDealError } = useDeal(
    isFunded ? (dealNumber || undefined) : undefined
  );

  if (!dealNumber || hasFailed || isStatusError || isDealError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-4">
          <AlertCircle size={28} />
        </div>
        <h2 className="text-[18px] font-extrabold tracking-tight">Something Went Wrong</h2>
        <p className="text-[13px] text-slate-500 mt-2 max-w-[300px] mx-auto">
          We couldn&apos;t confirm your payment status. If you were charged, please contact support
          with your deal number: {dealNumber || "N/A"}.
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

  const showLoading = (!isFunded && !hasFailed) || (isFunded && isDealLoading) || !deal;

  if (showLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <Spinner className="text-primary size-9" />
        <p className="text-[13px] text-slate-400 font-bold mt-3">Confirming payment...</p>
        <p className="text-[12px] text-slate-400 mt-1">This usually only takes a few seconds.</p>
      </div>
    );
  }

  const formattedDeal = {
    id: deal.id,
    dealNumber: deal.dealNumber,
    title: deal.title,
    price: Number(deal.price),
    shippingCost: Number(deal.shippingCost || 0),
    feePayer: deal.feePayer,
    carrier: deal.carrier || "USPS",
    shippingType: deal.shippingType || "standard",
    condition: deal.condition || "",
    trustScore: deal.trustScore,
    seller: deal.seller
      ? { username: deal.seller.username, profilePhotoUrl: deal.seller.profilePhotoUrl }
      : undefined,
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 pt-10 pb-[140px]">
        <SuccessStep deal={formattedDeal} totalAmount={Number(deal.buyerPaysAmount)} />
      </div>
      <BottomActionBar>
        <Button
          onClick={() => router.push(FRONTEND_ROUTES.DEAL_TIMELINE(dealNumber))}
          className="w-full h-14 text-[16px] font-bold rounded-2xl bg-primary text-white shadow-lg flex items-center justify-center gap-2"
        >
          Go to Dashboard <ArrowRight className="w-5 h-5" />
        </Button>
      </BottomActionBar>
    </div>
  );
}

