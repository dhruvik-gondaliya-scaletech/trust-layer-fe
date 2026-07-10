export type MediaSlot =
    | "main"
    | "back"
    | "leftSide"
    | "rightSide"
    | "detail"
    | "video"
    | "cert";

export type MediaSlotIds = Partial<Record<MediaSlot, string | null>>;