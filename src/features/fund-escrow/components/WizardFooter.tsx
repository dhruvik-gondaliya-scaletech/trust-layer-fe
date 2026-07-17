"use client";

import { Spinner } from "@/components/ui/spinner";
import { ArrowRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomActionBar } from "@/components/ui/bottom-action-bar";
import type { ShippingAddress } from "@/types/address.types";
import type { BillingAddress, CheckoutSubView, PaymentMethodType } from "@/types/fund-escrow.types";

interface WizardFooterProps {
  currentStep: number;

  // Step 1
  selectedAddress: ShippingAddress | undefined;
  onProceedToTerms: () => void;

  // Step 2
  allAgreed: boolean;
  onProceedToPayment: () => void;

  // Step 3
  checkoutSubView: CheckoutSubView;
  paymentMethod: PaymentMethodType;
  savedBillingAddress: BillingAddress | null;
  isSufficient: boolean;
  isSubmittingPayment: boolean;
  onSubmitPayment: (paymentMethod: PaymentMethodType) => Promise<void>;
  onSaveBillingAddress: () => void;
  isBillingFormValid: boolean;

  // Step 4
  onGoToDetails: () => void;
}

export function WizardFooter({
  currentStep,
  selectedAddress,
  onProceedToTerms,
  allAgreed,
  onProceedToPayment,
  checkoutSubView,
  paymentMethod,
  savedBillingAddress,
  isSufficient,
  isSubmittingPayment,
  onSubmitPayment,
  onSaveBillingAddress,
  isBillingFormValid,
  onGoToDetails,
}: WizardFooterProps) {
  if (currentStep === 1) {
    return (
      <BottomActionBar>
        <Button
          disabled={!selectedAddress}
          onClick={onProceedToTerms}
          className="w-full h-14 text-[16px] font-bold"
        >
          Proceed to Terms
        </Button>
      </BottomActionBar>
    );
  }

  if (currentStep === 2) {
    return (
      <BottomActionBar>
        <Button
          disabled={!allAgreed}
          onClick={onProceedToPayment}
          className="w-full h-14 text-[16px] font-bold"
        >
          Proceed to Payment
        </Button>
      </BottomActionBar>
    );
  }

  if (currentStep === 3) {
    if (checkoutSubView === "add-billing") {
      return (
        <BottomActionBar>
          <Button
            onClick={onSaveBillingAddress}
            disabled={!isBillingFormValid}
            className="w-full h-14 text-[16px] font-bold rounded-2xl bg-primary text-white"
          >
            Save Billing Address
          </Button>
        </BottomActionBar>
      );
    }

    // checkoutSubView === "main"
    if (paymentMethod === "card") {
      return (
        <BottomActionBar>
          <Button
            onClick={() => onSubmitPayment("card")}
            disabled={isSubmittingPayment}
            className="w-full h-14 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 disabled:text-slate-400 text-[16px] font-bold text-white flex items-center justify-center gap-2 rounded-2xl"
          >
            {isSubmittingPayment ? (
              <>
                <Spinner className="size-4" /> Redirecting to Secure Checkout...
              </>
            ) : (
              <>
                <Lock size={16} /> Continue to Secure Checkout
              </>
            )}
          </Button>
        </BottomActionBar>
      );
    }

    return (
      <BottomActionBar>
        <Button
          onClick={() =>
            onSubmitPayment("wallet")
          }
          disabled={!isSufficient || isSubmittingPayment}
          className="w-full h-14 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 disabled:text-slate-400 text-[16px] font-bold text-white flex items-center justify-center gap-2 rounded-2xl"
        >
          {isSubmittingPayment ? (
            <>
              <Spinner className="size-4" /> Simulating Collateral Deposit...
            </>
          ) : (
            <>
              <Lock size={16} /> Pay With Wallet
            </>
          )}
        </Button>
      </BottomActionBar>
    );
  }

  if (currentStep === 4) {
    return (
      <BottomActionBar>
        <Button
          onClick={onGoToDetails}
          className="w-full h-14 text-[16px] font-bold rounded-2xl bg-primary text-white shadow-lg flex items-center justify-center gap-2"
        >
          Go to Dashboard <ArrowRight className="w-5 h-5" />
        </Button>
      </BottomActionBar>
    );
  }

  return null;
}
