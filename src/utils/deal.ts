import { Step1FormData } from "@/features/create-deal/components/Step1ItemDetails";
import { ProductType } from "@/types/api.types";
import { OrderType } from "@/types/enums";
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
    return ot === "In-Person Transaction" ? OrderType.IN_PERSON : OrderType.ONLINE;
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

export const getStatusBadgeStyle = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("draft")) {
        return "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20";
    }
    if (s.includes("open") || s.includes("approved")) {
        return "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/20";
    }
    if (s.includes("funded")) {
        return "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20";
    }
    if (s.includes("shipped") || s.includes("transit")) {
        return "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20";
    }
    if (s.includes("delivered")) {
        return "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20";
    }
    if (s.includes("disputed")) {
        return "bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/20";
    }
    if (s.includes("complete") || s.includes("closed") || s.includes("success")) {
        return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20";
    }
    return "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20";
};

export const getStatusDotColor = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("draft")) return "bg-slate-400";
    if (s.includes("open") || s.includes("approved")) return "bg-cyan-500";
    if (s.includes("funded")) return "bg-indigo-500";
    if (s.includes("shipped") || s.includes("transit")) return "bg-purple-500";
    if (s.includes("delivered")) return "bg-amber-500";
    if (s.includes("disputed")) return "bg-red-500";
    if (s.includes("complete") || s.includes("closed") || s.includes("success")) return "bg-emerald-500";
    return "bg-slate-400";
};


export const getInitials = (title: string) => {
    if (!title) return "TL";
    return title
        .trim()
        .split(/\s+/)
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
};