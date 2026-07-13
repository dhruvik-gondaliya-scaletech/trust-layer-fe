"use client";

import { motion } from "framer-motion";
import { ShieldCheck, AlertCircle, CreditCard, Wallet, Lock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { stepVariants } from "@/styles/animation-tokens";
import type { BillingAddress, PaymentMethodType } from "@/types/fund-escrow.types";

interface FundingStepProps {
  totalAmount: number;
  feeOption: number;
  savedBillingAddress: BillingAddress | null;
  paymentMethod: PaymentMethodType;
  setPaymentMethod: (method: PaymentMethodType) => void;
  walletBalance: number;
  isSufficient: boolean;
  remainingBalance: number;
  onChangeBilling: () => void;
}

export function FundingStep({
  totalAmount,
  feeOption,
  savedBillingAddress,
  paymentMethod,
  setPaymentMethod,
  walletBalance,
  isSufficient,
  remainingBalance,
  onChangeBilling,
}: FundingStepProps) {
  return (
    <motion.div
      key="step3-main"
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      className="flex flex-col gap-5 pt-2"
    >
      <div>
        <h2 className="text-[20px] font-extrabold tracking-tight">Fund Deal</h2>
        <p className="text-[13px] text-slate-500 mt-1">
          Lock collateral securely with TrustLayer. Funds are protected until verified.
        </p>
      </div>

      {/* Total Due Today Card (Blue Gradient) */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-[24px] p-6 shadow-md shadow-blue-500/10 flex flex-col gap-4 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="space-y-1 relative z-10">
          <span className="text-blue-200 text-[10px] tracking-wider font-extrabold uppercase">Total Due Today</span>
          <div className="text-[32px] font-black tracking-tight">${totalAmount.toLocaleString(undefined, { minimumFractionDigits: feeOption === 0 ? 2 : 0 })}</div>
        </div>
        <div className="w-full h-px bg-white/15 relative z-10" />
        <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-xl text-[12px] font-medium text-white/95 relative z-10">
          <ShieldCheck size={16} className="text-blue-200 shrink-0" />
          <span>100% Secure TrustLayer Protection</span>
        </div>
      </div>

      {/* Security info banner */}
      <div className="bg-blue-50/50 border border-blue-100 rounded-[20px] p-4 flex gap-3 text-blue-700 text-[13px] leading-relaxed">
        <AlertCircle className="shrink-0 mt-0.5 text-blue-500" size={16} />
        <div>
          <p className="font-bold text-blue-800">Your funds are protected</p>
          <p className="text-blue-600/90 text-[12px] mt-0.5">
            Funds are held securely. The seller will only be paid after they ship the item and you verify its condition.
          </p>
        </div>
      </div>

      {/* Billing Address Card */}
      <Card className="p-4 border border-slate-100 rounded-[20px] bg-white flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="font-bold text-[11px] text-slate-400 uppercase tracking-wider">Bill To</h3>
          {savedBillingAddress ? (
            <div className="text-[13px] flex flex-col text-slate-700">
              <span className="font-bold text-slate-900">{savedBillingAddress.name}</span>
              <span>{savedBillingAddress.street}{savedBillingAddress.apt && `, ${savedBillingAddress.apt}`}</span>
              <span>{savedBillingAddress.city}, {savedBillingAddress.state} {savedBillingAddress.zip}</span>
            </div>
          ) : (
            <span className="text-[13px] text-slate-400 italic">No billing address saved</span>
          )}
        </div>
        <Button
          variant="ghost"
          onClick={onChangeBilling}
          className="text-[13px] text-primary font-bold hover:bg-slate-50 rounded-xl px-3 h-9"
        >
          Change
        </Button>
      </Card>

      {/* Tab Switcher */}
      <div className="flex bg-slate-100 p-1 rounded-[14px]">
        <button
          type="button"
          onClick={() => setPaymentMethod("card")}
          className={cn(
            "flex-1 py-2.5 text-[13px] font-bold rounded-[11px] flex items-center justify-center gap-2 transition-all",
            paymentMethod === "card" ? "bg-white shadow-soft text-primary" : "text-slate-500"
          )}
        >
          <CreditCard size={15} />
          Credit Card
        </button>
        <button
          type="button"
          onClick={() => setPaymentMethod("wallet")}
          className={cn(
            "flex-1 py-2.5 text-[13px] font-bold rounded-[11px] flex items-center justify-center gap-2 transition-all",
            paymentMethod === "wallet" ? "bg-white shadow-soft text-primary" : "text-slate-500"
          )}
        >
          <Wallet size={15} />
          Wallet Balance
        </button>
      </div>

      {/* Tab Contents */}
      {paymentMethod === "card" ? (
        <Card className="border border-slate-100 bg-white rounded-[20px] p-5 flex gap-3 items-start">
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 shrink-0">
            <CreditCard size={20} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-bold text-[14px] text-slate-900 flex items-center gap-1.5">
              Secure checkout with Stripe
              <ExternalLink size={13} className="text-slate-400" />
            </span>
            <p className="text-[12px] text-slate-500 leading-relaxed">
              You&apos;ll be redirected to Stripe&apos;s secure payment page to enter your card
              details and complete the payment. Afterwards you&apos;ll return here automatically.
            </p>
          </div>
        </Card>
      ) : (
        <Card className="border border-slate-100 bg-white rounded-[20px] p-5 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <span className="text-[13px] text-slate-500 font-medium">Available Balance</span>
            <span className="font-mono font-bold text-[15px] text-slate-900">${walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[13px] text-slate-500 font-medium">Amount Required</span>
            <span className="font-mono font-bold text-[15px] text-destructive">-${totalAmount.toLocaleString(undefined, { minimumFractionDigits: feeOption === 0 ? 2 : 0 })}</span>
          </div>
          <div className="h-px bg-slate-100" />
          <div className="flex justify-between items-center">
            <span className="text-[13px] text-slate-500 font-bold">Remaining Balance</span>
            <span className={cn(
              "font-mono font-bold text-[15px]",
              isSufficient ? "text-emerald-600" : "text-destructive"
            )}>
              ${(remainingBalance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>

          {isSufficient ? (
            <div className="bg-emerald-50 text-emerald-700 text-[12px] p-3 rounded-xl font-medium leading-relaxed">
              Sufficient Balance. Your wallet has enough funds for this transaction.
            </div>
          ) : (
            <div className="bg-destructive/5 text-destructive text-[12px] p-3 rounded-xl font-medium leading-relaxed">
              Insufficient Balance. Please add another payment method or top up your wallet.
            </div>
          )}
        </Card>
      )}

      {/* Secure Payment Footnote */}
      <div className="flex justify-center items-center gap-1.5 text-[11px] text-slate-400 mt-2">
        <Lock size={12} className="text-slate-300" />
        <span>Security Secured. Standard SSL & AES-256 vault protection.</span>
      </div>
    </motion.div>
  );
}
