"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useConfetti } from "@/providers/confetti-provider";
import { FRONTEND_ROUTES } from "@/lib/contants";
import { StepIndicator } from "../components/StepIndicator";
import { Step1ItemDetails, Step1FormData } from "../components/Step1ItemDetails";
import { Step2ProofVerification } from "../components/Step2ProofVerification";
import { Step3Shipping, Step3ShippingData } from "../components/Step3Shipping";
import { Step4Fees, Step4FeesData } from "../components/Step4Fees";
import { Step5ReviewPublish } from "../components/Step5ReviewPublish";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
  const [certPhoto, setCertPhoto] = useState<string | null>(null);

  const [shippingData, setShippingData] = useState<Step3ShippingData>({
    handlingTime: "Ship within 1–2 business days",
    carrier: "USPS",
    shippingType: "Standard",
    isInsured: false,
  });

  const [feesData, setFeesData] = useState<Step4FeesData>({
    feeStructure: "Buyer Pays",
  });

  // Step 5 specific states lifted
  const [buyerEmail, setBuyerEmail] = useState("");
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [dealId, setDealId] = useState("");

  // Dynamic Trust Score Calculation
  const hasItemDetails = step > 1 || !!formData.title;
  const extraPhotosCount = Object.values(productPhotos).filter(Boolean).length;

  let trustScore = 20; // Verified Seller Profile — always +20
  if (hasItemDetails) trustScore += 20;
  if (mainPhoto) trustScore += 15;
  if (extraPhotosCount > 0) trustScore += Math.round((extraPhotosCount / 4) * 15);
  // When graded: video worth 20 pts + cert photo worth 10 pts (same total max)
  if (verificationVideo) trustScore += formData.isGraded ? 20 : 30;
  if (certPhoto && formData.isGraded) trustScore += 10;

  const nextStepName = !mainPhoto
    ? "Take Main Photo"
    : extraPhotosCount < 4
    ? "Add Additional Photos"
    : !verificationVideo
    ? "Record Product Video"
    : formData.isGraded && !certPhoto
    ? "Upload Certificate"
    : "Review & Publish";

  const breakdown = {
    hasItemDetails,
    hasMainPhoto: !!mainPhoto,
    additionalPhotosCount: extraPhotosCount,
    hasVideo: !!verificationVideo,
    hasCertPhoto: !!certPhoto,
    isGraded: formData.isGraded,
  };

  // Confetti when trust score first hits 100
  const { fire: fireConfetti } = useConfetti();
  const confettiFiredRef = useRef(false);

  useEffect(() => {
    if (trustScore === 100 && !confettiFiredRef.current) {
      confettiFiredRef.current = true;
      fireConfetti();
    }
    if (trustScore < 100) {
      confettiFiredRef.current = false;
    }
  }, [trustScore, fireConfetti]);

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

  const handleCaptureCertPhoto = (dataUrl: string) => {
    setCertPhoto(dataUrl);
  };

  const handleStep3Submit = (data: Step3ShippingData) => {
    setShippingData(data);
    setStep(4);
  };

  const handleStep4Submit = (data: Step4FeesData) => {
    setFeesData(data);
    setStep(5);
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedTerms) {
      toast.error("Please agree to the escrow terms of service");
      return;
    }

    setIsSubmitting(true);
    // Simulate API Deal creation
    setTimeout(() => {
      setIsSubmitting(false);
      const generatedId = Math.random().toString(36).substring(2, 10).toUpperCase();
      setDealId(generatedId);
      setIsSuccess(true);
      toast.success("Escrow deal successfully created!");
    }, 1500);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    } else {
      router.push(FRONTEND_ROUTES.DASHBOARD);
    }
  };

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden select-none flex-1">
      {/* Scrollable Container */}
      <div className="flex-1 flex flex-col overflow-hidden px-6 pt-6 relative">

        {/* Header Navigation */}
        <div className="flex items-center justify-between w-full mb-5 shrink-0">
          {!isSuccess && (
            <button
              onClick={handleBack}
              className="w-10 h-10 rounded-full border border-border/60 flex items-center justify-center hover:bg-muted/10 active:scale-95 transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </button>
          )}

          <div className="font-extrabold text-foreground text-base select-none mx-auto">
            New deal
          </div>

          {!isSuccess && <div className="w-10" />} {/* Spacer */}
        </div>

        {/* Step Indicator Section */}
        {!isSuccess && (
          <div className="mb-5 shrink-0">
            <StepIndicator currentStep={step} totalSteps={5} />
          </div>
        )}

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
                  trustScore={trustScore}
                  nextStepName={nextStepName}
                  breakdown={breakdown}
                />
              )}
              {step === 2 && (
                <Step2ProofVerification
                  mainPhoto={mainPhoto}
                  productPhotos={productPhotos}
                  verificationVideo={verificationVideo}
                  certPhoto={certPhoto}
                  isGraded={formData.isGraded}
                  onCaptureMainPhoto={handleCaptureMainPhoto}
                  onCaptureProductPhotoSlot={handleCaptureProductPhotosSlot}
                  onCaptureVideo={handleCaptureVideo}
                  onCaptureCertPhoto={handleCaptureCertPhoto}
                  onContinue={() => setStep(3)}
                  onBack={handleBack}
                  trustScore={trustScore}
                  nextStepName={nextStepName}
                  breakdown={breakdown}
                />
              )}
              {step === 3 && (
                <Step3Shipping
                  initialData={shippingData}
                  onContinue={handleStep3Submit}
                />
              )}
              {step === 4 && (
                <Step4Fees
                  price={formData.price}
                  initialData={feesData}
                  onContinue={handleStep4Submit}
                />
              )}
              {step === 5 && (
                <Step5ReviewPublish
                  formData={formData}
                  shippingData={shippingData}
                  feesData={feesData}
                  mainPhoto={mainPhoto}
                  productPhotos={productPhotos}
                  verificationVideo={verificationVideo}
                  trustScore={trustScore}
                  onBack={handleBack}
                  onEdit={() => setStep(1)}
                  buyerEmail={buyerEmail}
                  setBuyerEmail={setBuyerEmail}
                  agreedTerms={agreedTerms}
                  setAgreedTerms={setAgreedTerms}
                  isSubmitting={isSubmitting}
                  isSuccess={isSuccess}
                  dealId={dealId}
                  handlePublish={handlePublish}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Central Persistent Sticky Footer */}
      <div className="absolute bottom-0 left-0 right-0 py-4 px-6 bg-card border-t border-border/40 flex flex-col gap-3 z-30 shadow-lg">
        <div className="flex gap-3">
          {step > 1 && !isSuccess && (
            <Button
              type="button"
              onClick={handleBack}
              variant="outline"
              className="flex-1 border-border/80 rounded-2xl h-14 text-base font-bold active:scale-[0.98] transition-all"
            >
              Back
            </Button>
          )}
          <Button
            type={
              step === 1 ? "submit" :
                step === 3 ? "submit" :
                  step === 4 ? "submit" :
                    step === 5 && !isSuccess ? "submit" : "button"
            }
            form={
              step === 1 ? "step1-form" :
                step === 3 ? "step3-form" :
                  step === 4 ? "step4-form" :
                    step === 5 && !isSuccess ? "step5-form" : undefined
            }
            onClick={
              step === 2 ? () => setStep(3) :
                isSuccess ? () => router.push(FRONTEND_ROUTES.DASHBOARD) : undefined
            }
            disabled={step === 5 && isSubmitting}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/95 shadow-md shadow-primary/10 rounded-2xl h-14 text-base font-bold active:scale-[0.98] transition-all"
          >
            {step === 5 && !isSuccess
              ? (isSubmitting ? "Publishing..." : "Publish Deal")
              : isSuccess
                ? "Go to Dashboard"
                : step === 2 && !mainPhoto
                  ? "Skip Verification"
                  : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
};
