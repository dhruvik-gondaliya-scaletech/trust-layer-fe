export interface MediaItem {
    id: string;
    url: string;
    mimeType: string;
    sortOrder: number;
}

export interface Deal {
    id: string;
    dealNumber: string;
    title: string;
    description: string;
    price: number;
    shippingCost: number;
    platformFeeAmount: number;
    buyerPaysAmount: number;
    productType: string;
    orderType: string;
    handlingTime: string;
    carrier: string;
    shippingType: string;
    feePayer: string;
    trustScore: number;
    condition?: string;
    serialNumber?: string;
    gradedCompany?: string;
    gradedScore?: string;
    media: MediaItem[];
}

export interface BuyerViewProps {
    deal: Deal;
    isLoggedIn: boolean;
    onFundEscrow: () => void;
    onDeclineDeal: (reason?: string, explanation?: string) => Promise<void> | void;
    onLogin: () => void;
}

export interface VerificationStep {
    id: number;
    label: string;
    isComplete: boolean;
    errorMsg?: string;
}

