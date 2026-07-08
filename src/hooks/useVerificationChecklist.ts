import type { Deal, MediaItem, VerificationStep } from "@/types/buyer-view.types";

export function useVerificationChecklist(
  deal: Pick<Deal, "serialNumber" | "trustScore">,
  photos: MediaItem[],
  videos: MediaItem[]
) {
  const verificationSteps: VerificationStep[] = [
    { id: 1, label: "Seller identity verified", isComplete: true },
    { id: 2, label: "Item details provided", isComplete: true },
    {
      id: 3,
      label: "High-resolution main photo uploaded",
      isComplete: photos.length > 0,
      errorMsg: "Missing main product photo",
    },
    {
      id: 4,
      label: "Multiple angles / detailed photos verified",
      isComplete: photos.length > 1,
      errorMsg: "Upload additional photo angles for +15 score",
    },
    {
      id: 5,
      label: "Cryptographic video inspection completed",
      isComplete: videos.length > 0,
      errorMsg: "Missing product walkthrough video",
    },
  ];

  if (deal.serialNumber) {
    verificationSteps.push({
      id: 6,
      label: "Grading certification serial match",
      isComplete: true,
    });
  }

  let confidenceTitle = "Standard Protection";
  let confidenceMessage =
    "This deal has basic verification. You are protected by TrustLayer escrow, but seller documentation is limited.";

  if (deal.trustScore >= 90) {
    confidenceTitle = "High Trust Transaction";
    confidenceMessage =
      "This deal has maximum verification coverage. The seller has provided a verified profile, multiple image angles, and a video walkthrough.";
  } else if (deal.trustScore >= 70) {
    confidenceTitle = "Good Trust Coverage";
    confidenceMessage =
      "Most verification checks are complete. Consider requesting additional photos or video if you want absolute certainty.";
  }

  return { verificationSteps, confidenceTitle, confidenceMessage };
}
