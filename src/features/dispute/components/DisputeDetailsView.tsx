"use client";

import React, { useState } from "react";
import { BackButton } from "@/components/shared/BackButton";
import type { Dispute, Deal, RespondDisputeDto, ShipReturnDto } from "@/types/api.types";
import { DisputeStatusBanner } from "./DisputeStatusBanner";
import { ReturnDetailsCard } from "./ReturnDetailsCard";
import { DisputeClaimCard } from "./DisputeClaimCard";
import { DealSummaryCard } from "./DealSummaryCard";
import { DisputeActions } from "./DisputeActions";
import { SellerRespondModal } from "./SellerRespondModal";
import { EscalateModal } from "./EscalateModal";
import { AcceptDeclineModal } from "./AcceptDeclineModal";
import { ShipReturnModal } from "./ShipReturnModal";
// ─── Props ────────────────────────────────────────────────────────────────────

interface DisputeDetailsViewProps {
  deal: Deal;
  dispute: Dispute;
  isBuyer: boolean;
  isSeller: boolean;
  onRespond: (dto: RespondDisputeDto) => Promise<void>;
  isRespondPending: boolean;
  onEscalate: () => Promise<void>;
  isEscalatePending: boolean;
  onAcceptDecline: () => Promise<void>;
  isAcceptDeclinePending: boolean;
  onShipReturn: (dto: ShipReturnDto) => Promise<void>;
  isShipReturnPending: boolean;
  onConfirmReturn: () => Promise<void>;
  isConfirmReturnPending: boolean;
  onBack: () => void;
}

// ─── View ─────────────────────────────────────────────────────────────────────

export default function DisputeDetailsView({
  deal,
  dispute,
  isBuyer,
  isSeller,
  onRespond,
  isRespondPending,
  onEscalate,
  isEscalatePending,
  onAcceptDecline,
  isAcceptDeclinePending,
  onShipReturn,
  isShipReturnPending,
  onConfirmReturn,
  isConfirmReturnPending,
  onBack,
}: DisputeDetailsViewProps) {
  // ── Modal open/close state lives here so the view coordinates all modals ──
  const [isRespondModalOpen, setIsRespondModalOpen] = useState(false);
  const [isEscalateModalOpen, setIsEscalateModalOpen] = useState(false);
  const [isAcceptDeclineModalOpen, setIsAcceptDeclineModalOpen] = useState(false);
  const [isShipReturnModalOpen, setIsShipReturnModalOpen] = useState(false);

  // Derived flags used by child components
  const isReturnShipped =
    deal.status === "return_shipped" || deal.status === "return_delivered";

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-20">

      {/* ── Sticky header ── */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto flex items-center justify-between px-4 py-4 w-full">
          <BackButton onClick={onBack} className="-ml-2" />
          <span className="text-[15px] font-extrabold tracking-tight">Dispute Center</span>
          <div className="w-8" />
        </div>
      </div>

      {/* ── Page body ── */}
      <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 space-y-5">
        <DisputeStatusBanner dispute={dispute} isBuyer={isBuyer} />

        <ReturnDetailsCard dispute={dispute} deal={deal} />

        <DisputeClaimCard dispute={dispute} />

        <DealSummaryCard deal={deal} />

        <DisputeActions
          dispute={dispute}
          deal={deal}
          isBuyer={isBuyer}
          isSeller={isSeller}
          isReturnShipped={isReturnShipped}
          isConfirmReturnPending={isConfirmReturnPending}
          onOpenRespondModal={() => setIsRespondModalOpen(true)}
          onOpenEscalateModal={() => setIsEscalateModalOpen(true)}
          onOpenAcceptDeclineModal={() => setIsAcceptDeclineModalOpen(true)}
          onOpenShipReturnModal={() => setIsShipReturnModalOpen(true)}
          onConfirmReturn={onConfirmReturn}
        />
      </div>

      {/* ── Modals ── */}
      <SellerRespondModal
        isOpen={isRespondModalOpen}
        isPending={isRespondPending}
        onClose={() => setIsRespondModalOpen(false)}
        onSubmit={onRespond}
      />

      <EscalateModal
        isOpen={isEscalateModalOpen}
        isPending={isEscalatePending}
        onClose={() => setIsEscalateModalOpen(false)}
        onConfirm={onEscalate}
      />

      <AcceptDeclineModal
        isOpen={isAcceptDeclineModalOpen}
        isPending={isAcceptDeclinePending}
        onClose={() => setIsAcceptDeclineModalOpen(false)}
        onConfirm={onAcceptDecline}
      />

      <ShipReturnModal
        isOpen={isShipReturnModalOpen}
        isPending={isShipReturnPending}
        onClose={() => setIsShipReturnModalOpen(false)}
        onSubmit={onShipReturn}
      />
    </div>
  );
}
