"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Check, ChevronDown, ChevronUp, Image as ImageIcon, PenSquare, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ShareableDealLink } from "@/components/shared/ShareableDealLink";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
} from "@/components/ui/carousel";
import { FRONTEND_ROUTES } from "@/lib/contants";
import { cn } from "@/lib/utils";

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
    shippingCost: number | null;
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
  verificationVideo: Blob | string | null;
  certPhoto: string | null;
  trustScore: number;
  onBack: () => void;
  onEdit: () => void;
  isSubmitting: boolean;
  isSuccess: boolean;
  dealId: string;
  dealNumber: string;
  handlePublish: (e: React.FormEvent) => void;
}

export const Step5ReviewPublish: React.FC<Step5ReviewPublishProps> = ({
  formData,
  shippingData,
  feesData,
  mainPhoto,
  productPhotos,
  verificationVideo,
  certPhoto,
  trustScore,
  onEdit,
  dealId,
  dealNumber,
  isSuccess,
  handlePublish,
}) => {
  const router = useRouter();
  const [showBreakdown, setShowBreakdown] = useState(false);
  const videoUrl = useMemo(() => {
    if (!verificationVideo) return null;
    if (typeof verificationVideo === "string") return verificationVideo;
    return URL.createObjectURL(verificationVideo);
  }, [verificationVideo]);

  useEffect(() => {
    return () => {
      if (videoUrl && typeof verificationVideo !== "string") {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl, verificationVideo]);

  // Aggregate all media items
  const mediaItems: { type: "image" | "video"; url: string; label: string }[] = [];
  if (mainPhoto) {
    mediaItems.push({ type: "image", url: mainPhoto, label: "Main Photo" });
  }
  if (productPhotos.back) {
    mediaItems.push({ type: "image", url: productPhotos.back, label: "Back View" });
  }
  if (productPhotos.leftSide) {
    mediaItems.push({ type: "image", url: productPhotos.leftSide, label: "Left View" });
  }
  if (productPhotos.rightSide) {
    mediaItems.push({ type: "image", url: productPhotos.rightSide, label: "Right View" });
  }
  if (productPhotos.detail) {
    mediaItems.push({ type: "image", url: productPhotos.detail, label: "Detail View" });
  }
  if (certPhoto) {
    mediaItems.push({ type: "image", url: certPhoto, label: "Certificate" });
  }
  if (videoUrl) {
    mediaItems.push({ type: "video", url: videoUrl, label: "Product Video" });
  }

  if (isSuccess) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="flex-1 flex flex-col h-full bg-background relative overflow-hidden px-1"
        >
          {/* Header Navigation */}
          <div className="w-full flex items-center justify-between py-4 border-b border-border/40 shrink-0">
            <span className="text-lg font-black text-foreground tracking-tight flex items-center gap-1.5">
              <Shield className="w-5 h-5 text-primary fill-primary/10" />
              <span>TrustLayer</span>
            </span>
            <div className="flex items-center gap-1 text-xs font-bold text-muted-foreground/90 bg-muted/50 border border-border/40 px-2.5 py-1 rounded-full">
              <Check className="w-3 h-3 text-emerald-500 stroke-[3]" />
              <span>Secured by TrustLayer</span>
            </div>
          </div>

          {/* Main Success Content */}
          <div className="flex-1 flex flex-col items-center justify-center text-center pb-28 pt-8 px-2 max-w-md mx-auto w-full">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30 mb-6 shadow-md shadow-emerald-500/5 animate-scale-in">
              <Check className="w-10 h-10 text-emerald-500 stroke-[3.5]" />
            </div>

            <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">
              Deal published
            </h2>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-8 max-w-[320px]">
              Send this link to your buyer. {"It's"} the only place they can fund this deal.
            </p>

            {/* Shareable Link Box */}
            <ShareableDealLink dealNumber={dealNumber} className="mb-8" />

            <div className="w-full flex flex-col gap-3">
              <Button
                onClick={() => router.push(FRONTEND_ROUTES.BUYER_VIEW(dealNumber!))}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/95 shadow-md shadow-primary/10 rounded-2xl h-14 text-base font-bold active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 border-none cursor-pointer"
              >
                <span>Open deal as buyer</span>
                <span className="text-lg font-medium">→</span>
              </Button>

              <Button
                onClick={() => router.push(FRONTEND_ROUTES.DASHBOARD)}
                variant="outline"
                className="w-full border-border/80 rounded-2xl h-14 text-base font-bold active:scale-[0.98] transition-all"
              >
                Back to dashboard
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
                    {/* Verified Seller Profile — always earned */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-white/20 border border-white flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <span>Verified Seller Profile</span>
                      </div>
                      <span className="text-white font-extrabold">+20 pts</span>
                    </div>

                    {/* Item Details — always true in step 5 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-white/20 border border-white flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <span>Item Details</span>
                      </div>
                      <span className="text-white font-extrabold">+20 pts</span>
                    </div>

                    {/* Main Photo */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-4 h-4 rounded-full flex items-center justify-center border shrink-0", mainPhoto ? "bg-white/20 border-white" : "border-white/25")}>
                          <Check className={cn("w-2.5 h-2.5 stroke-[3]", !mainPhoto && "opacity-30")} />
                        </div>
                        <span className={mainPhoto ? "" : "opacity-50"}>Main Photo</span>
                      </div>
                      <span className={mainPhoto ? "text-white font-extrabold" : "opacity-40"}>+15 pts</span>
                    </div>

                    {/* Additional Photos */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-4 h-4 rounded-full flex items-center justify-center border shrink-0", extraPhotosCount > 0 ? "bg-white/20 border-white" : "border-white/25")}>
                          <Check className={cn("w-2.5 h-2.5 stroke-[3]", extraPhotosCount === 0 && "opacity-30")} />
                        </div>
                        <span className={extraPhotosCount > 0 ? "" : "opacity-50"}>Additional Photos ({extraPhotosCount}/4)</span>
                      </div>
                      <span className={extraPhotosCount > 0 ? "text-white font-extrabold" : "opacity-40"}>
                        +{Math.round((extraPhotosCount / 4) * 15)} pts
                      </span>
                    </div>

                    {/* Product Video */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-4 h-4 rounded-full flex items-center justify-center border shrink-0", verificationVideo ? "bg-white/20 border-white" : "border-white/25")}>
                          <Check className={cn("w-2.5 h-2.5 stroke-[3]", !verificationVideo && "opacity-30")} />
                        </div>
                        <span className={verificationVideo ? "" : "opacity-50"}>Product Video</span>
                      </div>
                      <span className={verificationVideo ? "text-white font-extrabold" : "opacity-40"}>
                        +{formData.isGraded ? 20 : 30} pts
                      </span>
                    </div>

                    {/* Certificate Photo */}
                    {formData.isGraded && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={cn("w-4 h-4 rounded-full flex items-center justify-center border shrink-0", certPhoto ? "bg-white/20 border-white" : "border-white/25")}>
                            <Check className={cn("w-2.5 h-2.5 stroke-[3]", !certPhoto && "opacity-30")} />
                          </div>
                          <span className={certPhoto ? "" : "opacity-50"}>Certificate Photo</span>
                        </div>
                        <span className={certPhoto ? "text-white font-extrabold" : "opacity-40"}>+10 pts</span>
                      </div>
                    )}
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
              className="absolute top-4 right-4 bg-black/60 hover:bg-black/75 text-white border-none font-bold px-3.5 py-1.5 rounded-full text-[11px] flex items-center gap-1 active:scale-95 transition-all z-20 cursor-pointer shadow-md"
            >
              <PenSquare className="w-3.5 h-3.5" />
              <span>Edit Deal</span>
            </button>

            {/* Carousel-based Media Display Preview */}
            <div className="w-full aspect-square rounded-2xl overflow-hidden bg-muted/30 border border-border/40 flex items-center justify-center relative select-none">
              {mediaItems.length > 0 ? (
                <Carousel className="w-full h-full">
                  <CarouselContent className="h-full">
                    {mediaItems.map((item, idx) => (
                      <CarouselItem key={idx} className="relative w-full h-full">
                        {item.type === "video" ? (
                          <video
                            src={item.url}
                            controls
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Image
                            src={item.url}
                            alt={item.label || "Review View"}
                            fill
                            className="object-cover"
                          />
                        )}

                        {/* Top-left float badge for graded items / trust score */}
                        {formData.isGraded && (
                          <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10 pointer-events-none">
                            <span className="bg-black/75 text-white font-black text-[9px] tracking-widest uppercase px-2.5 py-1.5 rounded-lg w-fit shadow-md">
                              {formData.gradedSerial || "PSA 10"}
                            </span>
                            <span className="bg-yellow-500 text-black font-black text-[9px] tracking-widest uppercase px-2.5 py-1.5 rounded-lg w-fit shadow-md">
                              TRUST {trustScore}
                            </span>
                          </div>
                        )}
                      </CarouselItem>
                    ))}
                  </CarouselContent>

                  {mediaItems.length > 1 && (
                    <>
                      <CarouselPrevious className="left-3 bg-black/45 text-white hover:bg-black/60 hover:text-white border-none w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-lg z-10" />
                      <CarouselNext className="right-3 bg-black/45 text-white hover:bg-black/60 hover:text-white border-none w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-lg z-10" />
                      <CarouselDots className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10" />
                    </>
                  )}
                </Carousel>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground/60 p-6">
                  <ImageIcon className="w-8 h-8 stroke-[1.5]" />
                  <span className="text-[11px] font-bold tracking-wider uppercase">No photo uploaded</span>
                </div>
              )}
            </div>

            {/* Media Count Status Info Bar */}
            <div className="w-full bg-muted/40 border border-border/40 rounded-xl py-2 px-4 flex items-center justify-center text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground gap-3.5">
              <span>{mediaItems.filter(i => i.type === "image" && i.label !== "Certificate").length} Photos</span>
              <span className="text-border/80">|</span>
              <span>{verificationVideo ? "1 Video" : "0 Video"}</span>
              <span className="text-border/80">|</span>
              <span>{certPhoto ? "1 Cert" : "0 Cert"}</span>
            </div>

            {/* Title & Price */}
            <div className="flex flex-col gap-1 mt-1 text-left">
              <h3 className="text-[17px] font-extrabold text-foreground leading-snug">{formData.title}</h3>
              <span className="text-2xl font-black text-primary">
                ${formData.price % 1 === 0 ? formData.price.toLocaleString() : formData.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>

            {/* Item Details spec list */}
            <div className="flex flex-col gap-3.5 pt-4 border-t border-border/20">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Item Details</span>

              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground font-semibold">Product Type</span>
                  <span className="text-sm font-bold text-foreground">{formData.category}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground font-semibold">Condition</span>
                  <span className="text-sm font-bold text-foreground">{formData.condition}</span>
                </div>
              </div>

              {formData.description && (
                <div className="flex flex-col gap-1 mt-1">
                  <span className="text-xs text-muted-foreground font-semibold">Description</span>
                  <p className="text-sm font-semibold text-foreground/90 leading-relaxed">
                    {formData.description}
                  </p>
                </div>
              )}
            </div>

            {/* Transaction spec list */}
            <div className="flex flex-col gap-3.5 pt-4 border-t border-border/20">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Transaction</span>

              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-xs text-muted-foreground font-semibold">Order Type</span>
                  <span className="text-sm font-bold text-foreground">{formData.orderType}</span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-xs text-muted-foreground font-semibold">Handling Time</span>
                  <span className="text-sm font-bold text-foreground">{shippingData.handlingTime}</span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-xs text-muted-foreground font-semibold">Shipping Cost</span>
                  <span className="text-sm font-extrabold text-emerald-500 uppercase">
                    {(shippingData.shippingCost ?? 0) > 0 ? `$${(shippingData.shippingCost ?? 0).toFixed(2)}` : "FREE"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-xs text-muted-foreground font-semibold">Fee Structure</span>
                  <span className="text-sm font-bold text-foreground">{feesData.feeStructure}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
