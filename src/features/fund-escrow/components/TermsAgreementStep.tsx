"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ShippingAddress } from "@/types/address.types";
import { stepVariants } from "@/styles/animation-tokens";
import type { AgreementChecked, Deal } from "@/types/fund-escrow.types";

interface TermsAgreementStepProps {
  deal: Deal;
  selectedAddress: ShippingAddress | undefined;
  onChangeAddress: () => void;
  agreementChecked: AgreementChecked;
  onToggleAgreement: (key: keyof AgreementChecked) => void;
  feeAck: boolean;
  onToggleFeeAck: () => void;
  feeOption: number;
  platformFee: number;
  buyerFeeShare: number;
  totalAmount: number;
}

export function TermsAgreementStep({
  deal,
  selectedAddress,
  onChangeAddress,
  agreementChecked,
  onToggleAgreement,
  feeAck,
  onToggleFeeAck,
  feeOption,
  platformFee,
  buyerFeeShare,
  totalAmount,
}: TermsAgreementStepProps) {
  return (
    <motion.div
      key="step2"
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      className="flex flex-col gap-6 pt-2"
    >
      <div>
        <h2 className="text-[20px] font-extrabold tracking-tight">Confirm what you&apos;re agreeing to</h2>
        <p className="text-[13px] text-slate-500 mt-1">
          Tap each item to confirm.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {/* Shipping Address Summary */}
        {selectedAddress && (
          <Card className="p-4 border border-slate-100 rounded-[20px] bg-white">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-[11px] text-slate-400 uppercase tracking-wider">Shipping Address</h3>
              <button onClick={onChangeAddress} className="text-[12px] text-primary font-bold hover:underline">
                [ Change ]
              </button>
            </div>
            <div className="flex flex-col gap-1 text-[13px]">
              <span className="font-bold text-slate-900">{selectedAddress.name}</span>
              <span className="text-slate-500">
                {selectedAddress.street}{selectedAddress.apt && `, ${selectedAddress.apt}`}
              </span>
              <span className="text-slate-500">
                {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zip}
              </span>
              <span className="text-slate-500">{selectedAddress.country}</span>
              {selectedAddress.alternatePhone && (
                <span className="text-slate-400 mt-1 font-mono">{selectedAddress.alternatePhone}</span>
              )}
            </div>
          </Card>
        )}

        {/* Item Details Card */}
        <Card
          className={cn(
            "p-4 border-2 transition-all cursor-pointer rounded-[20px] bg-white",
            agreementChecked.details ? "border-primary bg-blue-50/5" : "border-slate-100 hover:border-slate-200"
          )}
          onClick={() => onToggleAgreement("details")}
        >
          <div className="flex gap-4">
            <div className={cn(
              "mt-1 w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors",
              agreementChecked.details ? "bg-primary border-primary" : "border-slate-300"
            )}>
              {agreementChecked.details && <Check className="w-3.5 h-3.5 text-white" />}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                 <h3 className="font-bold text-[14px]">Item</h3>
                 <span className="font-bold text-[14px] text-primary">${deal.price.toLocaleString()}</span>
              </div>
              <p className="text-[12px] text-slate-500 leading-relaxed">{deal.title}</p>
            </div>
          </div>
        </Card>

        {/* Shipping Details Card */}
        <Card
          className={cn(
            "p-4 border-2 transition-all cursor-pointer rounded-[20px] bg-white",
            agreementChecked.shipping ? "border-primary bg-blue-50/5" : "border-slate-100 hover:border-slate-200"
          )}
          onClick={() => onToggleAgreement("shipping")}
        >
          <div className="flex gap-4">
            <div className={cn(
              "mt-1 w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors",
              agreementChecked.shipping ? "bg-primary border-primary" : "border-slate-300"
            )}>
              {agreementChecked.shipping && <Check className="w-3.5 h-3.5 text-white" />}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                 <h3 className="font-bold text-[14px]">Shipping</h3>
                 <span className="font-bold text-[14px] text-slate-600">
                   {deal.shippingCost > 0
                     ? `$${deal.shippingCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                     : "Free"}
                 </span>
              </div>
              <p className="text-[12px] text-slate-500 leading-relaxed">
                {deal.carrier} ({deal.shippingType})
              </p>
            </div>
          </div>
        </Card>

        {/* Fees & Total Dynamic Card */}
        <Card
          className={cn(
            "p-4 border-2 transition-all cursor-pointer rounded-[20px] bg-white",
            agreementChecked.fees ? "border-primary bg-blue-50/5" : "border-slate-100 hover:border-slate-200"
          )}
          onClick={() => onToggleAgreement("fees")}
        >
          <div className="flex gap-4">
            <div className={cn(
              "mt-1 w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors",
              agreementChecked.fees ? "bg-primary border-primary" : "border-slate-300"
            )}>
              {agreementChecked.fees && <Check className="w-3.5 h-3.5 text-white" />}
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-[14px]">Fees & Total</h3>
              </div>

              {/* Platform Fee Arrangement Section */}
              <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[12px] font-bold text-slate-700">Platform Fee</span>
                  {feeOption === 1 && (
                    <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                      Buyer Pays 100%
                    </span>
                  )}
                  {feeOption === 2 && (
                    <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      Seller Pays 100%
                    </span>
                  )}
                  {feeOption === 0 && (
                    <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                      Split 50 / 50
                    </span>
                  )}
                </div>

                {feeOption === 0 && (
                  <div className="flex gap-4 text-[11px] pt-1">
                    <div className="flex-1 bg-white border border-slate-100 p-2 rounded-lg flex justify-between items-center">
                      <span className="text-slate-400">Your Share</span>
                      <span className="font-bold text-slate-800">${buyerFeeShare.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                    </div>
                    <div className="flex-1 bg-white border border-slate-100 p-2 rounded-lg flex justify-between items-center">
                      <span className="text-slate-400">Seller Share</span>
                      <span className="font-medium text-slate-800">${(platformFee - buyerFeeShare).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                    </div>
                  </div>
                )}

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {feeOption === 1 && "You are responsible for paying the Platform Fee for this transaction."}
                  {feeOption === 2 && "The seller is covering the Platform Fee. You only pay the item price."}
                  {feeOption === 0 && "The Platform Fee is shared equally between you and the seller."}
                </p>
              </div>

              <div className="space-y-2 text-[12px] bg-white border border-slate-100 p-3 rounded-xl">
                <div className="flex justify-between items-center px-2 pt-1 text-slate-500">
                  <span>Item Price</span>
                  <span className="font-medium text-slate-800">${deal.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center px-2 text-slate-500">
                  <span>Shipping (Reimbursed to Seller)</span>
                  <span className="font-medium text-slate-800">
                    {deal.shippingCost > 0
                      ? `$${deal.shippingCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                      : "Free"}
                  </span>
                </div>

                {feeOption === 1 && (
                  <div className="flex justify-between items-center px-2 text-slate-500">
                    <span>Platform Fee</span>
                    <span className="font-medium text-slate-800">${platformFee.toLocaleString()}</span>
                  </div>
                )}
                {feeOption === 0 && (
                  <div className="flex justify-between items-center px-2 text-slate-500">
                    <span>Platform Fee (Your Share)</span>
                    <span className="font-medium text-slate-800">${buyerFeeShare.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                  </div>
                )}
                {feeOption === 2 && (
                  <div className="flex justify-between items-center px-2 text-slate-500">
                    <span>Platform Fee</span>
                    <span className="font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">Included by Seller</span>
                  </div>
                )}

                <div className="h-px bg-slate-100 my-2" />
                <div className="flex justify-between items-center px-2 font-bold text-[14px]">
                  <span>Total You Pay</span>
                  <span className="text-primary">${totalAmount.toLocaleString(undefined, {minimumFractionDigits: feeOption === 0 ? 2 : 0})}</span>
                </div>
              </div>

            </div>
          </div>
        </Card>
      </div>

      {/* Terms and Conditions Checklist at Bottom */}
      <div
        className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-100 rounded-[20px] cursor-pointer mt-4"
        onClick={onToggleFeeAck}
      >
        <div className={cn(
          "mt-0.5 w-5 h-5 rounded flex items-center justify-center shrink-0 border transition-colors",
          feeAck ? "bg-primary border-primary" : "border-slate-300 bg-white"
        )}>
          {feeAck && <Check className="w-3.5 h-3.5 text-white" />}
        </div>
        <div>
          <p className="text-[13px] font-medium leading-tight mb-1">
            I have read and agree to the TrustLayer Terms & Conditions.
          </p>
          <p className="text-[11px] text-slate-400 leading-normal">
            By proceeding with this transaction, you agree to TrustLayer&apos;s Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
