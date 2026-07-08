interface FeeSummaryInput {
  price: number;
  feePayer: string;
  shippingCost: number;
  platformFeeAmount: number;
  buyerPaysAmount: number;
}

export function useFeeSummary({ price, feePayer, shippingCost, platformFeeAmount, buyerPaysAmount }: FeeSummaryInput) {
  // Derive the buyer's share of the fee based on feePayer logic
  const buyerFeeShare =
    feePayer === "buyer"
      ? platformFeeAmount
      : feePayer === "split"
      ? Number((platformFeeAmount / 2).toFixed(2))
      : 0;

  // Use the backend-computed total (buyerPaysAmount) as the authoritative total
  const totalDue = buyerPaysAmount > 0 ? buyerPaysAmount : Number((price + shippingCost + buyerFeeShare).toFixed(2));

  return { platformFee: platformFeeAmount, buyerFeeShare, totalDue };
}
