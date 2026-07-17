"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ShieldAlert,
  Clock,
  CheckCircle2,
  FileText,
  AlertTriangle,
  ArrowRight,
  User,
  Scale,
  Calendar,
  Truck,
  RotateCcw,
  Sparkles,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AnimatedModal } from "@/components/shared/animated-modal";
import { BackButton } from "@/components/shared/BackButton";
import type { Dispute, Deal, RespondDisputeDto, ShipReturnDto } from "@/types/api.types";
import { DisputeStatus, DisputeAction } from "@/types/enums";
import { formatDateTime } from "@/features/deal-details/utils/format";
import { cn, formatCurrency } from "@/lib/utils";

interface DisputeDetailsViewProps {
  deal: Deal;
  dispute: Dispute;
  isBuyer: boolean;
  isSeller: boolean;
  onRespond: (dto: RespondDisputeDto) => Promise<void>;
  isRespondPending: boolean;
  onEscalate: () => Promise<void>;
  isEscalatePending: boolean;
  onAcceptDecline: () => Promise<void>;
  isAcceptDeclinePending: boolean;
  onShipReturn: (dto: ShipReturnDto) => Promise<void>;
  isShipReturnPending: boolean;
  onConfirmReturn: () => Promise<void>;
  isConfirmReturnPending: boolean;
  onBack: () => void;
}

export default function DisputeDetailsView({
  deal,
  dispute,
  isBuyer,
  isSeller,
  onRespond,
  isRespondPending,
  onEscalate,
  isEscalatePending,
  onAcceptDecline,
  isAcceptDeclinePending,
  onShipReturn,
  isShipReturnPending,
  onConfirmReturn,
  isConfirmReturnPending,
  onBack,
}: DisputeDetailsViewProps) {
  // Modal States
  const [isRespondModalOpen, setIsRespondModalOpen] = useState(false);
  const [isEscalateModalOpen, setIsEscalateModalOpen] = useState(false);
  const [isShipReturnModalOpen, setIsShipReturnModalOpen] = useState(false);

  // Form States
  const [sellerAction, setSellerAction] = useState<"refund" | "return" | "decline">("refund");
  const [sellerExplanation, setSellerExplanation] = useState("");
  const [escalateExplanation, setEscalateExplanation] = useState("");
  
  const [carrier, setCarrier] = useState("");
  const [shippingType, setShippingType] = useState<"standard" | "priority">("standard");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [estimatedDays, setEstimatedDays] = useState("5");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [returnNotes, setReturnNotes] = useState("");

  const handleSellerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellerExplanation.trim()) return;
    try {
      await onRespond({
        action: sellerAction,
        sellerExplanation,
        // Optional default parameters for returning products
        returnShippingFeeSplit: sellerAction === "return" ? "seller" : undefined,
        returnAddressId: sellerAction === "return" ? "default-address-id" : undefined,
      });
      setIsRespondModalOpen(false);
      setSellerExplanation("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleEscalateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onEscalate();
      setIsEscalateModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleShipReturnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!carrier.trim() || !trackingNumber.trim()) return;
    try {
      const estimatedDeliveryAt = new Date();
      estimatedDeliveryAt.setDate(estimatedDeliveryAt.getDate() + parseInt(estimatedDays, 10));

      await onShipReturn({
        carrier,
        shippingType,
        trackingNumber,
        estimatedDeliveryAt: estimatedDeliveryAt.toISOString(),
        trackingUrl: trackingUrl || undefined,
        notes: returnNotes || undefined,
      });
      setIsShipReturnModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Status Banner Helpers
  const getBannerDetails = () => {
    switch (dispute.status) {
      case "created":
        return {
          title: "Dispute Opened",
          desc: isBuyer
            ? "Waiting for the seller's response. Funds remain secured in TrustLayer escrow."
            : "Action Required: The buyer has reported an issue. Please review details and respond.",
          tone: "amber",
          gradient: "from-amber-500 to-orange-600",
          icon: Clock,
        };
      case "seller_responded":
        if (dispute.action === "refund") {
          return {
            title: "Resolved via Refund",
            desc: "The seller accepted the dispute. A full refund has been initiated to the buyer.",
            tone: "emerald",
            gradient: "from-emerald-500 to-teal-600",
            icon: CheckCircle2,
          };
        }
        if (dispute.action === "return") {
          return {
            title: "Return Requested & Approved",
            desc: isBuyer
              ? "The seller requested the item back. Please ship it back using the tracking action below."
              : "Awaiting return shipment from the buyer. You will confirm receipt to complete refund.",
            tone: "indigo",
            gradient: "from-indigo-500 to-blue-600",
            icon: RotateCcw,
          };
        }
        return {
          title: "Dispute Declined by Seller",
          desc: isBuyer
            ? "The seller rejected your dispute claim. You can escalate to admin or accept the decline."
            : "You declined this dispute. Awaiting buyer's decision to accept or escalate to admin.",
          tone: "red",
          gradient: "from-rose-500 to-red-600",
          icon: ShieldAlert,
        };
      case "escalated":
        return {
          title: "Under Admin Review",
          desc: "This dispute has been escalated to TrustLayer arbitrators. We are reviewing both claims.",
          tone: "purple",
          gradient: "from-purple-500 to-indigo-600",
          icon: Scale,
        };
      case "resolved":
        return {
          title: "Dispute Resolved",
          desc: "This case is finalized. Funds have been distributed as per resolution details.",
          tone: "emerald",
          gradient: "from-emerald-500 to-teal-600",
          icon: CheckCircle2,
        };
      default:
        return {
          title: "Active Dispute",
          desc: "Dispute under review.",
          tone: "slate",
          gradient: "from-slate-500 to-slate-600",
          icon: Info,
        };
    }
  };

  const banner = getBannerDetails();
  const BannerIcon = banner.icon;

  // Determine if return is in transit (deal status tells us the actual shipment status)
  const isReturnShipped = deal.status === "return_shipped" || deal.status === "return_delivered";
  const isReturnCompleted = deal.status === "return_completed";

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-20">
      {/* ─── Header ─── */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto flex items-center justify-between px-4 py-4 w-full">
          <BackButton onClick={onBack} className="-ml-2" />
          <span className="text-[15px] font-extrabold tracking-tight">Dispute Center</span>
          <div className="w-8" />
        </div>
      </div>

      <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 space-y-5">
        {/* Status Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "rounded-[24px] p-5 text-white shadow-md relative overflow-hidden bg-gradient-to-br",
            banner.gradient
          )}
        >
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-28 h-28 rounded-full bg-white/10 blur-2xl" />
          <div className="relative z-10 flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shrink-0 backdrop-blur-md">
              <BannerIcon className="w-6 h-6 text-white" />
            </div>
            <div className="space-y-1">
              <h2 className="text-[18px] font-extrabold leading-tight">{banner.title}</h2>
              <p className="text-[13px] text-white/90 leading-relaxed font-medium">{banner.desc}</p>
            </div>
          </div>
        </motion.div>

        {/* Return Details Card (if applicable) */}
        {dispute.action === "return" && (
          <Card className="rounded-[24px] border-slate-100 shadow-soft bg-white p-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                <Truck className="w-4 h-4 text-indigo-500" />
              </div>
              <h3 className="text-[15px] font-bold text-slate-800">Return Details</h3>
            </div>

            {dispute.trackingNumber ? (
              <div className="grid grid-cols-2 gap-3 text-[13px] pt-1">
                <div className="bg-slate-50 p-3 rounded-xl">
                  <span className="text-slate-400 block text-[11px] font-bold uppercase">Carrier</span>
                  <span className="font-extrabold text-slate-700 capitalize">{dispute.carrier}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl">
                  <span className="text-slate-400 block text-[11px] font-bold uppercase">Tracking #</span>
                  <span className="font-extrabold text-slate-700">{dispute.trackingNumber}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl col-span-2 flex justify-between items-center">
                  <div>
                    <span className="text-slate-400 block text-[11px] font-bold uppercase">Return Status</span>
                    <span className="font-extrabold text-slate-700 capitalize">
                      {deal.status.replace("return_", "Return ")}
                    </span>
                  </div>
                  {dispute.trackingUrl && (
                    <a
                      href={dispute.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-primary hover:underline bg-primary/5 px-3 py-1.5 rounded-lg"
                    >
                      Track Shipment
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-[12.5px] text-slate-500 bg-slate-50/50 p-3.5 rounded-xl border border-slate-100 italic">
                Waiting for the buyer to submit tracking and carrier information.
              </div>
            )}
          </Card>
        )}

        {/* Dispute Details Card */}
        <Card className="rounded-[24px] border-slate-100 shadow-soft bg-white p-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
            </div>
            <h3 className="text-[15px] font-bold text-slate-800">Dispute Claim Details</h3>
          </div>

          <div className="space-y-3.5">
            <div className="flex justify-between items-center border-b border-slate-50 pb-3">
              <span className="text-[13px] text-slate-400 font-bold">Reason</span>
              <span className="text-[13px] font-extrabold text-slate-800 bg-slate-100 px-3 py-1 rounded-full">
                {dispute.reason}
              </span>
            </div>

            <div className="space-y-1.5">
              <span className="text-[13px] text-slate-400 font-bold block">Buyer's Explanation</span>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/50 text-[13.5px] leading-relaxed text-slate-600 font-medium">
                {dispute.explanation}
              </div>
            </div>

            {/* Evidence Gallery (Mocked for Visual Polish) */}
            <div className="space-y-2">
              <span className="text-[13px] text-slate-400 font-bold block">Supporting Evidence</span>
              <div className="grid grid-cols-3 gap-2">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm group cursor-pointer">
                  <img
                    src="https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?q=80&w=200&auto=format&fit=crop"
                    alt="Evidence Photo 1"
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-bold backdrop-blur-sm">
                    Damaged Package
                  </div>
                </div>
                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm group cursor-pointer">
                  <img
                    src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=200&auto=format&fit=crop"
                    alt="Evidence Photo 2"
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-bold backdrop-blur-sm">
                    Item Front
                  </div>
                </div>
                <div className="bg-slate-100 border border-slate-200 border-dashed rounded-xl flex flex-col items-center justify-center text-slate-400 aspect-video gap-1">
                  <FileText className="w-5 h-5 text-slate-400" />
                  <span className="text-[9.5px] font-bold">Unboxing.mp4</span>
                </div>
              </div>
            </div>

            {/* Seller Response (if submitted) */}
            {dispute.sellerExplanation && (
              <div className="space-y-1.5 pt-3 border-t border-slate-50">
                <span className="text-[13px] text-slate-400 font-bold block">Seller's Response Remarks</span>
                <div className="bg-indigo-50/20 p-4 rounded-2xl border border-indigo-100/50 text-[13.5px] leading-relaxed text-slate-600 font-medium">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Action Chosen</span>
                    <span className="text-[12px] font-extrabold text-indigo-600 uppercase tracking-wider">
                      {dispute.action}
                    </span>
                  </div>
                  <p className="italic">"{dispute.sellerExplanation}"</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Transaction Summary Card */}
        <Card className="rounded-[24px] border-slate-100 shadow-soft bg-white p-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
              <FileText className="w-4 h-4 text-slate-500" />
            </div>
            <h3 className="text-[15px] font-bold text-slate-800">Deal Summary</h3>
          </div>

          <div className="space-y-2.5">
            <div className="flex justify-between">
              <span className="text-[12.5px] font-bold text-slate-400">Deal Number</span>
              <span className="text-[12.5px] font-extrabold text-slate-800">{deal.dealNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[12.5px] font-bold text-slate-400">Item Title</span>
              <span className="text-[12.5px] font-extrabold text-slate-800 truncate max-w-[200px]">{deal.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[12.5px] font-bold text-slate-400">Escrow Value</span>
              <span className="text-[13px] font-black text-rose-500">{formatCurrency(deal.buyerPaysAmount)}</span>
            </div>
            <div className="flex justify-between items-center border-t border-slate-50 pt-2 mt-2">
              <span className="text-[12px] font-bold text-slate-400">Buyer</span>
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-500">
                  <User className="w-2.5 h-2.5" />
                </div>
                <span className="text-[12px] font-extrabold text-slate-700">
                  {deal.buyer?.firstName} {deal.buyer?.lastName}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[12px] font-bold text-slate-400">Seller</span>
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-500">
                  <User className="w-2.5 h-2.5" />
                </div>
                <span className="text-[12px] font-extrabold text-slate-700">
                  {deal.seller?.firstName} {deal.seller?.lastName}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* ─── Bottom Actions ─── */}
        <div className="space-y-3 pt-3">
          {/* Seller Action Buttons */}
          {isSeller && dispute.status === "created" && (
            <Button
              onClick={() => setIsRespondModalOpen(true)}
              className="w-full h-14 bg-primary hover:bg-primary/95 text-white rounded-[16px] font-bold text-[14px] shadow-lg shadow-primary/10 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Respond to Dispute</span>
            </Button>
          )}

          {/* Seller Confirm Receipt */}
          {isSeller && dispute.status === "seller_responded" && dispute.action === "return" && isReturnShipped && (
            <Button
              onClick={onConfirmReturn}
              disabled={isConfirmReturnPending}
              className="w-full h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[16px] font-bold text-[14px] shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2"
            >
              {isConfirmReturnPending ? (
                <span>Confirming Receipt...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Package Receipt & Refund</span>
                </>
              )}
            </Button>
          )}

          {/* Buyer Action Buttons */}
          {isBuyer && dispute.status === "seller_responded" && dispute.action === "decline" && (
            <div className="flex flex-col gap-2.5 w-full">
              <Button
                onClick={() => setIsEscalateModalOpen(true)}
                className="w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-[16px] font-bold text-[14px] shadow-lg flex items-center justify-center gap-2"
              >
                <Scale className="w-4 h-4" />
                <span>Escalate to Admin review</span>
              </Button>
              <Button
                onClick={onAcceptDecline}
                disabled={isAcceptDeclinePending}
                variant="outline"
                className="w-full h-12 border-slate-200 text-slate-600 hover:bg-slate-50 rounded-[14px] font-bold text-[13px] flex items-center justify-center gap-2"
              >
                {isAcceptDeclinePending ? (
                  <span>Accepting...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Accept Seller Decline (Release Funds)</span>
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Buyer Ship Return */}
          {isBuyer && dispute.status === "seller_responded" && dispute.action === "return" && !dispute.trackingNumber && (
            <Button
              onClick={() => setIsShipReturnModalOpen(true)}
              className="w-full h-14 bg-primary hover:bg-primary/95 text-white rounded-[16px] font-bold text-[14px] shadow-lg flex items-center justify-center gap-2"
            >
              <Truck className="w-4 h-4" />
              <span>Submit Return Tracking Info</span>
            </Button>
          )}

          {/* Buyer Escalate from Opened State */}
          {isBuyer && dispute.status === "created" && (
            <Button
              variant="outline"
              onClick={() => setIsEscalateModalOpen(true)}
              className="w-full h-12 border-red-100 text-red-600 hover:bg-red-50/50 rounded-[14px] font-bold text-[13px] flex items-center justify-center gap-2"
            >
              <Scale className="w-4 h-4" />
              <span>Escalate Dispute to Admin</span>
            </Button>
          )}
        </div>
      </div>

      {/* ─── MODALS ─── */}

      {/* Seller Respond Modal */}
      <AnimatedModal
        isOpen={isRespondModalOpen}
        onClose={() => setIsRespondModalOpen(false)}
        title="Respond to Dispute"
        className="max-w-md"
      >
        <form onSubmit={handleSellerSubmit} className="space-y-5 pt-2">
          <div className="space-y-2">
            <span className="text-[12.5px] font-bold text-slate-500">Choose Action</span>
            <div className="grid grid-cols-3 gap-2">
              <div
                onClick={() => setSellerAction("refund")}
                className={cn(
                  "border-2 rounded-xl p-3 text-center cursor-pointer transition-all",
                  sellerAction === "refund"
                    ? "border-primary bg-primary/5 text-primary font-bold"
                    : "border-slate-100 text-slate-500 font-medium"
                )}
              >
                <CheckCircle2 className="w-5 h-5 mx-auto mb-1" />
                <span className="text-xs">Refund</span>
              </div>
              <div
                onClick={() => setSellerAction("return")}
                className={cn(
                  "border-2 rounded-xl p-3 text-center cursor-pointer transition-all",
                  sellerAction === "return"
                    ? "border-primary bg-primary/5 text-primary font-bold"
                    : "border-slate-100 text-slate-500 font-medium"
                )}
              >
                <RotateCcw className="w-5 h-5 mx-auto mb-1" />
                <span className="text-xs">Return & Refund</span>
              </div>
              <div
                onClick={() => setSellerAction("decline")}
                className={cn(
                  "border-2 rounded-xl p-3 text-center cursor-pointer transition-all",
                  sellerAction === "decline"
                    ? "border-primary bg-primary/5 text-primary font-bold"
                    : "border-slate-100 text-slate-500 font-medium"
                )}
              >
                <ShieldAlert className="w-5 h-5 mx-auto mb-1" />
                <span className="text-xs">Decline</span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-[12.5px] font-bold text-slate-500">Explanation Note</span>
            <Textarea
              value={sellerExplanation}
              onChange={(e) => setSellerExplanation(e.target.value)}
              placeholder="Explain your decision to the buyer..."
              className="rounded-xl min-h-[100px] resize-none"
              required
            />
          </div>

          <div className="pt-2 flex gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsRespondModalOpen(false)}
              className="flex-1 h-12 rounded-[14px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isRespondPending || !sellerExplanation.trim()}
              className="flex-1 h-12 rounded-[14px] bg-primary text-white font-bold"
            >
              {isRespondPending ? <span>Submitting...</span> : <span>Send Response</span>}
            </Button>
          </div>
        </form>
      </AnimatedModal>

      {/* Escalate Modal */}
      <AnimatedModal
        isOpen={isEscalateModalOpen}
        onClose={() => setIsEscalateModalOpen(false)}
        title="Escalate to TrustLayer Admin"
        className="max-w-md"
      >
        <form onSubmit={handleEscalateSubmit} className="space-y-5 pt-2">
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 text-amber-800 flex gap-2">
            <Scale className="w-5 h-5 shrink-0 text-amber-600" />
            <p className="text-[11.5px] leading-relaxed">
              Filing a request for review flags this transaction for manual investigation. Our dispute board will check claims and evidence.
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="text-[12.5px] font-bold text-slate-500">Additional Context / Reason</span>
            <Textarea
              value={escalateExplanation}
              onChange={(e) => setEscalateExplanation(e.target.value)}
              placeholder="Why should our admin review this decision?"
              className="rounded-xl min-h-[100px] resize-none"
              required
            />
          </div>

          <div className="pt-2 flex gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsEscalateModalOpen(false)}
              className="flex-1 h-12 rounded-[14px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isEscalatePending || !escalateExplanation.trim()}
              className="flex-1 h-12 rounded-[14px] bg-red-600 hover:bg-red-700 text-white font-bold"
            >
              {isEscalatePending ? <span>Escalating...</span> : <span>Submit Escalation</span>}
            </Button>
          </div>
        </form>
      </AnimatedModal>

      {/* Ship Return Modal */}
      <AnimatedModal
        isOpen={isShipReturnModalOpen}
        onClose={() => setIsShipReturnModalOpen(false)}
        title="Register Return Shipment"
        className="max-w-md"
      >
        <form onSubmit={handleShipReturnSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <span className="text-[12px] font-bold text-slate-500">Carrier</span>
              <Input
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                placeholder="e.g. UPS, FedEx, DHL"
                className="rounded-xl"
                required
              />
            </div>
            <div className="space-y-1">
              <span className="text-[12px] font-bold text-slate-500">Shipping Service</span>
              <Select
                value={shippingType}
                onValueChange={(val) => setShippingType(val as "standard" | "priority")}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Standard" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[12px] font-bold text-slate-500">Tracking Number</span>
            <Input
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter shipment tracking reference"
              className="rounded-xl"
              required
            />
          </div>

          <div className="space-y-1">
            <span className="text-[12px] font-bold text-slate-500">Est. Transit Duration (Days)</span>
            <Select value={estimatedDays} onValueChange={setEstimatedDays}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="5 Days" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 Days (Express)</SelectItem>
                <SelectItem value="5">5 Days (Standard)</SelectItem>
                <SelectItem value="10">10 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <span className="text-[12px] font-bold text-slate-500">Tracking Link URL (Optional)</span>
            <Input
              value={trackingUrl}
              onChange={(e) => setTrackingUrl(e.target.value)}
              placeholder="e.g. https://www.ups.com/track?loc=en..."
              type="url"
              className="rounded-xl"
            />
          </div>

          <div className="space-y-1">
            <span className="text-[12px] font-bold text-slate-500">Additional Notes (Optional)</span>
            <Textarea
              value={returnNotes}
              onChange={(e) => setReturnNotes(e.target.value)}
              placeholder="Any details for package dropoff..."
              className="rounded-xl min-h-[70px] resize-none text-[13px]"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsShipReturnModalOpen(false)}
              className="flex-1 h-12 rounded-[14px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isShipReturnPending || !carrier.trim() || !trackingNumber.trim()}
              className="flex-1 h-12 rounded-[14px] bg-primary text-white font-bold"
            >
              {isShipReturnPending ? <span>Registering...</span> : <span>Submit Tracking</span>}
            </Button>
          </div>
        </form>
      </AnimatedModal>
    </div>
  );
}
