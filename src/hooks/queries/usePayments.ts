import { useMutation } from "@tanstack/react-query";
import paymentsService, { CreateCheckoutSessionResponse } from "@/services/payments.service";

/**
 * Mutation: POST /payments/deals/:dealId/create-checkout-session
 * Creates a Stripe Checkout Session to fund a deal.
 */
export function useCreateCheckoutSession({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: CreateCheckoutSessionResponse) => void;
  onError?: (error: Error) => void;
} = {}) {
  return useMutation({
    mutationFn: ({
      dealId,
      addressId,
      paymentMethod,
    }: {
      dealId: string;
      addressId: string;
      paymentMethod: "card" | "wallet";
    }) => paymentsService.createCheckoutSession(dealId, addressId, paymentMethod),
    onSuccess: (data) => {
      onSuccess?.(data);
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });
}
