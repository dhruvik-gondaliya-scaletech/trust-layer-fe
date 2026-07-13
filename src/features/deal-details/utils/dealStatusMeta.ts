import type { DealStatus } from "@/types/api.types";

export type StatusTone = "emerald" | "blue" | "amber" | "red" | "slate" | "cyan" | "indigo" | "purple";

const BADGE_LABELS: Record<DealStatus, string> = {
  draft: "Draft",
  open: "Open",
  funded: "Funded",
  shipped: "Shipped",
  delivered: "Delivered",
  disputed: "Disputed",
  return_approved: "Return Approved",
  return_shipped: "Return Shipped",
  return_delivered: "Return Delivered",
  return_completed: "Return Completed",
  cancelled: "Cancelled",
  closed: "Completed",
};

const TONE_BY_STATUS: Record<DealStatus, StatusTone> = {
  draft: "slate",
  open: "cyan",
  funded: "indigo",
  shipped: "purple",
  delivered: "amber",
  disputed: "red",
  return_approved: "amber",
  return_shipped: "amber",
  return_delivered: "amber",
  return_completed: "slate",
  cancelled: "slate",
  closed: "emerald",
};

const TONE_CLASSES: Record<
  StatusTone,
  { badge: string; card: string; iconWrap: string }
> = {
  emerald: {
    badge: "bg-emerald-500 text-white",
    card: "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white",
    iconWrap: "bg-white/20 text-white",
  },
  blue: {
    badge: "bg-blue-500 text-white",
    card: "bg-gradient-to-br from-blue-600 to-indigo-700 text-white",
    iconWrap: "bg-white/20 text-white",
  },
  amber: {
    badge: "bg-amber-500 text-white",
    card: "bg-gradient-to-br from-amber-500 to-orange-600 text-white",
    iconWrap: "bg-white/20 text-white",
  },
  red: {
    badge: "bg-destructive text-white",
    card: "bg-gradient-to-br from-rose-600 to-red-700 text-white",
    iconWrap: "bg-white/20 text-white",
  },
  slate: {
    badge: "bg-slate-500 text-white",
    card: "bg-gradient-to-br from-slate-600 to-slate-700 text-white",
    iconWrap: "bg-white/20 text-white",
  },
  cyan: {
    badge: "bg-cyan-500 text-white",
    card: "bg-gradient-to-br from-cyan-500 to-blue-600 text-white",
    iconWrap: "bg-white/20 text-white",
  },
  indigo: {
    badge: "bg-indigo-500 text-white",
    card: "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white",
    iconWrap: "bg-white/20 text-white",
  },
  purple: {
    badge: "bg-purple-500 text-white",
    card: "bg-gradient-to-br from-purple-500 to-purple-600 text-white",
    iconWrap: "bg-white/20 text-white",
  },
};

const BANNER_COPY: Record<DealStatus, { title: string; lines: string[] }> = {
  draft: {
    title: "Draft Listing",
    lines: ["This deal hasn't been published yet."],
  },
  open: {
    title: "Awaiting Payment",
    lines: ["This deal is live and waiting for a buyer to secure payment."],
  },
  funded: {
    title: "Payment Secured",
    lines: [
      "Your payment is safely held by TrustLayer.",
      "The seller has been notified to ship your item.",
    ],
  },
  shipped: {
    title: "Item Shipped",
    lines: [
      "Your item is on its way!",
      "Funds remain secured until you confirm delivery.",
    ],
  },
  delivered: {
    title: "Delivered — Awaiting Confirmation",
    lines: [
      "Please inspect your item and confirm delivery.",
      "Funds will be released to the seller once confirmed.",
    ],
  },
  disputed: {
    title: "Dispute In Progress",
    lines: [
      "This transaction is currently under review.",
      "Our team is working to resolve this as quickly as possible.",
    ],
  },
  return_approved: {
    title: "Return Approved",
    lines: [
      "The seller has approved your return request.",
      "Ship the item back using the provided instructions.",
    ],
  },
  return_shipped: {
    title: "Return In Transit",
    lines: ["The item is on its way back to the seller."],
  },
  return_delivered: {
    title: "Return Delivered",
    lines: ["The seller has received the returned item."],
  },
  return_completed: {
    title: "Return Completed",
    lines: ["This return has been finalized."],
  },
  cancelled: {
    title: "Deal Cancelled",
    lines: ["This transaction was cancelled. No funds were captured."],
  },
  closed: {
    title: "Purchase Complete",
    lines: [
      "Your purchase has been completed successfully.",
      "The seller has received the funds.",
    ],
  },
};

export function getStatusBadgeMeta(status: DealStatus) {
  return { label: BADGE_LABELS[status], className: TONE_CLASSES[TONE_BY_STATUS[status]].badge };
}

export function getStatusBanner(status: DealStatus) {
  const tone = TONE_BY_STATUS[status];
  return { ...BANNER_COPY[status], tone, className: TONE_CLASSES[tone].card, iconClassName: TONE_CLASSES[tone].iconWrap };
}

// Statuses reachable today only via the local demo/simulation override
// (`useSimulateDealState`) — the real backend currently only ever produces
// draft → open → funded → shipped → closed. Handled anyway since the UI can
// see them through that override.
const HALTED_STATUSES: DealStatus[] = [
  "disputed",
  "return_approved",
  "return_shipped",
  "return_delivered",
  "return_completed",
  "cancelled",
];

// Ordinal rank used to derive progress-step completion. Several statuses
// share a rank because the current backend has no persisted state between
// them (e.g. "delivered" is never set on its own — confirm-delivery jumps
// straight from shipped to closed).
const STATUS_RANK: Record<DealStatus, number> = {
  draft: 0,
  open: 1,
  funded: 2,
  shipped: 3,
  delivered: 4,
  disputed: 4,
  return_approved: 4,
  return_shipped: 4,
  return_delivered: 4,
  return_completed: 4,
  closed: 5,
  cancelled: -1,
};

export type StepState = "done" | "current" | "halted" | "upcoming";

export interface ProgressStep {
  key: string;
  label: string;
  state: StepState;
}

const STEP_DEFS: { key: string; label: string; rank: number }[] = [
  { key: "funded", label: "Funded", rank: 2 },
  { key: "shipped", label: "Shipped", rank: 3 },
  { key: "delivered", label: "Delivered", rank: 4 },
  { key: "released", label: "Funds Released", rank: 5 },
];

export function getProgressSteps(status: DealStatus): ProgressStep[] {
  const rank = STATUS_RANK[status];
  const halted = HALTED_STATUSES.includes(status);
  let markedActive = false;

  return STEP_DEFS.map((step) => {
    if (rank >= step.rank) {
      return { key: step.key, label: step.label, state: "done" as const };
    }
    if (!markedActive) {
      markedActive = true;
      return { key: step.key, label: step.label, state: (halted ? "halted" : "current") as StepState };
    }
    return { key: step.key, label: step.label, state: "upcoming" as const };
  });
}
