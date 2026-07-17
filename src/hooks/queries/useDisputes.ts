import { useMutation, useQuery, useQueryClient, QueryClient } from "@tanstack/react-query";
import disputeService from "@/services/dispute.service";
import type {
  Dispute,
  CreateDisputeDto,
  RespondDisputeDto,
  ShipReturnDto,
  Deal,
} from "@/types/api.types";
import { dealKeys } from "@/hooks/queries/useDeals";
import { dashboardKeys } from "@/hooks/queries/useDashboardData";

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const disputeKeys = {
  all: ["disputes"] as const,
  byDealId: (dealId: string) => [...disputeKeys.all, "deal", dealId] as const,
};

// ─── useDisputeByDealId ────────────────────────────────────────────────────────

/**
 * Query: GET /disputes/deal/:dealId 🔒 Auth Required
 * Fetches the dispute details associated with a specific deal.
 * Cached for 30 seconds.
 */
export function useDisputeByDealId(dealId: string | undefined) {
  return useQuery({
    queryKey: disputeKeys.byDealId(dealId ?? ""),
    queryFn: () => disputeService.getDisputeByDealId(dealId!),
    enabled: !!dealId,
    staleTime: 30_000,
    retry: 1,
  });
}

// ─── Helper function for invalidating deal caches ────────────────────────────

function invalidateDealCaches(queryClient: QueryClient, dealId: string) {
  // Invalidate my-deals cache list
  queryClient.invalidateQueries({ queryKey: [...dealKeys.all, "my"] });
  // Invalidate dashboard totals/metrics
  queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
  // Invalidate specific deal detail by database ID (UUID)
  queryClient.invalidateQueries({ queryKey: dealKeys.byId(dealId) });

  // Look up cached deal to find user-friendly deal number (e.g. TRUST-1001) for detail/status caches
  const cachedDeal = queryClient.getQueryData<Deal>(dealKeys.byId(dealId));
  if (cachedDeal?.dealNumber) {
    queryClient.invalidateQueries({ queryKey: dealKeys.byDealNumber(cachedDeal.dealNumber) });
    queryClient.invalidateQueries({ queryKey: dealKeys.statusByDealNumber(cachedDeal.dealNumber) });
  }
}

// ─── useCreateDispute ─────────────────────────────────────────────────────────

/**
 * Mutation: POST /disputes
 * Buyer opens a dispute. Invalidates dispute details and related deal/dashboard caches.
 */
export function useCreateDispute({
  onSuccess,
  onError,
}: {
  onSuccess?: (dispute: Dispute) => void;
  onError?: (error: Error) => void;
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateDisputeDto) => disputeService.createDispute(dto),
    onSuccess: (dispute) => {
      // Invalidate query for this dispute
      queryClient.invalidateQueries({ queryKey: disputeKeys.byDealId(dispute.dealId) });
      // Invalidate affected deal queries
      invalidateDealCaches(queryClient, dispute.dealId);

      onSuccess?.(dispute);
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });
}

// ─── useRespondToDispute ──────────────────────────────────────────────────────

/**
 * Mutation: POST /disputes/:id/respond
 * Seller responds to a dispute (refund, return, or decline).
 */
export function useRespondToDispute({
  onSuccess,
  onError,
}: {
  onSuccess?: (dispute: Dispute) => void;
  onError?: (error: Error) => void;
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: RespondDisputeDto }) =>
      disputeService.respondToDispute(id, dto),
    onSuccess: (dispute) => {
      queryClient.invalidateQueries({ queryKey: disputeKeys.byDealId(dispute.dealId) });
      invalidateDealCaches(queryClient, dispute.dealId);

      onSuccess?.(dispute);
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });
}

// ─── useEscalateDispute ───────────────────────────────────────────────────────

/**
 * Mutation: POST /disputes/:id/escalate
 * Buyer escalates the dispute for admin review.
 */
export function useEscalateDispute({
  onSuccess,
  onError,
}: {
  onSuccess?: (dispute: Dispute) => void;
  onError?: (error: Error) => void;
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => disputeService.escalateDispute(id),
    onSuccess: (dispute) => {
      queryClient.invalidateQueries({ queryKey: disputeKeys.byDealId(dispute.dealId) });
      invalidateDealCaches(queryClient, dispute.dealId);

      onSuccess?.(dispute);
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });
}

// ─── useAcceptDecline ─────────────────────────────────────────────────────────

/**
 * Mutation: POST /disputes/:id/accept-decline
 * Buyer accepts a seller's decline.
 */
export function useAcceptDecline({
  onSuccess,
  onError,
}: {
  onSuccess?: (dispute: Dispute) => void;
  onError?: (error: Error) => void;
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => disputeService.acceptDecline(id),
    onSuccess: (dispute) => {
      queryClient.invalidateQueries({ queryKey: disputeKeys.byDealId(dispute.dealId) });
      invalidateDealCaches(queryClient, dispute.dealId);

      onSuccess?.(dispute);
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });
}

// ─── useShipReturn ────────────────────────────────────────────────────────────

/**
 * Mutation: POST /disputes/:id/ship-return
 * Buyer ships the item back to the seller for a return-then-refund.
 */
export function useShipReturn({
  onSuccess,
  onError,
}: {
  onSuccess?: (dispute: Dispute) => void;
  onError?: (error: Error) => void;
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: ShipReturnDto }) =>
      disputeService.shipReturn(id, dto),
    onSuccess: (dispute) => {
      queryClient.invalidateQueries({ queryKey: disputeKeys.byDealId(dispute.dealId) });
      invalidateDealCaches(queryClient, dispute.dealId);

      onSuccess?.(dispute);
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });
}

// ─── useConfirmReturn ─────────────────────────────────────────────────────────

/**
 * Mutation: POST /disputes/:id/confirm-return
 * Seller confirms receipt of the returned item.
 */
export function useConfirmReturn({
  onSuccess,
  onError,
}: {
  onSuccess?: (dispute: Dispute) => void;
  onError?: (error: Error) => void;
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => disputeService.confirmReturn(id),
    onSuccess: (dispute) => {
      queryClient.invalidateQueries({ queryKey: disputeKeys.byDealId(dispute.dealId) });
      invalidateDealCaches(queryClient, dispute.dealId);

      onSuccess?.(dispute);
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });
}
