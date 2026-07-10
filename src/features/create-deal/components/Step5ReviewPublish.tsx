"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Check, Image as ImageIcon, PenSquare, Shield } from "lucide-react";
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
import { TrustScoreCard } from "./TrustScoreCard";

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
  isUpdateMode?: boolean;
  dealStatus?: string | null;
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
  dealNumber,
  isSuccess,
  handlePublish,
  isUpdateMode = false,
}) => {
  const router = useRouter();

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
              {isUpdateMode ? "Deal updated and published" : "Deal published"}
            </h2>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-8 max-w-[320px]">
              {isUpdateMode
                ? "Your deal has been updated and is live. Send this link to your buyer to complete the deal."
                : "Send this link to your buyer. It's the only place they can fund this deal."}
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

  const breakdown = {
    hasItemDetails: true,
    hasMainPhoto: !!mainPhoto,
    additionalPhotosCount: extraPhotosCount,
    hasVideo: !!verificationVideo,
    hasCertPhoto: !!certPhoto,
    isGraded: formData.isGraded,
  };

  return (
    <div className="flex flex-col h-full flex-1 overflow-hidden text-left select-none">
      <form id="step5-form" onSubmit={handlePublish} className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto pr-0.5 space-y-6 scrollbar-none pb-28">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-extrabold text-foreground tracking-tight">
              {isUpdateMode ? "Review updates" : "Review deal"}
            </h2>
          </div>

          {/* Premium Trust Score Card */}
          <TrustScoreCard
            score={trustScore}
            breakdown={breakdown}
            variant="review"
          />

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
                {formData.orderType !== "In-Person Transaction" && (
                  <>
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
                  </>
                )}
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-xs text-muted-foreground font-semibold">Platform Fee</span>
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
