import { useState } from "react";

export function useDeclineFlow(onDeclineDeal: (reason?: string, explanation?: string) => Promise<void> | void) {
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [showFeedbackSuccess, setShowFeedbackSuccess] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [declineMessage, setDeclineMessage] = useState("");
  const [isSubmittingDecline, setIsSubmittingDecline] = useState(false);

  const handleDeclineSubmit = async () => {
    setIsSubmittingDecline(true);
    try {
      await onDeclineDeal(declineReason, declineMessage);
      setShowDeclineModal(false);
      setShowFeedbackSuccess(true);
    } catch (e: any) {
      console.error("Decline action failed:", e);
    } finally {
      setIsSubmittingDecline(false);
    }
  };

  return {
    showDeclineModal,
    setShowDeclineModal,
    showFeedbackSuccess,
    setShowFeedbackSuccess,
    declineReason,
    setDeclineReason,
    declineMessage,
    setDeclineMessage,
    isSubmittingDecline,
    handleDeclineSubmit,
  };
}
