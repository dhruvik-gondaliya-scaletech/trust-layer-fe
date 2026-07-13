"use client";

import { Spinner } from "@/components/ui/spinner";
import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { cn } from "@/lib/utils";
import dealsService from "@/services/deals.service";
import s3Service from "@/services/s3.service";
import { useUploadDealMedia, useDeleteDealMedia } from "@/hooks/queries/useDeals";
import type { Deal, HandlingTime, FeePayer } from "@/types/api.types";
import { ProofType, UploadPurpose, OrderType } from "@/types/enums";
import { MediaSlot, MediaSlotIds } from "@/types/deal.types";
import { dataURLtoBlob, mapProductTypeToCategory, mapStep1ToDto, SLOT_FILE_NAMES, SLOT_SORT_ORDER } from "@/utils/deal";
import { BackButton } from "@/components/shared/BackButton";

export const CreateDealContainer: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlDealId = searchParams.get("dealId");
  const urlDealNumber = searchParams.get("dealNumber");
  const isUpdateMode = searchParams.get("update") === "true";

  const [step, setStep] = useState<number>(1);
  const [dealStatus, setDealStatus] = useState<string | null>(null);
  const [formData, setFormData] = useState<Step1FormData>({
    title: "",
    price: 0,
    category: "",
    condition: "",
    orderType: "",
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

  const [verificationVideo, setVerificationVideo] = useState<Blob | string | null>(null);
  const [certPhoto, setCertPhoto] = useState<string | null>(null);

  const [shippingData, setShippingData] = useState<Step3ShippingData>({
    handlingTime: "",
    shippingCost: null,
  });

  const [feesData, setFeesData] = useState<Step4FeesData>({
    feeStructure: "Buyer Pays",
  });

  const [dealId, setDealId] = useState<string | null>(urlDealId);
  const [mediaIds, setMediaIds] = useState<MediaSlotIds>({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Load deal draft on mount/URL param changes
  useEffect(() => {
    async function init() {
      if (!urlDealNumber && !urlDealId) {
        setIsInitialized(true);
        return;
      }

      setIsInitialized(false);
      try {
        let deal: Deal | undefined;

        if (urlDealId) {
          try {
            deal = await dealsService.getDealById(urlDealId);
          } catch (e) {
            const sellerDeals = await dealsService.getMyDeals("seller");
            deal = sellerDeals.find((d) => d.id === urlDealId);
          }
        }

        if (deal) {
          if (deal.status !== "draft" && !isUpdateMode) {
            router.replace(FRONTEND_ROUTES.DEAL_DETAILS(deal.id));
            return;
          }

          setDealId(deal.id);
          setDealStatus(deal.status);

          setFormData({
            title: deal.title || "",
            price: Number(deal.price) || 0,
            category: mapProductTypeToCategory(deal.productType),
            condition: deal.condition || "",
            orderType: deal.orderType === OrderType.IN_PERSON ? "In-Person Transaction" : (deal.orderType === OrderType.ONLINE ? "Online Transaction" : ""),
            isGraded: deal.isGraded || false,
            gradedSerial: deal.serialNumber || "",
            description: deal.description || "",
          });

          setShippingData({
            handlingTime: deal.handlingTime === "1-2"
              ? "Ship within 1–2 business days"
              : deal.handlingTime === "3-5"
                ? "Ship within 3–5 business days"
                : "",
            shippingCost: deal.handlingTime ? (deal.shippingCost !== null ? Number(deal.shippingCost) : null) : null,
          });

          setFeesData({
            feeStructure: deal.feePayer === "split"
              ? "Split 50/50"
              : deal.feePayer === "buyer"
                ? "Buyer Pays"
                : deal.feePayer === "seller"
                  ? "Seller Pays"
                  : "Buyer Pays",
          });

          const nextProductPhotos = {
            back: null as string | null,
            leftSide: null as string | null,
            rightSide: null as string | null,
            detail: null as string | null,
          };
          let nextMainPhoto: string | null = null;
          let nextCertPhoto: string | null = null;
          let nextVerificationVideo: string | null = null;
          const nextMediaIds: MediaSlotIds = {};

          deal.media?.forEach((m) => {
            const slot = Object.keys(SLOT_SORT_ORDER).find(
              (key) => SLOT_SORT_ORDER[key as MediaSlot] === m.sortOrder
            ) as MediaSlot | undefined;

            if (slot) {
              nextMediaIds[slot] = m.id;
              if (slot === "main") {
                nextMainPhoto = m.url;
              } else if (slot === "cert") {
                nextCertPhoto = m.url;
              } else if (slot === "video") {
                nextVerificationVideo = m.url;
              } else {
                nextProductPhotos[slot] = m.url;
              }
            }
          });

          setMainPhoto(nextMainPhoto);
          setProductPhotos(nextProductPhotos);
          setCertPhoto(nextCertPhoto);
          setVerificationVideo(nextVerificationVideo);
          setMediaIds(nextMediaIds);

          if (deal.title && !isUpdateMode) {
            setStep(2);
          }
        }
      } catch (err) {
        console.error("Failed to load deal draft:", err);
        toast.error("Failed to load deal details.");
      } finally {
        setIsInitialized(true);
      }
    }
    init();
  }, [urlDealId, urlDealNumber, isUpdateMode]);

  // Step 5 specific states lifted
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [publishedDealId, setPublishedDealId] = useState("");
  const [publishedDealNumber, setPublishedDealNumber] = useState("");

  const isInPerson = formData.orderType === "In-Person Transaction";
  const stepsList = isInPerson
    ? ["Item Details", "Proof Verification", "Fees Setup", "Review & Publish"]
    : ["Item Details", "Proof Verification", "Shipping Terms", "Fees Setup", "Review & Publish"];

  const getVisualStep = (s: number) => {
    if (isInPerson && s >= 4) {
      return s - 1;
    }
    return s;
  };

  // Step 2 live uploads — which slots currently have an upload in flight
  const [uploadingSlots, setUploadingSlots] = useState<Partial<Record<MediaSlot, boolean>>>({});
  const isUploadingMedia = Object.values(uploadingSlots).some(Boolean);

  const uploadMediaMutation = useUploadDealMedia();
  const deleteMediaMutation = useDeleteDealMedia();

  /**
   * Uploads one captured slot to the backend deal as soon as it's taken:
   * presign (into the deal's own folder) → S3 POST → attach via /deals/:id/media.
   * On a retake the previously attached media is deleted first, so the deal
   * never holds two files for the same slot.
   */
  const uploadSlotMedia = async (slot: MediaSlot, fileBlob: Blob) => {
    // No backend draft yet (older local draft) — media falls back to
    // uploading in bulk at publish time.
    if (!dealId) return;

    setUploadingSlots((prev) => ({ ...prev, [slot]: true }));
    try {
      const previousMediaId = mediaIds[slot];
      if (previousMediaId) {
        // Retake — remove the old file (also deletes it from S3)
        await deleteMediaMutation.mutateAsync({ dealId, mediaId: previousMediaId });
        setMediaIds((prev) => ({ ...prev, [slot]: null }));
      }

      const media = await uploadMediaMutation.mutateAsync({
        dealId,
        file: fileBlob,
        fileName: SLOT_FILE_NAMES[slot],
        sortOrder: SLOT_SORT_ORDER[slot],
      });
      setMediaIds((prev) => ({ ...prev, [slot]: media.id }));
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error(
        err.response?.data?.message ||
        "Failed to upload media. We'll retry it when you publish."
      );
    } finally {
      setUploadingSlots((prev) => ({ ...prev, [slot]: false }));
    }
  };

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

  const handleStep1Submit = async (data: Step1FormData) => {
    setFormData(data);
    try {
      if (dealId) {
        // Deal already exists — user came back and edited Step 1
        await dealsService.updateDeal(dealId, mapStep1ToDto(data));
      } else {
        // First time through — create the backend draft
        const deal = await dealsService.createDeal({
          ...mapStep1ToDto(data),
          publish: false,
        });
        setDealId(deal.id);

        // Update URL to include both dealId and dealNumber
        const newUrl = `${window.location.pathname}?dealId=${deal.id}&dealNumber=${deal.dealNumber}`;
        window.history.replaceState(null, "", newUrl);
      }
      setStep(2);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error(err.response?.data?.message || "Failed to save item details. Please try again.");
    }
  };

  const handleCaptureMainPhoto = (dataUrl: string) => {
    setMainPhoto(dataUrl);
    void uploadSlotMedia("main", dataURLtoBlob(dataUrl));
  };

  const handleCaptureProductPhotosSlot = (
    slot: "back" | "leftSide" | "rightSide" | "detail",
    dataUrl: string
  ) => {
    setProductPhotos((prev) => ({ ...prev, [slot]: dataUrl }));
    void uploadSlotMedia(slot, dataURLtoBlob(dataUrl));
  };

  const handleCaptureVideo = (videoBlob: Blob) => {
    setVerificationVideo(videoBlob);
    // Coerce video/webm to video/mp4 to comply with backend constraints
    const videoType = videoBlob.type.includes("video/") ? "video/mp4" : videoBlob.type;
    void uploadSlotMedia("video", new Blob([videoBlob], { type: videoType }));
  };

  const handleCaptureCertPhoto = (dataUrl: string) => {
    setCertPhoto(dataUrl);
    void uploadSlotMedia("cert", dataURLtoBlob(dataUrl));
  };

  const handleStep3Submit = (data: Step3ShippingData) => {
    setShippingData(data);
    setStep(4);
  };

  const handleStep4Submit = (data: Step4FeesData) => {
    setFeesData(data);
    setStep(5);
  };

  /**
   * Persists the wizard to the backend — shared by "Publish Deal" and
   * "Save Draft" on Step 5. Uploads any media not already uploaded live in
   * Step 2, then PATCHes (or creates) the deal. With publish=true the deal
   * goes draft → open; with publish=false it stays a draft.
   */
  const saveDeal = async (publish: boolean) => {
    const setBusy = publish ? setIsSubmitting : setIsSavingDraft;
    setBusy(true);

    try {
      // 1. Prepare upload queue
      const uploadTasks: { slot: MediaSlot; fileBlob: Blob; sortOrder: number }[] = [];

      // Main photo
      if (mainPhoto && mainPhoto.startsWith("data:")) {
        uploadTasks.push({
          slot: "main",
          fileBlob: dataURLtoBlob(mainPhoto),
          sortOrder: SLOT_SORT_ORDER.main,
        });
      }

      // Additional product photos
      const slots: ("back" | "leftSide" | "rightSide" | "detail")[] = [
        "back",
        "leftSide",
        "rightSide",
        "detail",
      ];
      for (const slot of slots) {
        const photo = productPhotos[slot];
        if (photo && photo.startsWith("data:")) {
          uploadTasks.push({
            slot,
            fileBlob: dataURLtoBlob(photo),
            sortOrder: SLOT_SORT_ORDER[slot],
          });
        }
      }

      // Video
      if (verificationVideo && typeof verificationVideo !== "string") {
        // Coerce video/webm to video/mp4 to comply with backend constraints
        const videoType = verificationVideo.type.includes("video/") ? "video/mp4" : verificationVideo.type;
        const coercedVideoBlob = new Blob([verificationVideo], { type: videoType });
        uploadTasks.push({
          slot: "video",
          fileBlob: coercedVideoBlob,
          sortOrder: SLOT_SORT_ORDER.video,
        });
      }

      // Certificate Photo
      if (certPhoto && certPhoto.startsWith("data:")) {
        uploadTasks.push({
          slot: "cert",
          fileBlob: dataURLtoBlob(certPhoto),
          sortOrder: SLOT_SORT_ORDER.cert,
        });
      }

      // 2. Map wizard state to deal fields
      const ht = isInPerson ? undefined : (shippingData.handlingTime === "Ship within 1–2 business days" ? "1-2" : "3-5");
      const shippingCost = isInPerson ? 0 : shippingData.shippingCost;
      const feePayerMapped = feesData.feeStructure === "Split 50/50" ? "split" : (feesData.feeStructure === "Buyer Pays" ? "buyer" : "seller");

      const dealFields = {
        ...mapStep1ToDto(formData),
        handlingTime: ht as HandlingTime,
        shippingCost: shippingCost,
        feePayer: feePayerMapped as FeePayer,
        trustScore, // Send the calculated trustScore to backend
      };

      let deal: Deal;

      if (dealId) {
        // 3a. Draft deal already exists (created on Step 1 submit) — Step 2
        // already uploaded each capture live, so only slots without a backend
        // media id (e.g. a live upload that failed) still need uploading.
        // Presign those straight into the deal's own S3 folder, attach each
        // item, then publish the draft via PATCH.
        const pendingTasks = uploadTasks.filter((t) => !mediaIds[t.slot]);
        if (pendingTasks.length > 0) {
          const presignedData = await s3Service.getPreSignedUrls({
            files: pendingTasks.map((t) => ({
              purpose: UploadPurpose.DEAL_MEDIA,
              fileName: SLOT_FILE_NAMES[t.slot],
              contentType: t.fileBlob.type || "image/jpeg",
              dealId,
            })),
          });

          const uploaded = await Promise.all(
            pendingTasks.map(async (task, idx) => {
              const presignResponse = presignedData[idx];
              await s3Service.uploadToS3(presignResponse, task.fileBlob);
              const media = await dealsService.addMedia(dealId, {
                key: presignResponse.key,
                mimeType: task.fileBlob.type || "image/jpeg",
                sizeBytes: task.fileBlob.size,
                sortOrder: task.sortOrder,
                proofType: ProofType.ITEM_MEDIA,
              });
              return { slot: task.slot, id: media.id };
            })
          );
          // Record ids so a later save/publish doesn't re-upload these slots
          setMediaIds((prev) => {
            const next = { ...prev };
            uploaded.forEach((u) => {
              next[u.slot] = u.id;
            });
            return next;
          });
        }

        deal = await dealsService.updateDeal(dealId, {
          ...dealFields,
          ...(publish ? { publish: true } : {}),
        });
      } else {
        // 3b. No backend draft (draft saved before Step 1 created deals) —
        // upload to temp/ and create + publish in one shot.
        let mediaList: { key: string; mimeType: string; sizeBytes?: number; sortOrder?: number; proofType: ProofType }[] = [];

        if (uploadTasks.length > 0) {
          const presignedData = await s3Service.getPreSignedUrls({
            files: uploadTasks.map((t) => ({
              purpose: UploadPurpose.DEAL_MEDIA,
              fileName: SLOT_FILE_NAMES[t.slot],
              contentType: t.fileBlob.type || "image/jpeg",
            })),
          });

          mediaList = await Promise.all(
            uploadTasks.map(async (task, idx) => {
              const presignResponse = presignedData[idx];
              await s3Service.uploadToS3(presignResponse, task.fileBlob);
              return {
                key: presignResponse.key,
                mimeType: task.fileBlob.type || "image/jpeg",
                sizeBytes: task.fileBlob.size,
                sortOrder: task.sortOrder,
                proofType: ProofType.ITEM_MEDIA,
              };
            })
          );
        }

        deal = await dealsService.createDeal({
          ...dealFields,
          media: mediaList, // Send S3 keys directly
          publish,
        });
        setDealId(deal.id);
        // Map the created media back to slots by sortOrder so a later
        // save/publish of this draft doesn't re-upload them.
        const slotBySortOrder = new Map(uploadTasks.map((t) => [t.sortOrder, t.slot]));
        setMediaIds((prev) => {
          const next: MediaSlotIds = { ...prev };
          deal.media?.forEach((m) => {
            const slot = slotBySortOrder.get(m.sortOrder);
            if (slot) next[slot] = m.id;
          });
          return next;
        });
      }

      if (publish) {
        setIsSubmitting(false);
        if (isUpdateMode && dealStatus !== "draft") {
          toast.success("Deal updated successfully!");
          router.push(FRONTEND_ROUTES.DEAL_DETAILS(deal.id));
        } else {
          setPublishedDealId(deal.id); // Store the deal ID so we link to it
          setPublishedDealNumber(deal.dealNumber); // Store the deal number
          setIsSuccess(true);
          toast.success(isUpdateMode ? "Deal updated and published!" : "Deal successfully created!");
          window.history.replaceState(null, "", FRONTEND_ROUTES.DEAL_DETAILS(deal.id));
        }
      } else {
        // Keep the local draft (incl. dealId) so re-opening the wizard
        // resumes this same backend draft instead of creating a new deal.
        setIsSavingDraft(false);
        toast.success(isUpdateMode ? "Deal changes saved as draft" : "Deal saved as draft");
        router.push(FRONTEND_ROUTES.DASHBOARD);
      }
    } catch (error: unknown) {
      setBusy(false);
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error(
        err.response?.data?.message ||
        err.message ||
        (publish
          ? (isUpdateMode ? "Failed to update deal. Please try again." : "Failed to create deal. Please try again.")
          : "Failed to save draft. Please try again.")
      );
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveDeal(true);
  };

  const handleSaveDraft = () => saveDeal(false);

  const handleBack = () => {
    if (step > 1) {
      if (step === 4 && isInPerson) {
        setStep(2);
      } else {
        setStep((prev) => prev - 1);
      }
    } else {
      if (isUpdateMode && dealId) {
        router.push(FRONTEND_ROUTES.DEAL_DETAILS(dealId));
      } else {
        router.push(FRONTEND_ROUTES.DASHBOARD);
      }
    }
  };

  if (!isInitialized) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 min-h-[400px]">
        <Spinner className="w-8 h-8 text-primary mb-2" />
        <p className="text-sm text-muted-foreground font-semibold">Loading draft...</p>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto px-0 lg:px-4 py-0 lg:py-8 min-h-0 select-none">
      {/* ─── LEFT PANE - Stepper progress (Desktop only) ─────────────────── */}
      <div className="hidden lg:flex flex-col w-80 shrink-0 gap-6">
        {/* Title */}
        <div className="flex items-center gap-3">
          {!isSuccess && (
            <BackButton />
          )}
          <span className="font-extrabold text-xl text-foreground">{isUpdateMode ? "Update Deal" : "New Deal"}</span>
        </div>

        {/* Steps List */}
        {!isSuccess && (
          <div className="bg-card border border-border/40 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              {isUpdateMode ? "Deal Update Steps" : "Deal Creation Steps"}
            </span>
            <div className="flex flex-col gap-4">
              {stepsList.map((name, index) => {
                const currentStepIndex = index + 1;
                const visualStep = getVisualStep(step);
                const isPast = visualStep > currentStepIndex;
                const isCurrent = visualStep === currentStepIndex;
                return (
                  <div
                    key={name}
                    className={cn(
                      "flex items-center gap-3 text-sm font-bold transition-all",
                      isCurrent
                        ? "text-primary"
                        : isPast
                          ? "text-muted-foreground/60"
                          : "text-muted-foreground/45"
                    )}
                  >
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-xs border",
                        isCurrent
                          ? "bg-primary text-primary-foreground border-primary"
                          : isPast
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/25"
                            : "bg-muted text-muted-foreground/40 border-border/40"
                      )}
                    >
                      {isPast ? "✓" : currentStepIndex}
                    </div>
                    <span>{name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Trust Score Summary */}
        {!isSuccess && (
          <div className="bg-card border border-border/40 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Live Trust Score
              </span>
              <span className="text-base font-black text-primary">{trustScore}%</span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-muted h-3 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-500"
                style={{ width: `${trustScore}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              A high trust score shows buyers your deal is authentic and increases the likelihood of a fast transaction.
            </p>
          </div>
        )}
      </div>

      {/* ─── RIGHT PANE - Form card layout (Responsive wrapper) ──────────── */}
      <div className="flex-1 flex flex-col bg-card lg:border lg:border-border/40 lg:rounded-[2.5rem] lg:shadow-xl relative overflow-hidden min-h-[600px] lg:max-h-[820px] lg:h-[820px]">
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="lg:hidden flex items-center justify-between w-full p-6 pb-2 shrink-0 select-none">
          {!isSuccess && (
            <BackButton />
          )}

          <div className="font-extrabold text-foreground text-base select-none mx-auto">
            {isUpdateMode ? "Update deal" : "New deal"}
          </div>

          {!isSuccess && <div className="w-10" />}
        </div>

        {/* Mobile Step Indicator (Hidden on Desktop) */}
        {!isSuccess && (
          <div className="lg:hidden px-6 py-2 shrink-0">
            <StepIndicator currentStep={getVisualStep(step)} totalSteps={isInPerson ? 4 : 5} />
          </div>
        )}

        {/* Render Steps with scroll and slide animation */}
        <div className="flex-1 flex flex-col overflow-y-auto scrollbar-none px-6 pt-4 pb-36 lg:pb-28 min-h-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="flex-1 flex flex-col min-h-0"
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
                  uploadingSlots={uploadingSlots}
                  onContinue={() => setStep(isInPerson ? 4 : 3)}
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
                  shippingCost={shippingData.shippingCost ?? 0}
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
                  certPhoto={certPhoto}
                  trustScore={trustScore}
                  onBack={handleBack}
                  onEdit={() => setStep(1)}
                  isSubmitting={isSubmitting}
                  isSuccess={isSuccess}
                  dealId={publishedDealId}
                  dealNumber={publishedDealNumber}
                  handlePublish={handlePublish}
                  isUpdateMode={isUpdateMode}
                  dealStatus={dealStatus}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Central Persistent Sticky Footer inside Form Card */}
        {!isSuccess && (
          <div className="fixed bottom-0 left-0 right-0 lg:absolute lg:bottom-0 lg:left-0 lg:right-0 py-4 px-6 bg-card border-t border-border/40 flex flex-col gap-3 z-30 shadow-lg">
            <div className="flex gap-3">
              {step > 1 && !isSuccess && (
                <Button
                  type="button"
                  onClick={handleBack}
                  variant="outline"
                  disabled={step === 5 && (isSubmitting || isSavingDraft)}
                  className="flex-1 border-border/80 rounded-2xl h-14 text-base font-bold active:scale-[0.98] transition-all"
                >
                  Back
                </Button>
              )}
              {step === 5 && !isSuccess && (!isUpdateMode || dealStatus === "draft") && (
                <Button
                  type="button"
                  onClick={handleSaveDraft}
                  variant="outline"
                  disabled={isSubmitting || isSavingDraft}
                  className="flex-1 border-primary/40 text-primary hover:text-primary hover:bg-primary/5 rounded-2xl h-14 text-base font-bold active:scale-[0.98] transition-all"
                >
                  {isSavingDraft ? "Saving..." : (isUpdateMode ? "Save as Draft" : "Save Draft")}
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
                  step === 2
                    ? () => {
                      // Main photo is mandatory — it's also required by the
                      // backend to publish the deal.
                      if (!mainPhoto) {
                        toast.error("Please take the main photo to continue");
                        return;
                      }
                      setStep(isInPerson ? 4 : 3);
                    }
                    : isSuccess ? () => router.push(FRONTEND_ROUTES.DASHBOARD) : undefined
                }
                disabled={(step === 5 && (isSubmitting || isSavingDraft)) || (step === 2 && isUploadingMedia)}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/95 shadow-md shadow-primary/10 rounded-2xl h-14 text-base font-bold active:scale-[0.98] transition-all"
              >
                {step === 5 && !isSuccess
                  ? (isSubmitting
                    ? (isUpdateMode ? "Saving..." : "Publishing...")
                    : (isUpdateMode
                      ? (dealStatus === "draft" ? "Publish" : "Save Changes")
                      : "Publish"))
                  : isSuccess
                    ? "Go to Dashboard"
                    : step === 2 && isUploadingMedia
                      ? "Uploading..."
                      : "Continue"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
