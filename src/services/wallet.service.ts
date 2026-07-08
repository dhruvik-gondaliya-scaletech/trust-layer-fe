import httpService from "@/lib/http-services";
import { API_CONFIG } from "@/lib/contants";
import type { Wallet } from "@/types/api.types";

/**
 * WALLET SERVICE
 *
 * Wraps all `/wallet/*` endpoints from the TrustLayer API.
 */
const walletService = {
  /**
   * GET /wallet/me 🔒 Auth Required
   * Fetch the authenticated user's wallet balances.
   */
  getMe: async (): Promise<Wallet> => {
    const res = await httpService.get<Wallet>(API_CONFIG.WALLET.ME);
    return res.data;
  },
};

export default walletService;
