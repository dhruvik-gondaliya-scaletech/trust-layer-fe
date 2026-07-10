import { useQuery } from "@tanstack/react-query";
import usersService from "@/services/users.service";
import dealsService from "@/services/deals.service";
import walletService from "@/services/wallet.service";
import { formatCurrency } from "@/lib/utils";

export interface DashboardData {
  user: {
    name: string;
    avatar: string;
    welcomeMessage: string;
    emailVerified: boolean;
    phoneVerified: boolean;
  };
  quickActions: Array<{
    id: string;
    title: string;
    description: string;
    actionLabel: string;
    type: string;
  }>;
  recentDeals: Array<{
    id: string;
    dealNumber: string;
    title: string;
    type: "selling" | "buying";
    score: number;
    status: string;
    statusType: "warning" | "success" | "muted" | string;
    price: string;
    image: string;
    mediaUrl: string | null;
  }>;
  insights: {
    activeListings: number;
    awaitingFunds: number;
    inTransit: number;
    completedDeals: number;
  };
  activity: {
    sellingActive: number;
    buyingActive: number;
  };
  wallet: {
    availableBalance: string;
    inEscrow: string;
    readyToWithdraw: string;
  };
}

export const dashboardKeys = {
  all: ["dashboardData"] as const,
  byRole: (role: "seller" | "buyer", stateOverride?: string) => [...dashboardKeys.all, role, stateOverride] as const,
};



function getFriendlyStatus(status: string, role: "selling" | "buying"): { text: string; type: string } {
  switch (status) {
    case "draft":
      return { text: "Draft", type: "muted" };
    case "open":
      return role === "buying"
        ? { text: "Awaiting Funding", type: "warning" }
        : { text: "Awaiting Buyer", type: "muted" };
    case "funded":
      return role === "selling"
        ? { text: "Shipment Required", type: "warning" }
        : { text: "Seller Preparing", type: "success" };
    case "shipped":
      return { text: "In Transit", type: "success" };
    case "delivered":
      return role === "buying"
        ? { text: "Delivered (Confirm Release)", type: "warning" }
        : { text: "Delivered (Awaiting Release)", type: "success" };
    case "disputed":
      return { text: "Disputed", type: "warning" };
    case "closed":
      return { text: "Completed", type: "muted" };
    case "cancelled":
      return { text: "Cancelled", type: "muted" };
    default:
      if (status.startsWith("return_")) {
        return { text: "Return Pending", type: "warning" };
      }
      return { text: status.charAt(0).toUpperCase() + status.slice(1), type: "muted" };
  }
}

export function useDashboardData(role: "seller" | "buyer", stateOverride?: "success" | "loading" | "error" | "empty") {
  return useQuery<DashboardData, Error>({
    queryKey: dashboardKeys.byRole(role, stateOverride),
    queryFn: async () => {
      // 1. Fetch current user
      const user = await usersService.getMe();

      // 2. Fetch my deals
      const deals = await dealsService.getMyDeals(role);

      // 3. Fetch wallet with lazy initialization (404) handling
      let wallet;
      try {
        wallet = await walletService.getMe();
      } catch (err: any) {
        const is404 =
          err?.statusCode === 404 ||
          err?.response?.status === 404 ||
          String(err?.message || "").includes("404") ||
          String(err?.message || "").includes("not found");

        if (is404) {
          wallet = {
            id: "",
            userId: user.id,
            pendingBalance: "0.00",
            availableBalance: "0.00",
            createdAt: "",
            updatedAt: "",
            deletedAt: null,
          };
        } else {
          throw err;
        }
      }

      // Generate Quick Actions based on deal states
      const quickActions: DashboardData["quickActions"] = [];
      deals.forEach((deal) => {
        const isSeller = deal.sellerId === user.id;
        const isBuyer = deal.buyerId === user.id;

        if (deal.status === "open" && isBuyer) {
          quickActions.push({
            id: deal.dealNumber,
            title: deal.title,
            description: "Secure escrow funds for this item",
            actionLabel: "Pay Now",
            type: "fund_escrow",
          });
        } else if (deal.status === "funded" && isSeller) {
          quickActions.push({
            id: deal.dealNumber,
            title: deal.title,
            description: "Upload shipping tracking information",
            actionLabel: "Ship Item",
            type: "upload_tracking",
          });
        } else if (deal.status === "shipped" && isBuyer) {
          quickActions.push({
            id: deal.dealNumber,
            title: deal.title,
            description: "Confirm item delivery to release locked funds",
            actionLabel: "Release Funds",
            type: "release_funds",
          });
        }
      });

      // Map Deals to Recent Deals
      const recentDeals: DashboardData["recentDeals"] = deals.slice(0, 10).map((deal) => {
        const isSeller = deal.sellerId === user.id;
        const role: "selling" | "buying" = isSeller ? "selling" : "buying";
        const friendly = getFriendlyStatus(deal.status, role);

        // Pick the image with the lowest sortOrder (primary thumbnail)
        const primaryMedia = deal.media
          ?.filter((m) => m.mimeType?.startsWith("image/"))
          .sort((a, b) => a.sortOrder - b.sortOrder)[0];

        return {
          id: deal.id,
          dealNumber: deal.dealNumber,
          title: deal.title,
          type: role,
          score: deal.trustScore,
          status: friendly.text,
          statusType: friendly.type,
          price: formatCurrency(deal.buyerPaysAmount),
          image: deal.productType,
          mediaUrl: primaryMedia?.url ?? null,
        };
      });

      // Compute stats
      const activeListings = deals.filter(
        (d) => d.status !== "draft" && d.status !== "closed" && d.status !== "cancelled"
      ).length;
      const awaitingFunds = deals.filter((d) => d.status === "open").length;
      const inTransit = deals.filter((d) => d.status === "shipped").length;
      const completedDeals = deals.filter((d) => d.status === "closed").length;

      const sellingActive = deals.filter(
        (d) => d.sellerId === user.id && d.status !== "closed" && d.status !== "cancelled" && d.status !== "draft"
      ).length;
      const buyingActive = deals.filter(
        (d) => d.buyerId === user.id && d.status !== "closed" && d.status !== "cancelled" && d.status !== "draft"
      ).length;

      return {
        user: {
          name: user.firstName || user.username || "User",
          avatar: user.profilePhotoUrl || "",
          welcomeMessage: `Welcome back, ${user.firstName || "User"}`,
          emailVerified: !!user.emailVerifiedAt,
          phoneVerified: !!user.phoneVerifiedAt,
        },
        quickActions,
        recentDeals,
        insights: {
          activeListings,
          awaitingFunds,
          inTransit,
          completedDeals,
        },
        activity: {
          sellingActive,
          buyingActive,
        },
        wallet: {
          availableBalance: formatCurrency(wallet.availableBalance),
          inEscrow: formatCurrency(wallet.pendingBalance),
          readyToWithdraw: formatCurrency(wallet.availableBalance),
        },
      };
    },
    staleTime: 5000,
  });
}
