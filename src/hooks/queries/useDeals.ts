import { useMutation, useQuery, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import dealsService from "@/services/deals.service";
import s3Service from "@/services/s3.service";
import type { CreateDealDto, UpdateDealDto, Deal, DeclineDealDto, ShipDealDto, DealStatusResponse } from "@/types/api.types";
import { ProofType, UploadPurpose } from "@/types/enums";
import { dashboardKeys } from "@/hooks/queries/useDashboardData";

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const dealKeys = {
  all: ["deals"] as const,
  myDeals: (role?: string) => [...dealKeys.all, "my", role ?? "all"] as const,
  byDealNumber: (dealNumber: string) => [...dealKeys.all, "detail", dealNumber] as const,
  byId: (id: string) => [...dealKeys.all, "id", id] as const,
  statusByDealNumber: (dealNumber: string) => [...dealKeys.all, "status", dealNumber] as const,
};

/**
 * Query: GET /deals/my (Infinite Query)
 * Fetches paginated deals belonging to the authenticated user.
 * Cached for 30 seconds.
 */
export function useMyDeals(role?: "seller" | "buyer" | "all", options?: { enabled?: boolean }) {
  return useInfiniteQuery({
    queryKey: dealKeys.myDeals(role),
    queryFn: ({ pageParam = 1 }) => dealsService.getMyDeals(role, pageParam, 10),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined;
    },
    staleTime: 30_000,
    retry: 1,
    enabled: options?.enabled,
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

// ─── useDealById ─────────────────────────────────────────────────────────────

/**
 * Query: GET /deals/id/:id 🔒 Auth Required
 * Fetches a single deal by its UUID.
 * Cached for 30 seconds.
 */
export function useDealById(id: string | undefined) {
  return useQuery({
    queryKey: dealKeys.byId(id ?? ""),
    queryFn: () => dealsService.getDealById(id!),
    enabled: !!id,
    staleTime: 30_000,
    retry: 1,
  });
}

// ─── useDealStatus ───────────────────────────────────────────────────────────

/**
 * Query: GET /deals/:dealNumber/status 🔒 Auth Required
 * Fetches lightweight status of a deal by its number (e.g. TRUST-1001) for polling.
 */
export function useDealStatus(
  dealNumber: string | undefined,
  options?: { enabled?: boolean; refetchInterval?: number | false }
) {
  return useQuery({
    queryKey: dealKeys.statusByDealNumber(dealNumber ?? ""),
    queryFn: () => dealsService.getDealStatusByNumber(dealNumber!),
    enabled: !!dealNumber && (options?.enabled ?? true),
    refetchInterval: options?.refetchInterval,
    staleTime: 0,
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
      queryClient.invalidateQueries({ queryKey: [...dealKeys.all, "my"] });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
      onSuccess?.(deal.id);
    },
    onError: (error: Error) => {
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
  onSuccess?: (deal: Deal) => void;
  onError?: (error: Error) => void;
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateDealDto }) =>
      dealsService.updateDeal(id, dto),
    onSuccess: (deal) => {
      queryClient.invalidateQueries({ queryKey: [...dealKeys.all, "my"] });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
      queryClient.invalidateQueries({ queryKey: dealKeys.byId(deal.id) });
      queryClient.invalidateQueries({ queryKey: dealKeys.byDealNumber(deal.dealNumber) });
      queryClient.invalidateQueries({ queryKey: dealKeys.statusByDealNumber(deal.dealNumber) });
      onSuccess?.(deal);
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });
}

// ─── usePublishDeal ───────────────────────────────────────────────────────────

/**
 * Mutation: PATCH /deals/:id with publish: true
 * Publishes a DRAFT deal → OPEN. Requires at least one main_photo.
 */
export function usePublishDeal({
  dealNumber,
  onSuccess,
  onError,
}: {
  dealNumber?: string;
  onSuccess?: (deal: Deal) => void;
  onError?: (error: Error) => void;
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => dealsService.updateDeal(id, { publish: true }),
    onSuccess: (deal) => {
      queryClient.invalidateQueries({ queryKey: [...dealKeys.all, "my"] });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
      queryClient.invalidateQueries({ queryKey: dealKeys.byId(deal.id) });
      queryClient.invalidateQueries({ queryKey: dealKeys.byDealNumber(deal.dealNumber) });
      queryClient.invalidateQueries({ queryKey: dealKeys.statusByDealNumber(deal.dealNumber) });
      onSuccess?.(deal);
    },
    onError: (error: Error) => {
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
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [...dealKeys.all, "my"] });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
      queryClient.invalidateQueries({ queryKey: dealKeys.byId(id) });
      const cachedDeal = queryClient.getQueryData<Deal>(dealKeys.byId(id));
      if (cachedDeal?.dealNumber) {
        queryClient.invalidateQueries({ queryKey: dealKeys.byDealNumber(cachedDeal.dealNumber) });
        queryClient.invalidateQueries({ queryKey: dealKeys.statusByDealNumber(cachedDeal.dealNumber) });
      }
      onSuccess?.();
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });
}

// ─── useUploadDealMedia ───────────────────────────────────────────────────────

/**
 * Mutation: POST /s3/pre-signed-url → S3 POST → POST /deals/:id/media
 * Presigns straight into the deal's own S3 folder (dealId in the presign
 * payload), uploads the file, then attaches it to the deal.
 * Invalidates relevant caches on success.
 */
export function useUploadDealMedia({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      dealId,
      file,
      sortOrder,
      fileName,
      proofType = ProofType.ITEM_MEDIA,
    }: {
      dealId: string;
      file: File | Blob;
      sortOrder: number;
      fileName?: string;
      proofType?: ProofType;
    }) => {
      // 1. Get presigned URL via S3 service — presigned into the deal's folder
      const presignedUrls = await s3Service.getPreSignedUrls({
        files: [
          {
            purpose: UploadPurpose.DEAL_MEDIA,
            fileName: fileName || (file as File).name || "media.jpg",
            contentType: file.type || "image/jpeg",
            dealId,
          },
        ],
      });
      const presignResponse = presignedUrls[0];
      // 2. Put file directly to S3
      await s3Service.uploadToS3(presignResponse, file);
      // 3. Add to the deal
      return await dealsService.addMedia(dealId, {
        key: presignResponse.key,
        mimeType: file.type || "image/jpeg",
        sizeBytes: file.size,
        sortOrder,
        proofType,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...dealKeys.all, "my"] });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
      queryClient.invalidateQueries({ queryKey: dealKeys.byId(variables.dealId) });
      const cachedDeal = queryClient.getQueryData<Deal>(dealKeys.byId(variables.dealId));
      if (cachedDeal?.dealNumber) {
        queryClient.invalidateQueries({ queryKey: dealKeys.byDealNumber(cachedDeal.dealNumber) });
        queryClient.invalidateQueries({ queryKey: dealKeys.statusByDealNumber(cachedDeal.dealNumber) });
      }
      onSuccess?.();
    },
    onError: (error: Error) => {
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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...dealKeys.all, "my"] });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
      queryClient.invalidateQueries({ queryKey: dealKeys.byId(variables.dealId) });
      const cachedDeal = queryClient.getQueryData<Deal>(dealKeys.byId(variables.dealId));
      const targetDealNumber = dealNumber || cachedDeal?.dealNumber;
      if (targetDealNumber) {
        queryClient.invalidateQueries({ queryKey: dealKeys.byDealNumber(targetDealNumber) });
        queryClient.invalidateQueries({ queryKey: dealKeys.statusByDealNumber(targetDealNumber) });
      }
      onSuccess?.();
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });
}

/**
 * Mutation: POST /deals/:id/decline
 * Declines a deal. Invalidates my-deals and by-number caches.
 */
export function useDeclineDeal({
  dealNumber,
  onSuccess,
  onError,
}: {
  dealNumber: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: DeclineDealDto }) =>
      dealsService.declineDeal(id, dto),
    onSuccess: (deal) => {
      queryClient.invalidateQueries({ queryKey: [...dealKeys.all, "my"] });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
      queryClient.invalidateQueries({ queryKey: dealKeys.byId(deal.id) });
      queryClient.invalidateQueries({ queryKey: dealKeys.byDealNumber(deal.dealNumber) });
      queryClient.invalidateQueries({ queryKey: dealKeys.statusByDealNumber(deal.dealNumber) });
      onSuccess?.();
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });
}

/**
 * Mutation: POST /deals/:id/ship
 * Marks a deal as shipped. Invalidates my-deals and by-number caches.
 */
export function useShipDeal({
  dealId,
  onSuccess,
  onError,
}: {
  dealId: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: ShipDealDto }) =>
      dealsService.shipDeal(id, dto),
    onSuccess: (deal) => {
      queryClient.invalidateQueries({ queryKey: [...dealKeys.all, "my"] });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
      queryClient.invalidateQueries({ queryKey: dealKeys.byId(deal.id) });
      queryClient.invalidateQueries({ queryKey: dealKeys.byDealNumber(deal.dealNumber) });
      queryClient.invalidateQueries({ queryKey: dealKeys.statusByDealNumber(deal.dealNumber) });
      onSuccess?.();
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });
}

/**
 * Mutation: POST /deals/:id/confirm-delivery
 * Confirms delivery of a deal. Invalidates my-deals and by-number caches.
 */
export function useConfirmDelivery({
  dealId,
  onSuccess,
  onError,
}: {
  dealId: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => dealsService.confirmDelivery(id),
    onSuccess: (deal) => {
      queryClient.invalidateQueries({ queryKey: [...dealKeys.all, "my"] });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
      queryClient.invalidateQueries({ queryKey: dealKeys.byId(deal.id) });
      queryClient.invalidateQueries({ queryKey: dealKeys.byDealNumber(deal.dealNumber) });
      queryClient.invalidateQueries({ queryKey: dealKeys.statusByDealNumber(deal.dealNumber) });
      onSuccess?.();
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });
}

