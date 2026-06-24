"use client";

import React, { useState } from "react";
import { Camera, Video, Image, Check, RefreshCw, AlertCircle, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { CameraCapture } from "./CameraCapture";
import { Badge } from "@/components/ui/badge";
import { TrustScoreHeader, TrustScoreBreakdown } from "./TrustScoreHeader";

interface Step2ProofVerificationProps {
  mainPhoto: string | null;
  productPhotos: {
    back: string | null;
    leftSide: string | null;
    rightSide: string | null;
    detail: string | null;
  };
  verificationVideo: Blob | null;
  certPhoto: string | null;
  isGraded: boolean;
  onCaptureMainPhoto: (dataUrl: string) => void;
  onCaptureProductPhotoSlot: (slot: "back" | "leftSide" | "rightSide" | "detail", dataUrl: string) => void;
  onCaptureVideo: (videoBlob: Blob) => void;
  onCaptureCertPhoto: (dataUrl: string) => void;
  onContinue: () => void;
  onBack: () => void;
  trustScore?: number;
  nextStepName?: string;
  breakdown?: TrustScoreBreakdown;
}

const PHOTO_SLOTS = [
  { id: "back", label: "Front View", desc: "Front side of product" },
  { id: "leftSide", label: "Back View", desc: "Back side of product" },
  { id: "rightSide", label: "Side View", desc: "Side panel details" },
  { id: "detail", label: "Detail View", desc: "Serial or markings" },
] as const;

export const Step2ProofVerification: React.FC<Step2ProofVerificationProps> = ({
  mainPhoto,
  productPhotos,
  verificationVideo,
  certPhoto,
  isGraded,
  onCaptureMainPhoto,
  onCaptureProductPhotoSlot,
  onCaptureVideo,
  onCaptureCertPhoto,
  trustScore,
  nextStepName,
  breakdown,
}) => {
  const [activeAccordion, setActiveAccordion] = useState<string>("main-photo");

  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetType, setSheetType] = useState<"main" | "back" | "leftSide" | "rightSide" | "detail" | "video" | "cert" | null>(null);

  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraType, setCameraType] = useState<"main" | "back" | "leftSide" | "rightSide" | "detail" | "video" | "cert" | null>(null);

  const capturedPhotosCount = Object.values(productPhotos).filter(Boolean).length;
  const isProductPhotosComplete = capturedPhotosCount === 4;

  const handleOpenGuidelines = (type: typeof sheetType) => {
    setSheetType(type);
    setSheetOpen(true);
  };

  const handleContinueToCamera = () => {
    setSheetOpen(false);
    if (sheetType) {
      setCameraType(sheetType);
      setCameraOpen(true);
    }
  };

  const videoUrl = verificationVideo ? URL.createObjectURL(verificationVideo) : null;

  return (
    <div className="flex flex-col h-full flex-1 overflow-hidden text-left select-none">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pr-0.5 space-y-6 scrollbar-none pb-28">

        {typeof trustScore === "number" && (
          <TrustScoreHeader score={trustScore} nextStepName={nextStepName} breakdown={breakdown} />
        )}

        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Proof & Verification</h2>
          <h3 className="text-base font-bold text-foreground">Verification Journey</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Complete these steps to build your Trust Score.
          </p>
        </div>

        {/* Accordion List */}
        <Accordion
          type="single"
          collapsible
          value={activeAccordion}
          onValueChange={(val) => setActiveAccordion(val)}
          className="w-full flex flex-col gap-4"
        >
          {/* 1. Main Photo */}
          <AccordionItem
            value="main-photo"
            className="border border-border/50 rounded-2xl px-4 py-1.5 bg-card/40 overflow-hidden"
          >
            <AccordionTrigger className="hover:no-underline py-3">
              <div className="flex items-center gap-3 text-left">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                  mainPhoto
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                    : "bg-muted border-border/80 text-muted-foreground"
                }`}>
                  {mainPhoto ? <Check className="w-4.5 h-4.5 stroke-[2.5]" /> : <Camera className="w-4.5 h-4.5" />}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-extrabold text-foreground">1. Main Photo</span>
                  <span className={`text-xs font-semibold ${mainPhoto ? "text-emerald-500" : "text-destructive/80"}`}>
                    {mainPhoto ? "Completed" : "Required"}
                  </span>
                </div>
              </div>
              <div className="ml-auto mr-3">
                {mainPhoto ? (
                  <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-none font-bold text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Done
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-bold text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Required
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4 flex flex-col gap-4 border-t border-border/10 mt-1">
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                The primary photo buyers see in search results and summary blocks. Make it counts.
              </p>
              {mainPhoto ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border/40 bg-muted max-w-[280px]">
                    <img src={mainPhoto} alt="Main Preview" className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full p-1 shadow-sm">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleOpenGuidelines("main")}
                    className="rounded-xl font-bold text-[11px] tracking-wider uppercase h-9 flex items-center gap-1.5 border-border/80 active:scale-[0.98] transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Retake Photo
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  onClick={() => handleOpenGuidelines("main")}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/95 shadow-md shadow-primary/10 rounded-xl h-10 text-xs font-bold active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <Camera className="w-4 h-4" /> Take Main Photo
                </Button>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* 2. Product Photos */}
          <AccordionItem
            value="product-photos"
            className="border border-border/50 rounded-2xl px-4 py-1.5 bg-card/40 overflow-hidden"
          >
            <AccordionTrigger className="hover:no-underline py-3">
              <div className="flex items-center gap-3 text-left">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                  isProductPhotosComplete
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                    : "bg-muted border-border/80 text-muted-foreground"
                }`}>
                  {isProductPhotosComplete ? <Check className="w-4.5 h-4.5 stroke-[2.5]" /> : <Image className="w-4.5 h-4.5" />}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-extrabold text-foreground">2. Product Photos</span>
                  <span className={`text-xs font-semibold ${isProductPhotosComplete ? "text-emerald-500" : "text-muted-foreground"}`}>
                    {capturedPhotosCount}/4 Completed
                  </span>
                </div>
              </div>
              <div className="ml-auto mr-3">
                <Badge variant="secondary" className={`border-none font-bold text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  isProductPhotosComplete ? "bg-emerald-500/10 text-emerald-500" : "bg-muted/60 text-muted-foreground"
                }`}>
                  {capturedPhotosCount}/4
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4 flex flex-col gap-4 border-t border-border/10 mt-1">
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Capture multiple angles to build maximum buyer confidence and prevent disputes.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {PHOTO_SLOTS.map((slot) => {
                  const image = productPhotos[slot.id];
                  return (
                    <div
                      key={slot.id}
                      onClick={() => handleOpenGuidelines(slot.id)}
                      className={`aspect-square rounded-xl border overflow-hidden relative cursor-pointer group flex flex-col items-center justify-center p-2.5 transition-all ${
                        image
                          ? "border-emerald-500/50 bg-background/50"
                          : "border-dashed border-border/80 hover:border-primary/50 bg-muted/20 hover:bg-primary/5"
                      }`}
                    >
                      {image ? (
                        <>
                          <img src={image} alt={slot.label} className="absolute inset-0 w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                              <RefreshCw className="w-3.5 h-3.5" />
                            </div>
                          </div>
                          <div className="absolute top-1.5 right-1.5 bg-emerald-500 text-white rounded-full p-0.5 shadow-sm">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                          <div className="absolute bottom-1.5 left-1.5 right-1.5 bg-black/60 backdrop-blur-md py-0.5 px-1.5 rounded border border-white/10 text-center">
                            <span className="text-[7.5px] font-extrabold text-white uppercase tracking-wider truncate block">
                              {slot.label}
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-8 h-8 rounded-full bg-background border border-border/50 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform mb-2">
                            <Camera className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                          <span className="text-xs font-bold text-foreground text-center group-hover:text-primary transition-colors">
                            {slot.label}
                          </span>
                          <span className="text-[10px] text-muted-foreground text-center leading-normal mt-0.5 max-w-[100px] truncate">
                            {slot.desc}
                          </span>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* 3. Video Verification */}
          <AccordionItem
            value="video"
            className="border border-border/50 rounded-2xl px-4 py-1.5 bg-card/40 overflow-hidden"
          >
            <AccordionTrigger className="hover:no-underline py-3">
              <div className="flex items-center gap-3 text-left">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                  verificationVideo
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                    : "bg-muted border-border/80 text-muted-foreground"
                }`}>
                  {verificationVideo ? <Check className="w-4.5 h-4.5 stroke-[2.5]" /> : <Video className="w-4.5 h-4.5" />}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-extrabold text-foreground">3. Video Verification</span>
                  <span className={`text-xs font-semibold ${verificationVideo ? "text-emerald-500" : "text-primary"}`}>
                    {verificationVideo ? "Completed" : isGraded ? "+20 Trust Score" : "+30 Trust Score"}
                  </span>
                </div>
              </div>
              <div className="ml-auto mr-3">
                {verificationVideo ? (
                  <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-none font-bold text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Done
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-bold text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {isGraded ? "+20" : "+30"}
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4 flex flex-col gap-4 border-t border-border/10 mt-1">
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Record a quick 5-second video scan rotating around the item to prove physical possession.
              </p>
              {verificationVideo && videoUrl ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border/40 bg-black max-w-[280px]">
                    <video src={videoUrl} controls className="w-full h-full object-cover" />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleOpenGuidelines("video")}
                    className="rounded-xl font-bold text-[11px] tracking-wider uppercase h-9 flex items-center gap-1.5 border-border/80 active:scale-[0.98] transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Retake Video
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  onClick={() => handleOpenGuidelines("video")}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/95 shadow-md shadow-primary/10 rounded-xl h-10 text-xs font-bold active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <Video className="w-4 h-4" /> Start Product Video
                </Button>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* 4. Certification — only when item is graded */}
          {isGraded && (
            <AccordionItem
              value="certification"
              className="border border-border/50 rounded-2xl px-4 py-1.5 bg-card/40 overflow-hidden"
            >
              <AccordionTrigger className="hover:no-underline py-3">
                <div className="flex items-center gap-3 text-left">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                    certPhoto
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                      : "bg-muted border-border/80 text-muted-foreground"
                  }`}>
                    {certPhoto ? <Check className="w-4.5 h-4.5 stroke-[2.5]" /> : <Award className="w-4.5 h-4.5" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-extrabold text-foreground">4. Certification</span>
                    <span className={`text-xs font-semibold ${certPhoto ? "text-emerald-500" : "text-primary"}`}>
                      {certPhoto ? "Completed" : "+10 Trust Score"}
                    </span>
                  </div>
                </div>
                <div className="ml-auto mr-3">
                  {certPhoto ? (
                    <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-none font-bold text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Done
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-bold text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                      +10
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-4 flex flex-col gap-4 border-t border-border/10 mt-1">
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Photograph your PSA slab, grading receipt, or authenticity certificate to boost buyer confidence.
                </p>
                {certPhoto ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border/40 bg-muted max-w-[280px]">
                      <img src={certPhoto} alt="Certificate" className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full p-1 shadow-sm">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleOpenGuidelines("cert")}
                      className="rounded-xl font-bold text-[11px] tracking-wider uppercase h-9 flex items-center gap-1.5 border-border/80 active:scale-[0.98] transition-all"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Retake Photo
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    onClick={() => handleOpenGuidelines("cert")}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/95 shadow-md shadow-primary/10 rounded-xl h-10 text-xs font-bold active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    <Camera className="w-4 h-4" /> Take Certificate Photo
                  </Button>
                )}
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </div>

      {/* Guidelines Bottom Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom" className="p-6 bg-card border-t border-border/40">
          <SheetHeader className="pb-4 border-b border-border/20">
            <SheetTitle className="text-center font-extrabold text-foreground flex items-center justify-center gap-2">
              {sheetType === "video" ? (
                <>
                  <Video className="w-5 h-5 text-primary fill-primary/10" />
                  <span>Product Video Instructions</span>
                </>
              ) : sheetType === "cert" ? (
                <>
                  <Award className="w-5 h-5 text-primary" />
                  <span>Certificate Photo Guidelines</span>
                </>
              ) : (
                <>
                  <Camera className="w-5 h-5 text-primary fill-primary/10" />
                  <span>
                    {sheetType === "main"
                      ? "Main Photo Guidelines"
                      : `${PHOTO_SLOTS.find((s) => s.id === sheetType)?.label || "Angle"} Guidelines`}
                  </span>
                </>
              )}
            </SheetTitle>
            <SheetDescription className="text-center text-[11px] text-muted-foreground max-w-[340px] mx-auto leading-relaxed">
              {sheetType === "video"
                ? "Prove physical ownership by recording a short live video scan of your product."
                : sheetType === "cert"
                ? "Photograph your grading certificate, PSA slab label, or authenticity document clearly."
                : sheetType === "main"
                ? "This is the primary photo buyers will see. Make sure it's clear, well-lit, and showcases the whole item."
                : "Provide a detailed angle to showcase authenticity, corners, and overall condition."}
            </SheetDescription>
          </SheetHeader>

          <div className="py-6 flex flex-col gap-3.5 max-w-[340px] mx-auto text-left">
            {sheetType === "video" ? (
              <>
                {[
                  "Record a full 360° view of the product",
                  "Slowly rotate around the item or pan it",
                  "Highlight edges, serial numbers, and labels",
                  "Ensure adequate lighting with no flare",
                ].map((tip) => (
                  <div key={tip} className="flex items-start gap-2.5">
                    <div className="w-4.5 h-4.5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5 text-primary">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    </div>
                    <span className="text-[11px] font-semibold text-foreground/80 leading-normal">{tip}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-border/20 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    <AlertCircle className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>Requirements</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground pl-5">• Maximum recording length: 60 seconds</span>
                  <span className="text-[10px] text-muted-foreground pl-5">• Recommended duration: 5-10 seconds</span>
                </div>
              </>
            ) : sheetType === "cert" ? (
              <>
                {[
                  "Place the certificate flat on a clean surface",
                  "Ensure all text and grading numbers are legible",
                  "Avoid glare — use soft, indirect lighting",
                  "Capture the full certificate within the frame",
                ].map((tip) => (
                  <div key={tip} className="flex items-start gap-2.5">
                    <div className="w-4.5 h-4.5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5 text-primary">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    </div>
                    <span className="text-[11px] font-semibold text-foreground/80 leading-normal">{tip}</span>
                  </div>
                ))}
              </>
            ) : (
              <>
                {[
                  "Use bright, natural lighting if possible",
                  "Avoid shadows casting on the product",
                  "Place on a clean, neutral, solid background",
                  "Keep details sharp and in focus (no blur)",
                ].map((tip) => (
                  <div key={tip} className="flex items-start gap-2.5">
                    <div className="w-4.5 h-4.5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5 text-primary">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    </div>
                    <span className="text-[11px] font-semibold text-foreground/80 leading-normal">{tip}</span>
                  </div>
                ))}
              </>
            )}
          </div>

          <div className="flex gap-3 max-w-[340px] mx-auto pt-2 pb-6">
            {sheetType === "video" ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSheetOpen(false)}
                  className="flex-1 border-border/80 rounded-xl h-11 text-xs font-bold active:scale-[0.98] transition-all uppercase tracking-wider"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleContinueToCamera}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/95 shadow-md rounded-xl h-11 text-xs font-bold active:scale-[0.98] transition-all uppercase tracking-wider"
                >
                  Start Recording
                </Button>
              </>
            ) : (
              <Button
                type="button"
                onClick={handleContinueToCamera}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/95 shadow-md rounded-xl h-11 text-xs font-bold active:scale-[0.98] transition-all uppercase tracking-wider"
              >
                Continue to Camera
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Secure Camera Modal Overlay */}
      {cameraOpen && cameraType && (() => {
        const mappedType: "main" | "front" | "back" | "side" | "detail" | "video" =
          cameraType === "video"
            ? "video"
            : cameraType === "main"
            ? "main"
            : cameraType === "back"
            ? "back"
            : cameraType === "detail" || cameraType === "cert"
            ? "detail"
            : "side";

        return (
          <CameraCapture
            isOpen={cameraOpen}
            onClose={() => {
              setCameraOpen(false);
              setCameraType(null);
            }}
            type={mappedType}
            title={
              cameraType === "video"
                ? "Video Scan"
                : cameraType === "main"
                ? "Main Photo"
                : cameraType === "cert"
                ? "Certificate Photo"
                : PHOTO_SLOTS.find((s) => s.id === cameraType)?.label || "Product Photo"
            }
            onCapture={(dataUrl) => {
              if (cameraType === "main") {
                onCaptureMainPhoto(dataUrl);
              } else if (cameraType === "cert") {
                onCaptureCertPhoto(dataUrl);
              } else if (cameraType && cameraType !== "video") {
                onCaptureProductPhotoSlot(cameraType, dataUrl);
              }
              setCameraOpen(false);
              setCameraType(null);
            }}
            onCaptureVideo={(blob) => {
              if (cameraType === "video") {
                onCaptureVideo(blob);
              }
              setCameraOpen(false);
              setCameraType(null);
            }}
          />
        );
      })()}
    </div>
  );
};
