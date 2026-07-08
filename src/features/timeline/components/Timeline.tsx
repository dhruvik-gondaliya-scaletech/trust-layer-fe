"use client";

import { TimelineProps } from "@/types/timeline.types";
import { useTimelineMedia } from "../../../hooks/useTimelineMedia";
import { useTrustTier } from "../../../hooks/useTrustTier";
import { DealStatusCard } from "./DealStatusCard";
import { EscrowTimelineSteps } from "./EscrowTimelineSteps";
import { MediaCarousel } from "./MediaCarousel";
import { PricingSummaryCard } from "./PricingSummaryCard";
import { TimelineHeader } from "./TimelineHeader";
import { TransactionMetadataCard } from "./TransactionMetadataCard";
import { TrustScoreCard } from "./TrustScoreCard";

export default function Timeline({
  deal,
  currentStatus,
  isSeller,
  isBuyer,
  onBack,
  onFundEscrow,
  onShip,
  onConfirmDelivery,
  onFileDispute,
  onReviewSeller,
}: TimelineProps) {
  const { carouselItems, certPhoto, videoMedia } = useTimelineMedia(deal.media);
  const tier = useTrustTier(deal.trustScore);

  const itemPrice = Number(deal.price);
  const platformFee = Number(deal.platformFeeAmount);
  const buyerPays = Number(deal.buyerPaysAmount);
  const sellerReceivesAmount = Number(deal.sellerReceivesAmount);

  return (
    <div className="w-full min-h-dvh bg-background text-left relative select-none flex flex-col">
      <TimelineHeader onBack={onBack} />

      <main className="flex-1 overflow-y-auto pb-10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* ─── LEFT COLUMN: Media, Trust & Metadata (5 cols on desktop) ─── */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <MediaCarousel
                carouselItems={carouselItems}
                certPhoto={certPhoto}
                videoMedia={videoMedia}
                isGraded={deal.isGraded}
                serialNumber={deal.serialNumber}
                trustScore={deal.trustScore}
              />

              <TrustScoreCard seller={deal.seller} trustScore={deal.trustScore} tier={tier} />

              <TransactionMetadataCard
                handlingTime={deal.handlingTime}
                isInsured={deal.isInsured}
                carrier={deal.carrier}
                shippingType={deal.shippingType}
              />
            </div>

            {/* ─── RIGHT COLUMN: Details & Milestones (7 cols on desktop) ─── */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <DealStatusCard
                dealNumber={deal.dealNumber}
                currentStatus={currentStatus}
                title={deal.title}
                itemPrice={itemPrice}
              />

              <EscrowTimelineSteps
                currentStatus={currentStatus}
                carrier={deal.carrier}
                shippingType={deal.shippingType}
                buyerPays={buyerPays}
                sellerReceivesAmount={sellerReceivesAmount}
                reviewRating={deal.reviewRating}
                reviewComment={deal.reviewComment}
                trackingNumber={deal.trackingNumber}
                isSeller={isSeller}
                isBuyer={isBuyer}
                onFundEscrow={onFundEscrow}
                onShip={onShip}
                onConfirmDelivery={onConfirmDelivery}
                onFileDispute={onFileDispute}
                onReviewSeller={onReviewSeller}
              />

              <PricingSummaryCard itemPrice={itemPrice} platformFee={platformFee} buyerPays={buyerPays} />
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
