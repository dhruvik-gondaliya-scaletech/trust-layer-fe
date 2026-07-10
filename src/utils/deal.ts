import { Step1FormData } from "@/features/create-deal/components/Step1ItemDetails";
import { OrderType, ProductType } from "@/types/api.types";
import { MediaSlot } from "@/types/deal.types";

export const mapCategoryToProductType = (category: string): ProductType => {
    switch (category) {
        case "Trading Cards":
            return "trading_cards";
        case "Sports Cards":
            return "sports_cards";
        case "Toys":
            return "toy";
        case "Plush":
            return "plush";
        case "Figures":
            return "figure";
        default:
            return "other";
    }
};

export const mapProductTypeToCategory = (pt: ProductType | string): string => {
    switch (pt) {
        case "trading_cards":
            return "Trading Cards";
        case "sports_cards":
            return "Sports Cards";
        case "toy":
            return "Toys";
        case "plush":
            return "Plush";
        case "figure":
            return "Figures";
        default:
            return "";
    }
};

export const mapOrderType = (ot: string): OrderType => {
    return ot === "In-Person Transaction" ? "in_person" : "online";
};

export const mapStep1ToDto = (data: Step1FormData) => ({
    title: data.title,
    price: data.price,
    productType: mapCategoryToProductType(data.category),
    orderType: mapOrderType(data.orderType),
    isGraded: data.isGraded,
    serialNumber: data.gradedSerial || undefined,
    description: data.description || undefined,
    condition: data.condition || undefined,
});

// Fixed display order for Step 2 media slots (0-indexed sortOrder on the backend).
export const SLOT_SORT_ORDER: Record<MediaSlot, number> = {
    main: 0,
    back: 1,
    leftSide: 2,
    rightSide: 3,
    detail: 4,
    video: 5,
    cert: 6,
};

export const SLOT_FILE_NAMES: Record<MediaSlot, string> = {
    main: "main.jpg",
    back: "back.jpg",
    leftSide: "left-side.jpg",
    rightSide: "right-side.jpg",
    detail: "detail.jpg",
    video: "verification.mp4",
    cert: "certificate.jpg",
};

export const dataURLtoBlob = (dataUrl: string): Blob => {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
};