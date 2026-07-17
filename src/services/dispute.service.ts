import httpService from "@/lib/http-services";
import { API_CONFIG } from "@/lib/contants";
import type {
  Dispute,
  CreateDisputeDto,
  RespondDisputeDto,
  ShipReturnDto,
} from "@/types/api.types";

/**
 * DISPUTE SERVICE
 *
 * Wraps all `/disputes/*` endpoints from the TrustLayer API.
 * The HTTP client automatically unwraps the global `{ success, data, timestamp }`
 * envelope, so methods here resolve to the inner `data` payload directly.
 */
const disputeService = {
  /**
   * POST /disputes 🔒 Auth Required
   * Buyer opens a dispute on a SHIPPED deal.
   */
  createDispute: async (dto: CreateDisputeDto): Promise<Dispute> => {
    const res = await httpService.post<Dispute>(API_CONFIG.DISPUTES.CREATE, dto);
    return res.data;
  },

  /**
   * GET /disputes/deal/:dealId 🔒 Auth Required
   * Fetch the dispute details associated with a specific deal.
   */
  getDisputeByDealId: async (dealId: string): Promise<Dispute> => {
    const res = await httpService.get<Dispute>(API_CONFIG.DISPUTES.BY_DEAL_ID(dealId));
    return res.data;
  },

  /**
   * POST /disputes/:id/respond 🔒 Auth Required
   * Seller responds to the dispute (refund, return, or decline).
   */
  respondToDispute: async (id: string, dto: RespondDisputeDto): Promise<Dispute> => {
    const res = await httpService.post<Dispute>(API_CONFIG.DISPUTES.RESPOND(id), dto);
    return res.data;
  },

  /**
   * POST /disputes/:id/escalate 🔒 Auth Required
   * Buyer escalates the dispute for manual admin review.
   */
  escalateDispute: async (id: string): Promise<Dispute> => {
    const res = await httpService.post<Dispute>(API_CONFIG.DISPUTES.ESCALATE(id));
    return res.data;
  },

  /**
   * POST /disputes/:id/accept-decline 🔒 Auth Required
   * Buyer accepts a seller's decline.
   */
  acceptDecline: async (id: string): Promise<Dispute> => {
    const res = await httpService.post<Dispute>(API_CONFIG.DISPUTES.ACCEPT_DECLINE(id));
    return res.data;
  },

  /**
   * POST /disputes/:id/ship-return 🔒 Auth Required
   * Buyer ships the item back to the seller for a return-then-refund.
   */
  shipReturn: async (id: string, dto: ShipReturnDto): Promise<Dispute> => {
    const res = await httpService.post<Dispute>(API_CONFIG.DISPUTES.SHIP_RETURN(id), dto);
    return res.data;
  },

  /**
   * POST /disputes/:id/confirm-return 🔒 Auth Required
   * Seller confirms receipt of the returned item.
   */
  confirmReturn: async (id: string): Promise<Dispute> => {
    const res = await httpService.post<Dispute>(API_CONFIG.DISPUTES.CONFIRM_RETURN(id));
    return res.data;
  },
};

export default disputeService;
