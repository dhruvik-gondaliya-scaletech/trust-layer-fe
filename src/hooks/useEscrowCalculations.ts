import type { Wallet } from "@/types/api.types";
import { Role } from "@/types/enums";
import { calculateEscrowFees } from "@/utils/fee";

export function useEscrowCalculations(
  deal: { price: number; feePayer: string; shippingCost: number },
  wallet: Wallet | undefined
) {
  const { platformFee, buyerFeeShare } = calculateEscrowFees(deal.price, deal.feePayer);

  const totalAmount = Number((deal.price + buyerFeeShare + deal.shippingCost).toFixed(2));
  const feeOption = deal.feePayer === Role.BUYER ? 1 : deal.feePayer === Role.SELLER ? 2 : 0;

  const walletBalance = wallet ? parseFloat(wallet.availableBalance) : 0;
  const isSufficient = walletBalance >= totalAmount;
  const remainingBalance = Number((walletBalance - totalAmount).toFixed(2));

  return {
    platformFee,
    buyerFeeShare,
    totalAmount,
    feeOption,
    walletBalance,
    isSufficient,
    remainingBalance,
  };
}


