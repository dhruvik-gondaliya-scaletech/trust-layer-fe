import { Role } from "@/types/enums";

export const PLATFORM_FEE_PERCENTAGE = 3.5;
export const PLATFORM_FEE_FIXED = 0.3;

export interface EscrowFees {
  platformFee: number;
  buyerFeeShare: number;
  sellerFeeShare: number;
}

export function calculateEscrowFees(price: number, feePayer: string): EscrowFees {
  const platformFee = Number(
    (price * (PLATFORM_FEE_PERCENTAGE / 100) + PLATFORM_FEE_FIXED).toFixed(2)
  );

  let buyerFeeShare = 0;
  let sellerFeeShare = 0;

  const payer = feePayer.toLowerCase();

  if (payer === Role.BUYER || payer === "buyer pays") {
    buyerFeeShare = platformFee;
    sellerFeeShare = 0;
  } else if (payer === Role.SELLER || payer === "seller pays") {
    buyerFeeShare = 0;
    sellerFeeShare = platformFee;
  } else {
    // split or Split 50/50
    buyerFeeShare = Number(Math.ceil((platformFee * 100) / 2) / 100);
    sellerFeeShare = Number((platformFee - buyerFeeShare).toFixed(2));
  }

  return {
    platformFee,
    buyerFeeShare,
    sellerFeeShare,
  };
}
