"use client";

import React, { useState } from "react";
import { ArrowLeft, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { FRONTEND_ROUTES } from "@/lib/contants";
import { StepIndicator } from "../components/StepIndicator";
import { Step1ItemDetails, Step1FormData } from "../components/Step1ItemDetails";
import { Step2ProofVerification } from "../components/Step2ProofVerification";
import { Step5ReviewPublish } from "../components/Step5ReviewPublish";
import { motion, AnimatePresence } from "framer-motion";

export const CreateDealContainer: React.FC = () => {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);

  // Form states
  const [formData, setFormData] = useState<Step1FormData>({
    title: "",
    price: 0,
    category: "Trading Cards",
    condition: "Mint",
    orderType: "Online Transaction",
    isGraded: false,
    gradedSerial: "",
    description: "",
  });

  const [mainPhoto, setMainPhoto] = useState<string | null>(null);
  const [productPhotos, setProductPhotos] = useState<{
    back: string | null;
    leftSide: string | null;
    rightSide: string | null;
    detail: string | null;
  }>({
    back: null,
    leftSide: null,
    rightSide: null,
    detail: null,
  });

  const [verificationVideo, setVerificationVideo] = useState<Blob | null>(null);

  // Dynamic Trust Score Calculation
  // Step 1 Completed = 25
  // Main Photo = +20 (45)
  // Product Photos = +25 (70)
  // Video Verification = +30 (100)
  let trustScore = 0;
  if (step > 1 || formData.title) {
    trustScore += 25;
  }
  if (mainPhoto) {
    trustScore += 20;
  }
  const extraPhotosCount = Object.values(productPhotos).filter(Boolean).length;
  if (extraPhotosCount > 0) {
    // Add fractional score based on number of extra photos (up to 25)
    trustScore += Math.round((extraPhotosCount / 4) * 25);
  }
  if (verificationVideo) {
    trustScore += 30;
  }



  const handleStep1Submit = (data: Step1FormData) => {
    setFormData(data);
    setStep(2);
  };

  const handleCaptureMainPhoto = (dataUrl: string) => {
    setMainPhoto(dataUrl);
  };

  const handleCaptureProductPhotosSlot = (
    slot: "back" | "leftSide" | "rightSide" | "detail",
    dataUrl: string
  ) => {
    setProductPhotos((prev) => ({ ...prev, [slot]: dataUrl }));
  };

  const handleCaptureVideo = (videoBlob: Blob) => {
    setVerificationVideo(videoBlob);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    } else {
      router.push(FRONTEND_ROUTES.DASHBOARD);
    }
  };

  return (
    <div className="w-full max-w-[440px] flex flex-col min-h-[92vh] max-h-[95vh] relative overflow-hidden select-none">
      {/* Scrollable Container (changed to overflow-hidden for sticky step layouts) */}
      <div className="flex-1 flex flex-col overflow-hidden px-6 pt-6 relative">

        {/* Header Navigation */}
        <div className="flex items-center justify-between w-full mb-6 shrink-0">
          <button
            onClick={handleBack}
            className="w-10 h-10 rounded-full border border-border/60 flex items-center justify-center hover:bg-muted/10 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>

          <div className="flex items-center gap-1.5 font-extrabold text-foreground text-sm select-none">
            <Shield className="w-5 h-5 text-primary fill-primary/10" />
            <span>Create Deal</span>
          </div>

          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Step Indicator Section */}
        <div className="mb-6 shrink-0">
          <StepIndicator currentStep={step} totalSteps={3} />
        </div>

        {/* Render Steps with slide animation */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              {step === 1 && (
                <Step1ItemDetails
                  initialData={formData}
                  onContinue={handleStep1Submit}
                />
              )}
              {step === 2 && (
                <Step2ProofVerification
                  mainPhoto={mainPhoto}
                  productPhotos={productPhotos}
                  verificationVideo={verificationVideo}
                  onCaptureMainPhoto={handleCaptureMainPhoto}
                  onCaptureProductPhotoSlot={handleCaptureProductPhotosSlot}
                  onCaptureVideo={handleCaptureVideo}
                  onContinue={() => setStep(3)}
                  onBack={handleBack}
                />
              )}
              {step === 3 && (
                <Step5ReviewPublish
                  formData={formData}
                  mainPhoto={mainPhoto}
                  productPhotos={productPhotos}
                  verificationVideo={verificationVideo}
                  trustScore={trustScore}
                  onBack={handleBack}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* Styled bottom security banner overlays the scroll container */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-background via-background/95 to-transparent border-t border-border/10 flex items-center justify-center z-10 pointer-events-none">
        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
          Secured by TrustLayer Escrow
        </span>
      </div>
    </div>
  );
};
