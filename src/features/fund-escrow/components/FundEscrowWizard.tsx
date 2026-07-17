"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AgreementChecked, FundEscrowWizardProps } from "@/types/fund-escrow.types";
import { SuccessStep } from "./SuccessStep";
import { useEscrowCalculations } from "@/hooks/useEscrowCalculations";
import { usePaymentDetails } from "@/hooks/usePaymentDetails";
import { WizardHeader } from "./WizardHeader";
import { ShippingAddressStep } from "./ShippingAddressStep";
import { TermsAgreementStep } from "./TermsAgreementStep";
import { FundingStep } from "./FundingStep";
import { AddBillingAddressStep } from "./AddBillingAddressStep";
import { WizardFooter } from "./WizardFooter";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FundEscrowWizard({
  deal,
  currentStep,
  setStep,
  selectedAddress,
  addresses,
  wallet,
  onSelectAddress,
  onSetDefaultAddress,
  onDeleteAddress,
  onAddAddressClick,
  onSubmitPayment,
  isSubmittingPayment,
  onGoToDetails,
}: FundEscrowWizardProps) {
  const [agreementChecked, setAgreementChecked] = useState<AgreementChecked>({
    details: false,
    shipping: false,
    fees: false,
  });
  const [feeAck, setFeeAck] = useState(false);
  const allAgreed = agreementChecked.details && agreementChecked.shipping && agreementChecked.fees;

  const [showExitModal, setShowExitModal] = useState(false);

  const { platformFee, buyerFeeShare, totalAmount, feeOption, walletBalance, isSufficient, remainingBalance } =
    useEscrowCalculations(deal, wallet);

  const payment = usePaymentDetails();

  const toggleAgreement = (key: keyof AgreementChecked) => {
    setAgreementChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleBack = () => {
    if (currentStep === 3 && payment.checkoutSubView !== "main") {
      payment.setCheckoutSubView("main");
    } else if (currentStep > 1 && currentStep < 4) {
      setStep(currentStep - 1);
    } else {
      window.history.back();
    }
  };

  // Show "Secure Checkout" title in header for steps 1–3
  // Show X button only on step 2 (Terms) to allow exit
  const showExitButton = currentStep === 2;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header — hidden on success step */}
      {currentStep < 4 && (
        <WizardHeader
          onBack={handleBack}
          onRequestExit={showExitButton ? () => setShowExitModal(true) : undefined}
        />
      )}

      {/* Main Content */}
      <div className={cn("flex-1 max-w-2xl mx-auto w-full px-4", currentStep < 4 ? "pt-6 pb-[140px]" : "py-6")}>
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <ShippingAddressStep
              addresses={addresses}
              selectedAddress={selectedAddress}
              onSelectAddress={onSelectAddress}
              onSetDefaultAddress={onSetDefaultAddress}
              onDeleteAddress={onDeleteAddress}
              onAddAddressClick={onAddAddressClick}
            />
          )}

          {currentStep === 2 && (
            <TermsAgreementStep
              deal={deal}
              selectedAddress={selectedAddress}
              onChangeAddress={() => setStep(1)}
              agreementChecked={agreementChecked}
              onToggleAgreement={toggleAgreement}
              feeAck={feeAck}
              onToggleFeeAck={() => setFeeAck((v) => !v)}
              feeOption={feeOption}
              platformFee={platformFee}
              buyerFeeShare={buyerFeeShare}
              totalAmount={totalAmount}
            />
          )}

          {currentStep === 3 && payment.checkoutSubView === "main" && (
            <FundingStep
              totalAmount={totalAmount}
              feeOption={feeOption}
              savedBillingAddress={payment.savedBillingAddress}
              paymentMethod={payment.paymentMethod}
              setPaymentMethod={payment.setPaymentMethod}
              walletBalance={walletBalance}
              isSufficient={isSufficient}
              remainingBalance={remainingBalance}
              onChangeBilling={() => payment.setCheckoutSubView("add-billing")}
            />
          )}

          {currentStep === 3 && payment.checkoutSubView === "add-billing" && (
            <AddBillingAddressStep
              billingFirstName={payment.billingFirstName}
              setBillingFirstName={payment.setBillingFirstName}
              billingLastName={payment.billingLastName}
              setBillingLastName={payment.setBillingLastName}
              billingStreet={payment.billingStreet}
              setBillingStreet={payment.setBillingStreet}
              billingApt={payment.billingApt}
              setBillingApt={payment.setBillingApt}
              billingCity={payment.billingCity}
              setBillingCity={payment.setBillingCity}
              billingState={payment.billingState}
              setBillingState={payment.setBillingState}
              billingZip={payment.billingZip}
              setBillingZip={payment.setBillingZip}
            />
          )}

          {currentStep === 4 && <SuccessStep deal={deal} totalAmount={totalAmount} />}
        </AnimatePresence>
      </div>

      {/* Footer CTA */}
      <WizardFooter
        currentStep={currentStep}
        selectedAddress={selectedAddress}
        onProceedToTerms={() => setStep(2)}
        allAgreed={allAgreed && feeAck}
        onProceedToPayment={() => setStep(3)}
        checkoutSubView={payment.checkoutSubView}
        paymentMethod={payment.paymentMethod}
        savedBillingAddress={payment.savedBillingAddress}
        isSufficient={isSufficient}
        isSubmittingPayment={isSubmittingPayment}
        onSubmitPayment={onSubmitPayment}
        onSaveBillingAddress={payment.handleSaveBillingAddress}
        isBillingFormValid={payment.isBillingFormValid}
        onGoToDetails={onGoToDetails}
      />

      {/* Processing Overlay — matches reference Step 7 */}
      <AnimatePresence>
        {isSubmittingPayment && (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-primary text-white"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="relative w-32 h-32 bg-white/10 rounded-full flex items-center justify-center mb-8 shadow-[0_0_60px_rgba(255,255,255,0.2)]"
            >
              <div className="absolute inset-0 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              <Shield className="w-12 h-12 fill-white text-white drop-shadow-md" />
            </motion.div>

            <h2 className="text-2xl font-bold mb-4 tracking-tight drop-shadow-sm">
              Securing Your Funds...
            </h2>
            <p className="text-blue-100 font-medium text-[15px] text-center px-6">
              TrustLayer is securely processing your payment.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Leave Checkout Modal */}
      <AnimatePresence>

        {showExitModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center px-5 pointer-events-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowExitModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-[340px] rounded-3xl p-6 relative z-10 shadow-2xl"
            >
              <h3 className="text-[20px] font-extrabold text-center text-gray-900 mb-2">
                Leave Checkout?
              </h3>
              <p className="text-[14px] text-gray-500 text-center font-medium mb-6">
                You haven&apos;t completed your purchase yet.
                <br /><br />
                Your deal will remain pending and no funds will be charged.
              </p>

              <div className="flex flex-col gap-2.5">
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-xl text-[15px] shadow-sm"
                  onClick={() => setShowExitModal(false)}
                >
                  Continue Checkout
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-rose-600 font-bold h-12 rounded-xl text-[15px] hover:bg-rose-50"
                  onClick={() => {
                    setShowExitModal(false);
                    window.history.back();
                  }}
                >
                  Leave
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
