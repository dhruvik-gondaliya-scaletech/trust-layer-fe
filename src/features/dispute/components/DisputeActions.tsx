"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  RotateCcw,
  CheckCircle2,
  Scale,
  Truck,
  BadgeAlert,
  Gavel,
  HandCoins,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Dispute, Deal } from "@/types/api.types";

interface DisputeActionsProps {
  dispute: Dispute;
  deal: Deal;
  isBuyer: boolean;
  isSeller: boolean;
  isReturnShipped: boolean;
  isConfirmReturnPending: boolean;
  onOpenRespondModal: () => void;
  onOpenEscalateModal: () => void;
  onOpenAcceptDeclineModal: () => void;
  onOpenShipReturnModal: () => void;
  onConfirmReturn: () => void;
}

// ─── Seller: respond button ────────────────────────────────────────────────────
function SellerRespondButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      className="w-full h-14 bg-primary hover:bg-primary/95 text-white rounded-[16px] font-bold text-[14px] shadow-lg shadow-primary/10 flex items-center justify-center gap-2"
    >
      <RotateCcw className="w-4 h-4" />
      <span>Respond to Dispute</span>
    </Button>
  );
}

// ─── Seller: confirm receipt button ───────────────────────────────────────────
function SellerConfirmReceiptButton({
  isPending,
  onClick,
}: {
  isPending: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      onClick={onClick}
      disabled={isPending}
      className="w-full h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[16px] font-bold text-[14px] shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2"
    >
      {isPending ? (
        <span>Confirming Receipt...</span>
      ) : (
        <>
          <CheckCircle2 className="w-4 h-4" />
          <span>Confirm Package Receipt & Refund</span>
        </>
      )}
    </Button>
  );
}

// ─── Buyer: decline decision card (escalate vs accept) ────────────────────────
function BuyerDeclineDecisionCard({
  onEscalate,
  onAccept,
}: {
  onEscalate: () => void;
  onAccept: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, type: "spring", damping: 22, stiffness: 280 }}
      className="w-full space-y-3"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-1">
        <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
          <BadgeAlert className="w-5 h-5 text-amber-500" />
        </div>
        <div>
          <p className="text-[14px] font-extrabold text-slate-800 leading-tight">
            Your Decision is Required
          </p>
          <p className="text-[11.5px] text-slate-400 font-medium">
            Choose how you'd like to proceed with this dispute.
          </p>
        </div>
      </div>

      {/* Option 1 — Escalate */}
      <motion.button
        whileTap={{ scale: 0.985 }}
        onClick={onEscalate}
        className="w-full text-left rounded-[20px] border-2 border-rose-100 bg-gradient-to-br from-rose-50 to-red-50/50 p-4 group hover:border-rose-300 hover:shadow-md hover:shadow-rose-100 transition-all duration-200 cursor-pointer"
      >
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-rose-100 flex items-center justify-center shrink-0 group-hover:bg-rose-200 transition-colors">
            <Gavel className="w-5 h-5 text-rose-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-[14px] font-extrabold text-rose-700">Escalate to Admin</p>
              <ArrowRight className="w-4 h-4 text-rose-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-[12px] text-rose-500/80 font-medium mt-0.5 leading-relaxed">
              Request TrustLayer arbitration. An admin will review all evidence and make a binding
              decision.
            </p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {["Admin Review", "Funds Protected", "Binding Decision"].map((tag) => (
                <span
                  key={tag}
                  className="text-[10.5px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.button>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-100" />
        <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">or</span>
        <div className="h-px flex-1 bg-slate-100" />
      </div>

      {/* Option 2 — Accept decline */}
      <motion.button
        whileTap={{ scale: 0.985 }}
        onClick={onAccept}
        className="w-full text-left rounded-[20px] border-2 border-slate-100 bg-slate-50/80 p-4 group hover:border-slate-200 hover:shadow-md hover:shadow-slate-100/50 transition-all duration-200 cursor-pointer"
      >
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shrink-0 group-hover:border-slate-200 transition-colors shadow-sm">
            <HandCoins className="w-5 h-5 text-slate-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-[14px] font-extrabold text-slate-700">Accept Seller's Decline</p>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-[12px] text-slate-400 font-medium mt-0.5 leading-relaxed">
              Close this dispute and release escrowed funds to the seller. This action is
              irreversible.
            </p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">
                Funds Released
              </span>
              <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-400">
                Irreversible
              </span>
            </div>
          </div>
        </div>
      </motion.button>
    </motion.div>
  );
}

// ─── Buyer: ship return button ─────────────────────────────────────────────────
function BuyerShipReturnButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      className="w-full h-14 bg-primary hover:bg-primary/95 text-white rounded-[16px] font-bold text-[14px] shadow-lg flex items-center justify-center gap-2"
    >
      <Truck className="w-4 h-4" />
      <span>Submit Return Tracking Info</span>
    </Button>
  );
}

// ─── Buyer: escalate from opened state ────────────────────────────────────────
function BuyerEscalateButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className="w-full h-12 border-red-100 text-red-600 hover:bg-red-50/50 rounded-[14px] font-bold text-[13px] flex items-center justify-center gap-2"
    >
      <Scale className="w-4 h-4" />
      <span>Escalate Dispute to Admin</span>
    </Button>
  );
}

// ─── Main orchestrator ────────────────────────────────────────────────────────
export function DisputeActions({
  dispute,
  deal,
  isBuyer,
  isSeller,
  isReturnShipped,
  isConfirmReturnPending,
  onOpenRespondModal,
  onOpenEscalateModal,
  onOpenAcceptDeclineModal,
  onOpenShipReturnModal,
  onConfirmReturn,
}: DisputeActionsProps) {
  const isDeclined =
    dispute.status === "seller_responded" && dispute.action === "decline";
  const isReturnPending =
    dispute.status === "seller_responded" &&
    dispute.action === "return" &&
    !dispute.trackingNumber;

  return (
    <div className="space-y-3 pt-3">
      {/* Seller: respond to open dispute */}
      {isSeller && dispute.status === "created" && (
        <SellerRespondButton onClick={onOpenRespondModal} />
      )}

      {/* Seller: confirm return receipt */}
      {isSeller &&
        dispute.status === "seller_responded" &&
        dispute.action === "return" &&
        isReturnShipped && (
          <SellerConfirmReceiptButton
            isPending={isConfirmReturnPending}
            onClick={onConfirmReturn}
          />
        )}

      {/* Buyer: decide after seller declined */}
      {isBuyer && isDeclined && (
        <BuyerDeclineDecisionCard
          onEscalate={onOpenEscalateModal}
          onAccept={onOpenAcceptDeclineModal}
        />
      )}

      {/* Buyer: submit return tracking */}
      {isBuyer && isReturnPending && (
        <BuyerShipReturnButton onClick={onOpenShipReturnModal} />
      )}

      {/* Buyer: escalate from initial opened state */}
      {isBuyer && dispute.status === "created" && (
        <BuyerEscalateButton onClick={onOpenEscalateModal} />
      )}
    </div>
  );
}
