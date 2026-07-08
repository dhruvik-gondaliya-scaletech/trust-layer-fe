import httpService from "@/lib/http-services";
import { API_CONFIG } from "@/lib/contants";
import type { User, PublicUser, UpdateProfileDto } from "@/types/api.types";

/**
 * USERS SERVICE
 *
 * Wraps all `/users/*` endpoints from the TrustLayer API.
 * The HTTP client automatically unwraps the global `{ success, data, timestamp }`
 * envelope, so methods here resolve to the inner `data` payload directly.
 */
const usersService = {
  /**
   * GET /users/me 🔒 Auth Required
   * Fetch the authenticated user's full profile.
   */
  getMe: async (): Promise<User> => {
    const res = await httpService.get<User>(API_CONFIG.USERS.ME);
    return res.data;
  },

  /**
   * PATCH /users/me 🔒 Auth Required
   * Update the authenticated user's profile fields. All fields optional.
   */
  updateMe: async (dto: UpdateProfileDto): Promise<User> => {
    const res = await httpService.patch<User>(API_CONFIG.USERS.ME, dto);
    return res.data;
  },


  /**
   * GET /users/:username 🔓 Public
   * Fetch a user's public profile by their username.
   */
  getByUsername: async (username: string): Promise<PublicUser> => {
    const res = await httpService.get<PublicUser>(
      API_CONFIG.USERS.BY_USERNAME(username)
    );
    return res.data;
  },
};

export default usersService;
