"use client";

import React, { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useDeal } from "@/hooks/queries/useDeals";
import { useWallet } from "@/hooks/queries/useWallet";
import {
  useAddresses,
  useAddAddress,
  useSetDefaultAddress,
  useDeleteAddress,
} from "@/hooks/queries/useAddresses";
import FundEscrowWizard from "../components/FundEscrowWizard";
import AddShippingAddress from "../../add-shipping-address/AddShippingAddress";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddressFormInput } from "@/lib/validations/address";
import { FRONTEND_ROUTES } from "@/lib/contants";
import { useCreateCheckoutSession } from "@/hooks/queries/usePayments";
import { toast } from "sonner";
import type { PaymentMethodType } from "@/types/fund-escrow.types";

export default function FundEscrowContainer() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dealNumber = (params.id || params.dealNumber) as string;
  const { data: deal, isLoading: dealLoading, isError: dealError } = useDeal(dealNumber);
  const { data: addresses = [], isLoading: addressesLoading } = useAddresses();
  const { data: wallet, isLoading: walletLoading } = useWallet();

  const addAddressMutation = useAddAddress();
  const setDefaultAddressMutation = useSetDefaultAddress();
  const deleteAddressMutation = useDeleteAddress();

  const createCheckoutSessionMutation = useCreateCheckoutSession();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Land back on the payment step when the buyer bounces back from the
  // /payment/cancel page (linked as `?step=payment`) instead of restarting
  // the wizard from address selection.
  const [step, setStep] = useState(searchParams.get("step") === "payment" ? 3 : 1);

  // Sub-views: "wizard" | "select_address" | "add_address"
  const [subView, setSubView] = useState<"wizard" | "select_address" | "add_address">("wizard");

  // Selected Address State
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  // Dynamically compute active step and address id to avoid effect-driven state cascades
  const activeStep = step;
  const defaultAddrId = addresses.find((a) => a.isDefault)?.id || addresses[0]?.id || null;
  const activeAddressId = selectedAddressId || defaultAddrId;

  if (dealLoading || addressesLoading || walletLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <Loader2 size={36} className="text-primary animate-spin" />
        <p className="text-[13px] text-slate-400 font-bold mt-3">Preparing secure environment...</p>
      </div>
    );
  }

  if (dealError || !deal) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-4">
          <AlertCircle size={28} />
        </div>
        <h2 className="text-[18px] font-extrabold tracking-tight">Deal Invalid</h2>
        <p className="text-[13px] text-slate-500 mt-2 max-w-[280px] mx-auto">
          We could not load the escrow transaction details.
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

  // Find the currently selected address object
  const selectedAddress = addresses.find((a) => a.id === activeAddressId);

  // Submit Payment / Fund Escrow
  const handleSubmitPayment = async (paymentMethod: PaymentMethodType) => {
    if (!selectedAddress) {
      toast.error("Please select or add a shipping address first.");
      return;
    }

    try {
      const { url } = await createCheckoutSessionMutation.mutateAsync({
        dealId: deal.id,
        addressId: selectedAddress.id,
        paymentMethod,
      });

      if (url) {
        setIsRedirecting(true);
        window.location.href = url;
      } else {
        toast.success("Collateral deposited from wallet!");
        setStep(4);
      }
    } catch (e: any) {
      console.error("Failed to submit payment", e);
      toast.error(e.message || "Payment failed. Please try again.");
    }
  };

  // Add new address handler
  const handleAddAddressSubmit = async (data: AddressFormInput & { isDefault?: boolean }) => {
    try {
      await addAddressMutation.mutateAsync({
        type: data.type,
        customLabel: data.customLabel,
        name: data.name,
        street: data.street,
        apt: data.apt,
        zip: data.zip,
        city: data.city,
        state: data.state,
        country: data.country,
        alternatePhone: data.alternatePhone,
      });

      // If user checked "Set as default", set it
      if (data.isDefault) {
        // The mutation will invalidate queries, let's find it or set the next selected
      }

      setSubView("wizard");
    } catch (e) {
      console.error("Failed to add address", e);
    }
  };

  // Format deal structure for wizard UI
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
    seller: deal.seller ? {
      username: deal.seller.username,
      profilePhotoUrl: deal.seller.profilePhotoUrl,
    } : undefined,
  };

  if (subView === "add_address") {
    return (
      <AddShippingAddress
        onSubmit={handleAddAddressSubmit}
        isSubmitting={addAddressMutation.isPending}
        onBack={() => setSubView("wizard")}
      />
    );
  }

  return (
    <FundEscrowWizard
      deal={formattedDeal}
      currentStep={activeStep}
      setStep={setStep}
      selectedAddress={selectedAddress}
      addresses={addresses}
      wallet={wallet}
      onSelectAddress={(id) => setSelectedAddressId(id)}
      onSetDefaultAddress={async (id) => {
        await setDefaultAddressMutation.mutateAsync(id);
      }}
      onDeleteAddress={async (id) => {
        await deleteAddressMutation.mutateAsync(id);
        if (selectedAddressId === id) {
          setSelectedAddressId(null);
        }
      }}
      onAddAddressClick={() => setSubView("add_address")}
      onSubmitPayment={handleSubmitPayment}
      isSubmittingPayment={
        createCheckoutSessionMutation.isPending || isRedirecting
      }
      onGoToTimeline={() => router.push(FRONTEND_ROUTES.DEAL_TIMELINE(deal.dealNumber))}
    />
  );
}
