import axios from "axios";
import httpService from "@/lib/http-services";
import { API_CONFIG } from "@/lib/contants";
import type {
  Deal,
  DealMedia,
  CreateDealDto,
  UpdateDealDto,
  MediaType,
  PresignedUrlResponse,
  ConfirmMediaDto,
} from "@/types/api.types";

/**
 * DEALS SERVICE
 *
 * Wraps all `/deals/*` endpoints from the TrustLayer API.
 * The HTTP client automatically unwraps the global `{ success, data, timestamp }`
 * envelope, so methods here resolve to the inner `data` payload directly.
 */
const dealsService = {
  /**
   * POST /deals 🔒 Auth Required
   * Create a new deal (starts in DRAFT status). Requires verified phone.
   */
  createDeal: async (dto: CreateDealDto): Promise<Deal> => {
    const res = await httpService.post<Deal>(API_CONFIG.DEALS.CREATE, dto);
    return res.data;
  },

  /**
   * GET /deals/my 🔒 Auth Required
   * Fetch all deals belonging to the authenticated user.
   */
  getMyDeals: async (role?: "seller" | "buyer" | "all"): Promise<Deal[]> => {
    const res = await httpService.get<Deal[]>(API_CONFIG.DEALS.MY_DEALS, {
      params: role ? { role } : undefined,
    });
    return res.data;
  },

  /**
   * GET /deals/:dealNumber 🔓 Public
   * Fetch a deal by its human-readable deal number (e.g. TRUST-1001).
   * Includes seller profile and media.
   */
  getDealByNumber: async (dealNumber: string): Promise<Deal> => {
    const res = await httpService.get<Deal>(
      API_CONFIG.DEALS.BY_DEAL_NUMBER(dealNumber)
    );
    return res.data;
  },

  /**
   * PATCH /deals/:id 🔒 Auth Required
   * Update a deal (only allowed when status is draft or open).
   * Automatically recalculates fees and trust score.
   */
  updateDeal: async (id: string, dto: UpdateDealDto): Promise<Deal> => {
    const res = await httpService.patch<Deal>(API_CONFIG.DEALS.UPDATE(id), dto);
    return res.data;
  },

  /**
   * POST /deals/:id/publish 🔒 Auth Required
   * Publish a deal: DRAFT → OPEN. Requires at least one main_photo.
   */
  publishDeal: async (id: string): Promise<Deal> => {
    const res = await httpService.post<Deal>(API_CONFIG.DEALS.PUBLISH(id));
    return res.data;
  },

  /**
   * DELETE /deals/:id 🔒 Auth Required
   * Soft-delete a deal (only allowed when status is draft or open).
   */
  deleteDeal: async (id: string): Promise<null> => {
    const res = await httpService.delete<null>(API_CONFIG.DEALS.DELETE(id));
    return res.data;
  },

  /**
   * POST /deals/:id/media/presign 🔒 Auth Required
   * Get an S3 presigned URL to upload a photo or video.
   */
  presignMedia: async (
    id: string,
    mimeType: string
  ): Promise<PresignedUrlResponse> => {
    const res = await httpService.post<PresignedUrlResponse>(
      API_CONFIG.DEALS.PRESIGN_MEDIA(id),
      null,
      {
        params: { mimeType },
      }
    );
    return res.data;
  },

  /**
   * PUT to S3 🔓 Public
   * Directly upload a file blob to the presigned S3 URL.
   * NOTE: This bypasses httpService interceptors to avoid sending bearer token headers.
   */
  uploadToS3: async (presignedUrl: string, file: Blob | File): Promise<void> => {
    await axios.put(presignedUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
    });
  },

  /**
   * POST /deals/:id/media/confirm 🔒 Auth Required
   * Confirm media upload after direct S3 upload.
   */
  confirmMedia: async (
    id: string,
    dto: ConfirmMediaDto
  ): Promise<DealMedia> => {
    const res = await httpService.post<DealMedia>(
      API_CONFIG.DEALS.CONFIRM_MEDIA(id),
      dto
    );
    return res.data;
  },

  /**
   * DELETE /deals/:id/media/:mediaId 🔒 Auth Required
   * Soft-delete a media item from a deal. Recalculates trust score.
   */
  deleteMedia: async (id: string, mediaId: string): Promise<null> => {
    const res = await httpService.delete<null>(
      API_CONFIG.DEALS.DELETE_MEDIA(id, mediaId)
    );
    return res.data;
  },
};

export default dealsService;
