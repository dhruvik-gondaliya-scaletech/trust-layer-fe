import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import dealsService from "@/services/deals.service";
import type { CreateDealDto, UpdateDealDto, MediaType } from "@/types/api.types";

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const dealKeys = {
  all: ["deals"] as const,
  myDeals: () => [...dealKeys.all, "my"] as const,
  byDealNumber: (dealNumber: string) => [...dealKeys.all, "detail", dealNumber] as const,
};

// ─── useMyDeals ───────────────────────────────────────────────────────────────

/**
 * Query: GET /deals/my
 * Fetches all deals belonging to the authenticated user (as seller).
 * Cached for 30 seconds.
 */
export function useMyDeals() {
  return useQuery({
    queryKey: dealKeys.myDeals(),
    queryFn: () => dealsService.getMyDeals(),
    staleTime: 30_000,
    retry: 1,
  });
}

// ─── useDeal ─────────────────────────────────────────────────────────────────

/**
 * Query: GET /deals/:dealNumber
 * Fetches a single deal by its deal number (e.g. TRUST-1001).
 * Cached for 30 seconds.
 */
export function useDeal(dealNumber: string | undefined) {
  return useQuery({
    queryKey: dealKeys.byDealNumber(dealNumber ?? ""),
    queryFn: () => dealsService.getDealByNumber(dealNumber!),
    enabled: !!dealNumber,
    staleTime: 30_000,
    retry: 1,
  });
}

// ─── useCreateDeal ────────────────────────────────────────────────────────────

/**
 * Mutation: POST /deals
 * Creates a new deal (starts in DRAFT status). Invalidates my-deals cache.
 */
export function useCreateDeal({
  onSuccess,
  onError,
}: {
  onSuccess?: (dealId: string) => void;
  onError?: (error: Error) => void;
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateDealDto) => dealsService.createDeal(dto),
    onSuccess: (deal) => {
      queryClient.invalidateQueries({ queryKey: dealKeys.myDeals() });
      toast.success(`Deal "${deal.dealNumber}" created successfully.`);
      onSuccess?.(deal.id);
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Failed to create deal. Please try again.");
      onError?.(error);
    },
  });
}

// ─── useUpdateDeal ────────────────────────────────────────────────────────────

/**
 * Mutation: PATCH /deals/:id
 * Updates a deal. Invalidates affected caches on success.
 */
export function useUpdateDeal({
  dealNumber,
  onSuccess,
  onError,
}: {
  dealNumber?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateDealDto }) =>
      dealsService.updateDeal(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dealKeys.myDeals() });
      if (dealNumber) {
        queryClient.invalidateQueries({
          queryKey: dealKeys.byDealNumber(dealNumber),
        });
      }
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Failed to update deal. Please try again.");
      onError?.(error);
    },
  });
}

// ─── usePublishDeal ───────────────────────────────────────────────────────────

/**
 * Mutation: POST /deals/:id/publish
 * Publishes a DRAFT deal → OPEN. Requires at least one main_photo.
 */
export function usePublishDeal({
  dealNumber,
  onSuccess,
  onError,
}: {
  dealNumber?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => dealsService.publishDeal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dealKeys.myDeals() });
      if (dealNumber) {
        queryClient.invalidateQueries({
          queryKey: dealKeys.byDealNumber(dealNumber),
        });
      }
      toast.success("Deal published successfully!");
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Failed to publish deal. Please try again.");
      onError?.(error);
    },
  });
}

// ─── useDeleteDeal ────────────────────────────────────────────────────────────

/**
 * Mutation: DELETE /deals/:id
 * Soft-deletes a deal (draft or open only). Invalidates my-deals cache.
 */
export function useDeleteDeal({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => dealsService.deleteDeal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dealKeys.myDeals() });
      toast.success("Deal deleted.");
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Failed to delete deal. Please try again.");
      onError?.(error);
    },
  });
}

// ─── useUploadDealMedia ───────────────────────────────────────────────────────

/**
 * Mutation: POST /deals/:id/media
 * Uploads a media file for a deal. Invalidates relevant caches on success.
 */
export function useUploadDealMedia({
  dealNumber,
  onSuccess,
  onError,
}: {
  dealNumber?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      dealId,
      file,
      type,
    }: {
      dealId: string;
      file: File;
      type: MediaType;
    }) => dealsService.uploadMedia(dealId, file, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dealKeys.myDeals() });
      if (dealNumber) {
        queryClient.invalidateQueries({
          queryKey: dealKeys.byDealNumber(dealNumber),
        });
      }
      toast.success("Media uploaded successfully.");
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Media upload failed. Please try again.");
      onError?.(error);
    },
  });
}

// ─── useDeleteDealMedia ───────────────────────────────────────────────────────

/**
 * Mutation: DELETE /deals/:id/media/:mediaId
 * Soft-deletes a media item. Invalidates relevant caches on success.
 */
export function useDeleteDealMedia({
  dealNumber,
  onSuccess,
  onError,
}: {
  dealNumber?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ dealId, mediaId }: { dealId: string; mediaId: string }) =>
      dealsService.deleteMedia(dealId, mediaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dealKeys.myDeals() });
      if (dealNumber) {
        queryClient.invalidateQueries({
          queryKey: dealKeys.byDealNumber(dealNumber),
        });
      }
      toast.success("Media removed.");
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Failed to remove media. Please try again.");
      onError?.(error);
    },
  });
}
