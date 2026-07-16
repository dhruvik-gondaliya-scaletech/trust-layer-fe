"use client";

import { useState } from "react";
import { useTrustScoreAnimation } from "../../../hooks/useTrustScoreAnimation";
import { useFeeSummary } from "../../../hooks/useFeeSummary";
import { useVerificationChecklist } from "../../../hooks/useVerificationChecklist";
import { useDeclineFlow } from "../../../hooks/useDeclineFlow";
import { useDealMedia } from "../../../hooks/useDealMedia";
import { TopBar } from "./TopBar";
import { MediaGallery } from "./MediaGallery";
import { ProductDetailsCard } from "./ProductDetailsCard";
import { TrustScoreCard } from "@/features/create-deal/components/TrustScoreCard";
import { SellerProfileSection } from "./SellerProfileSection";
import { FeeSummaryCard } from "./FeeSummaryCard";
import { BottomCta } from "./BottomCta";
import { DeclineModal } from "./DeclineModal";
import { FeedbackSuccessModal } from "./FeedbackSuccessModal";
import { BuyerViewProps } from "@/types/buyer-view.types";

export default function BuyerView({
  deal,
  isLoggedIn,
  onFundEscrow,
  onDeclineDeal,
  onLogin,
}: BuyerViewProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const { photos, videos, activeMedia } = useDealMedia(deal.media);
  const { displayScore, isScoreLoaded, showBurst } = useTrustScoreAnimation(deal.trustScore);
  const { buyerFeeShare, totalDue } = useFeeSummary({
    price: deal.price,
    feePayer: deal.feePayer,
    shippingCost: deal.shippingCost,
    platformFeeAmount: deal.platformFeeAmount,
    buyerPaysAmount: deal.buyerPaysAmount,
  });
  const { verificationSteps, confidenceTitle, confidenceMessage } = useVerificationChecklist(deal, photos, videos);
  const decline = useDeclineFlow(onDeclineDeal);

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] pb-[220px] font-sans items-center">
      <TopBar />

      <div className="w-full max-w-2xl px-4 py-6 flex flex-col gap-5">
        <MediaGallery
          activeMedia={activeMedia}
          activeImageIndex={activeImageIndex}
          setActiveImageIndex={setActiveImageIndex}
          photosCount={photos.length}
          videosCount={videos.length}
          displayScore={displayScore}
          isScoreLoaded={isScoreLoaded}
          showBurst={showBurst}
        />

        <ProductDetailsCard deal={deal} />

        <TrustScoreCard
          score={displayScore}
          breakdown={{
            hasItemDetails: true,
            hasMainPhoto: deal.media?.some((m) => m.type === "main_photo") ?? false,
            additionalPhotosCount: deal.media?.filter((m) => m.type === "additional_photo").length ?? 0,
            hasVideo: deal.media?.some((m) => m.type === "video") ?? false,
            hasCertPhoto: deal.media?.some((m) => m.type === "serial_cert") ?? false,
            isGraded: deal.isGraded,
          }}
          variant="review"
        />

        <SellerProfileSection seller={deal.seller} trustScore={deal.trustScore} />

        <FeeSummaryCard
          feePayer={deal.feePayer}
          price={deal.price}
          shippingCost={deal.shippingCost}
          buyerFeeShare={buyerFeeShare}
          totalDue={totalDue}
        />
      </div>

      <BottomCta
        isLoggedIn={isLoggedIn}
        totalDue={totalDue}
        onFundEscrow={onFundEscrow}
        onDeclineClick={() => decline.setShowDeclineModal(true)}
        onLogin={onLogin}
      />

      <DeclineModal
        open={decline.showDeclineModal}
        declineReason={decline.declineReason}
        setDeclineReason={decline.setDeclineReason}
        declineMessage={decline.declineMessage}
        setDeclineMessage={decline.setDeclineMessage}
        isSubmittingDecline={decline.isSubmittingDecline}
        onSubmit={decline.handleDeclineSubmit}
        onClose={() => decline.setShowDeclineModal(false)}
      />

      <FeedbackSuccessModal
        open={decline.showFeedbackSuccess}
        onReturnToDashboard={() => {
          decline.setShowFeedbackSuccess(false);
          window.location.href = "/dashboard";
        }}
      />
    </div>
  );
}
