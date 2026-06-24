"use client";

import React, { useState } from "react";
import { Check, Mail, Copy, ChevronDown, ChevronUp, Image as ImageIcon, PenSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Step5ReviewPublishProps {
  formData: {
    title: string;
    price: number;
    category: string;
    condition: string;
    orderType: string;
    isGraded: boolean;
    gradedSerial?: string;
    description: string;
  };
  shippingData: {
    handlingTime: string;
    carrier: string;
    shippingType: string;
    isInsured: boolean;
  };
  feesData: {
    feeStructure: string;
  };
  mainPhoto: string | null;
  productPhotos: {
    back: string | null;
    leftSide: string | null;
    rightSide: string | null;
    detail: string | null;
  };
  verificationVideo: Blob | null;
  trustScore: number;
  onBack: () => void;
  onEdit: () => void;
  buyerEmail: string;
  setBuyerEmail: (email: string) => void;
  agreedTerms: boolean;
  setAgreedTerms: (agreed: boolean) => void;
  isSubmitting: boolean;
  isSuccess: boolean;
  dealId: string;
  handlePublish: (e: React.FormEvent) => void;
}

export const Step5ReviewPublish: React.FC<Step5ReviewPublishProps> = ({
  formData,
  shippingData,
  feesData,
  mainPhoto,
  productPhotos,
  verificationVideo,
  trustScore,
  onEdit,
  buyerEmail,
  setBuyerEmail,
  agreedTerms,
  setAgreedTerms,
  dealId,
  isSuccess,
  handlePublish,
}) => {
  const [showBreakdown, setShowBreakdown] = useState(false);

  const copyDealLink = () => {
    const link = `https://trustlayer.escrow/deals/${dealId}`;
    navigator.clipboard.writeText(link);
    toast.success("Deal invitation link copied to clipboard!");
  };

  if (isSuccess) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="flex-1 flex flex-col h-full justify-between bg-background relative overflow-hidden"
        >
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto pr-0.5 flex flex-col items-center justify-center text-center scrollbar-none pb-28 pt-4">
            <div className="absolute top-10 left-10 w-3 h-3 rounded-full bg-primary/20 animate-ping" />
            <div className="absolute bottom-16 right-12 w-4 h-4 rounded-full bg-emerald-500/20 animate-bounce" />

            <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30 mb-6 shadow-sm shadow-emerald-500/10">
              <Check className="w-10 h-10 text-emerald-500 stroke-[3]" />
            </div>

            <h2 className="text-2xl font-extrabold text-foreground tracking-tight mb-2">
              Escrow Deal Created!
            </h2>
            <p className="text-xs text-muted-foreground max-w-[300px] leading-relaxed mb-8">
              Your verification proofs have been secured. Send the deal invitation link to your buyer.
            </p>

            {/* Deal details preview */}
            <div className="w-full bg-muted/30 border border-border/40 rounded-3xl p-5 mb-8 flex flex-col gap-4 text-left">
              <div className="flex justify-between items-center pb-3 border-b border-border/30">
                <span className="text-xs font-bold text-foreground max-w-[200px] truncate">{formData.title}</span>
                <span className="text-sm font-extrabold text-primary">${formData.price.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                <span>Deal ID</span>
                <span className="text-foreground">{dealId}</span>
              </div>

              <div className="flex justify-between items-center text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                <span>Security Score</span>
                <span className="text-emerald-500 font-black">{trustScore}/100</span>
              </div>
            </div>

            {/* Copy Link box */}
            <div className="w-full bg-muted/40 rounded-2xl p-3 border border-border/30 flex items-center justify-between mb-8 gap-3">
              <span className="text-[11px] font-medium text-muted-foreground truncate select-all pl-2">
                trustlayer.escrow/deals/{dealId}
              </span>
              <Button
                onClick={copyDealLink}
                size="sm"
                variant="secondary"
                className="rounded-xl h-8 font-bold text-[10px] tracking-wider uppercase flex items-center gap-1.5 shrink-0 bg-primary/5 text-primary hover:bg-primary/10 border-none"
              >
                <Copy className="w-3.5 h-3.5" /> Copy
              </Button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  const extraPhotosCount = Object.values(productPhotos).filter(Boolean).length;

  // Determine tier and color scheme for premium card
  let tier = "GETTING STARTED";
  if (trustScore >= 1 && trustScore < 60) {
    tier = "LOW";
  } else if (trustScore >= 60 && trustScore < 80) {
    tier = "MEDIUM";
  } else if (trustScore >= 80 && trustScore < 100) {
    tier = "HIGH";
  } else if (trustScore === 100) {
    tier = "EXCELLENT";
  }

  return (
    <div className="flex flex-col h-full flex-1 overflow-hidden text-left select-none">
      <form id="step5-form" onSubmit={handlePublish} className="flex-1 flex flex-col overflow-hidden">
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pr-0.5 space-y-6 scrollbar-none pb-28">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-extrabold text-foreground tracking-tight">Review deal</h2>
          </div>

          {/* Premium Trust Score Card */}
          <div className="w-full bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-3xl p-6 shadow-md text-white flex flex-col gap-4 relative overflow-hidden">
            {/* Ambient glows */}
            <div className="absolute -right-10 -top-10 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />
            
            <div className="flex items-start justify-between relative z-10">
              <div className="flex flex-col gap-1">
                <span className="text-lg font-extrabold tracking-tight">Trust Score</span>
                <span className="text-[9px] font-black px-2 py-0.5 rounded-md border-none uppercase tracking-wider w-fit mt-1 bg-white/20 text-white">
                  {tier}
                </span>
              </div>
              <div className="flex items-baseline text-white">
                <span className="text-4xl font-extrabold tracking-tight">{trustScore}</span>
                <span className="text-lg font-semibold text-blue-100/60">/100</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full relative z-10">
              <div className="w-full h-2.5 bg-blue-950/45 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${trustScore}%` }}
                />
              </div>
            </div>

            {/* Expandable Action Link */}
            <div
              onClick={() => setShowBreakdown((prev) => !prev)}
              className="flex items-center justify-center gap-1.5 cursor-pointer text-xs text-blue-100/80 font-bold hover:text-white transition-colors relative z-10 w-full pt-1"
            >
              <span>View Breakdown</span>
              {showBreakdown ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </div>

            {/* Score Breakdown List */}
            <AnimatePresence initial={false}>
              {showBreakdown && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-col gap-2.5 pt-3 border-t border-white/10 relative z-10 text-xs text-blue-100/90 font-semibold">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-4.5 h-4.5 rounded-full flex items-center justify-center border ${mainPhoto ? "bg-white/20 border-white text-white" : "border-white/20 text-white/40"}`}>
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <span>Main Photo</span>
                      </div>
                      <span className={mainPhoto ? "text-white font-extrabold" : "text-white/40"}>+15 pts</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-4.5 h-4.5 rounded-full flex items-center justify-center border ${extraPhotosCount > 0 ? "bg-white/20 border-white text-white" : "border-white/20 text-white/40"}`}>
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <span>Additional Photos ({extraPhotosCount}/4 verified)</span>
                      </div>
                      <span className={extraPhotosCount > 0 ? "text-white font-extrabold" : "text-white/40"}>
                        +{Math.round((extraPhotosCount / 4) * 15)} pts
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-4.5 h-4.5 rounded-full flex items-center justify-center border ${verificationVideo ? "bg-white/20 border-white text-white" : "border-white/20 text-white/40"}`}>
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <span>Product Video</span>
                      </div>
                      <span className={verificationVideo ? "text-white font-extrabold" : "text-white/40"}>+30 pts</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Deal Detail Review Card */}
          <div className="w-full bg-background border border-border/80 rounded-[32px] p-5 shadow-xs flex flex-col gap-4 relative">
            {/* Edit Button */}
            <button
              type="button"
              onClick={onEdit}
              className="absolute top-4 right-4 bg-muted/40 hover:bg-muted/65 border border-border/60 text-foreground font-bold px-3 py-1.5 rounded-full text-[11px] flex items-center gap-1 active:scale-95 transition-all z-10"
            >
              <PenSquare className="w-3.5 h-3.5" />
              <span>Edit Deal</span>
            </button>

            {/* Media Display preview */}
            <div className="w-full aspect-video rounded-2xl overflow-hidden bg-muted/30 border border-border/40 flex items-center justify-center relative">
              {mainPhoto ? (
                <img src={mainPhoto} alt="Product preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground/60 p-6">
                  <ImageIcon className="w-8 h-8 stroke-[1.5]" />
                  <span className="text-[11px] font-bold tracking-wider uppercase">No photo uploaded</span>
                </div>
              )}
            </div>

            {/* Title & Price */}
            <div className="flex flex-col gap-1 mt-1 text-left">
              <h3 className="text-base font-extrabold text-foreground leading-snug">{formData.title}</h3>
              <span className="text-xl font-black text-primary">${formData.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>

            {/* Item Details spec list */}
            <div className="flex flex-col gap-3 pt-4 border-t border-border/20">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Item Details</span>
              
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-muted-foreground font-medium">Product Type</span>
                  <span className="text-xs font-bold text-foreground">{formData.category}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-muted-foreground font-medium">Condition</span>
                  <span className="text-xs font-bold text-foreground">{formData.condition}</span>
                </div>
              </div>

              {formData.description && (
                <div className="flex flex-col gap-1 mt-1">
                  <span className="text-[10px] text-muted-foreground font-medium">Description</span>
                  <p className="text-xs font-semibold text-foreground/80 leading-relaxed bg-muted/15 border border-border/40 rounded-xl p-3">
                    {formData.description}
                  </p>
                </div>
              )}
            </div>

            {/* Transaction spec list */}
            <div className="flex flex-col gap-3 pt-4 border-t border-border/20">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Transaction</span>
              
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-muted-foreground font-medium">Order Type</span>
                  <span className="text-xs font-bold text-foreground">{formData.orderType}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-muted-foreground font-medium">Shipping</span>
                  <span className="text-xs font-bold text-foreground">
                    {shippingData.carrier} ({shippingData.shippingType})
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-muted-foreground font-medium">Handling Time</span>
                  <span className="text-xs font-bold text-foreground">{shippingData.handlingTime}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-muted-foreground font-medium">Shipping Cost</span>
                  <span className="text-xs font-bold text-emerald-500 font-extrabold uppercase">FREE</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-muted-foreground font-medium">Insurance</span>
                  <span className="text-xs font-bold text-foreground">
                    {shippingData.isInsured ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-muted-foreground font-medium">Fee Structure</span>
                  <span className="text-xs font-bold text-foreground">{feesData.feeStructure}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Buyer Email */}
          <div className="flex flex-col gap-1.5 pt-2">
            <Label htmlFor="buyer-email" className="text-xs font-semibold text-foreground/80">
              Buyer Email Address (Optional)
            </Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="buyer-email"
                type="email"
                value={buyerEmail}
                onChange={(e) => setBuyerEmail(e.target.value)}
                placeholder="buyer@example.com"
                className="pl-10 border-border/80 rounded-2xl h-11 text-sm font-semibold"
              />
            </div>
            <p className="text-[10px] text-muted-foreground leading-normal pl-1">
              We will automatically send the secure checkout link to this email.
            </p>
          </div>

          {/* Escrow Agreement Checkbox */}
          <label className="flex items-start gap-3 cursor-pointer mt-2 bg-muted/20 border border-border/30 rounded-2xl p-4">
            <input
              type="checkbox"
              checked={agreedTerms}
              onChange={(e) => setAgreedTerms(e.target.checked)}
              className="mt-0.5 accent-primary h-4.5 w-4.5 rounded border-border/85 shrink-0"
            />
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] font-bold text-foreground leading-none">Secure Escrow Agreement</span>
              <span className="text-[10px] text-muted-foreground leading-normal mt-1.5">
                I agree that this transaction is protected by TrustLayer Escrow. Funds will be held until the buyer receives and validates the product condition.
              </span>
            </div>
          </label>
        </div>
      </form>
    </div>
  );
};
