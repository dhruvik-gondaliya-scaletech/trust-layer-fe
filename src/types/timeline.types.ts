export interface TimelineMediaItem {
    type?: string;
    url: string;
}

export interface CarouselMediaItem {
    type: "image" | "video";
    url: string;
    label: string;
}

export interface TimelineDeal {
    id: string;
    dealNumber: string;
    title: string;
    price: number | string;
    status: string;
    trustScore: number;
    isGraded?: boolean;
    serialNumber?: string;
    handlingTime?: string;
    isInsured?: boolean;
    carrier?: string;
    shippingType?: string;
    platformFeeAmount: number | string;
    buyerPaysAmount: number | string;
    sellerReceivesAmount: number | string;
    media?: TimelineMediaItem[];
    buyerId?: string | null;
    sellerId?: string | null;
    trackingNumber?: string | null;
    seller?: {
        username: string | null;
        firstName?: string | null;
        profilePhotoUrl?: string | null;
    };
    reviewRating?: number;
    reviewComment?: string;
}

export interface TimelineProps {
    deal: TimelineDeal;
    currentStatus: string;
    isSeller: boolean;
    isBuyer: boolean;
    onBack: () => void;
    onFundEscrow: () => void;
    onShip: () => void;
    onConfirmDelivery: () => void;
    onFileDispute: () => void;
    onReviewSeller: () => void;
}
