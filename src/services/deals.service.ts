import httpService from "@/lib/http-services";
import { API_CONFIG } from "@/lib/contants";
import type {
  Deal,
  DealMedia,
  CreateDealDto,
  UpdateDealDto,
  MediaType,
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
   * Fetch all deals belonging to the authenticated user (as seller).
   */
  getMyDeals: async (): Promise<Deal[]> => {
    const res = await httpService.get<Deal[]>(API_CONFIG.DEALS.MY_DEALS);
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
   * POST /deals/:id/media 🔒 Auth Required
   * Upload a media file (multipart/form-data) for a deal.
   * Recalculates the deal's trust score after upload.
   */
  uploadMedia: async (
    id: string,
    file: File,
    type: MediaType
  ): Promise<DealMedia> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await httpService.post<DealMedia>(
      API_CONFIG.DEALS.UPLOAD_MEDIA(id),
      formData,
      {
        params: { type },
        headers: { "Content-Type": "multipart/form-data" },
      }
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
