import httpService from "@/lib/http-services";
import { API_CONFIG } from "@/lib/contants";
import type {
  Deal,
  DealMedia,
  CreateDealDto,
  UpdateDealDto,
  ConfirmMediaDto,
  DeclineDealDto,
  ShipDealDto,
  DealStatusResponse,
  PaginatedDeals,
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
  getMyDeals: async (
    role?: "seller" | "buyer" | "all",
    page?: number,
    limit?: number
  ): Promise<PaginatedDeals> => {
    const res = await httpService.get<PaginatedDeals>(API_CONFIG.DEALS.MY_DEALS, {
      params: {
        ...(role ? { role } : {}),
        ...(page ? { page } : {}),
        ...(limit ? { limit } : {}),
      },
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
   * GET /deals/id/:id 🔒 Auth Required
   * Fetch a deal by its database ID (UUID).
   */
  getDealById: async (id: string): Promise<Deal> => {
    const res = await httpService.get<Deal>(API_CONFIG.DEALS.BY_ID(id));
    return res.data;
  },

  /**
   * GET /deals/:dealNumber/status 🔒 Auth Required
   * Fetch lightweight status of a deal by its number.
   */
  getDealStatusByNumber: async (dealNumber: string): Promise<DealStatusResponse> => {
    const res = await httpService.get<DealStatusResponse>(
      API_CONFIG.DEALS.STATUS(dealNumber)
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
   * DELETE /deals/:id 🔒 Auth Required
   * Soft-delete a deal (only allowed when status is draft or open).
   */
  deleteDeal: async (id: string): Promise<null> => {
    const res = await httpService.delete<null>(API_CONFIG.DEALS.DELETE(id));
    return res.data;
  },



  /**
   * POST /deals/:id/media 🔒 Auth Required
   * Add a single media item to an existing OPEN deal.
   */
  addMedia: async (
    id: string,
    dto: ConfirmMediaDto
  ): Promise<DealMedia> => {
    const res = await httpService.post<DealMedia>(
      API_CONFIG.DEALS.ADD_MEDIA(id),
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

  /**
   * POST /deals/:id/decline 🔒 Auth Required
   * Decline a deal.
   */
  declineDeal: async (id: string, dto: DeclineDealDto): Promise<Deal> => {
    const res = await httpService.post<Deal>(API_CONFIG.DEALS.DECLINE(id), dto);
    return res.data;
  },

  /**
   * POST /deals/:id/ship 🔒 Auth Required
   * Ship a deal.
   */
  shipDeal: async (id: string, dto: ShipDealDto): Promise<Deal> => {
    const res = await httpService.post<Deal>(API_CONFIG.DEALS.SHIP(id), dto);
    return res.data;
  },

  /**
   * POST /deals/:id/confirm-delivery 🔒 Auth Required
   * Confirm delivery of a deal.
   */
  confirmDelivery: async (id: string): Promise<Deal> => {
    const res = await httpService.post<Deal>(API_CONFIG.DEALS.CONFIRM_DELIVERY(id));
    return res.data;
  },
};

export default dealsService;
