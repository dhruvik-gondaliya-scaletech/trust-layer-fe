import httpService from "@/lib/http-services";
import { API_CONFIG } from "@/lib/contants";

export interface CreateCheckoutSessionResponse {
  url: string | null;
  dealNumber: string;
}

const paymentsService = {
  /**
   * POST /payments/deals/:dealId/create-checkout-session 🔒 Auth Required
   * Create a Stripe Checkout Session to fund a deal. The buyer completes
   * payment on Stripe's hosted page via the returned url.
   */
  createCheckoutSession: async (
    dealId: string,
    addressId: string,
    paymentMethod: "card" | "wallet"
  ): Promise<CreateCheckoutSessionResponse> => {
    const res = await httpService.post<CreateCheckoutSessionResponse>(
      API_CONFIG.PAYMENTS.CREATE_CHECKOUT_SESSION(dealId),
      { addressId, paymentMethod }
    );
    return res.data;
  },
};

export default paymentsService;
