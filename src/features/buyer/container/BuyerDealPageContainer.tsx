"use client";

import { Spinner } from "@/components/ui/spinner";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useDeal, useDeclineDeal } from "@/hooks/queries/useDeals";
import { useAuth } from "@/providers/auth-provider";
import BuyerView from "../components/BuyerView";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FRONTEND_ROUTES } from "@/lib/contants";

export default function BuyerDealPageContainer() {
  const params = useParams();
  const router = useRouter();
  const dealNumber = (params.id || params.dealNumber) as string;

  const { data: deal, isLoading, isError, error } = useDeal(dealNumber);
  const declineMutation = useDeclineDeal({ dealNumber });
  const { isAuthenticated } = useAuth();

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
          {error?.message || "We couldn't retrieve the details for this transaction."}
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

  const handleDeclineDeal = async (reason?: string, explanation?: string) => {
    try {
      await declineMutation.mutateAsync({
        id: deal.id,
        dto: {
          reason: reason || "Declined by buyer",
          explanation: explanation || "",
        },
      });
    } catch (e) {
      console.error("Failed to decline deal", e);
    }
  };

  // Mapping domain types from Deal to BuyerView expected props
  const formattedDeal = {
    id: deal.id,
    dealNumber: deal.dealNumber,
    title: deal.title,
    price: Number(deal.price),
    shippingCost: Number(deal.shippingCost ?? 0),
    platformFeeAmount: Number(deal.platformFeeAmount ?? 0),
    buyerPaysAmount: Number(deal.buyerPaysAmount ?? 0),
    description: deal.description || "",
    condition: deal.condition || "",
    productType: deal.productType,
    orderType: deal.orderType,
    handlingTime: deal.handlingTime || "3",
    carrier: deal.carrier || "USPS",
    shippingType: deal.shippingType || "standard",
    feePayer: deal.feePayer,
    trustScore: deal.trustScore,
    serialNumber: deal.serialNumber || undefined,
    gradedCompany: deal.isGraded ? "PSA" : undefined,
    media: deal.media?.map((m) => ({
      id: m.id,
      url: m.url,
      mimeType: m.mimeType || "image/jpeg",
      sortOrder: m.sortOrder,
    })) || [],
  };

  return (
    <BuyerView
      deal={formattedDeal}
      isLoggedIn={isAuthenticated}
      onFundEscrow={() => router.push(FRONTEND_ROUTES.FUND_ESCROW(deal.dealNumber))}
      onDeclineDeal={handleDeclineDeal}
      onLogin={() => router.push(`${FRONTEND_ROUTES.LOGIN}?redirect=${FRONTEND_ROUTES.BUYER_VIEW(deal.dealNumber)}`)}
    />
  );
}
