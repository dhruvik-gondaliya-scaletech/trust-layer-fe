import { useQuery } from "@tanstack/react-query";

export interface DashboardData {
  user: {
    name: string;
    avatar: string;
    welcomeMessage: string;
    emailVerified: boolean;
    phoneVerified: boolean;
    notificationCount: number;
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
    title: string;
    type: "selling" | "buying";
    score: number;
    status: "Awaiting Tracking" | "In Transit" | "Delivered" | string;
    statusType: "warning" | "success" | "muted" | string;
    price: string;
    image: string;
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

const MOCK_DASHBOARD_DATA: DashboardData = {
  user: {
    name: "Alex",
    avatar: "/placeholder-avatar.jpg", // We can use avatar emoji or initials if image is missing
    welcomeMessage: "Welcome back to TrustLayer 👋",
    emailVerified: true,
    phoneVerified: true,
    notificationCount: 4,
  },
  quickActions: [
    {
      id: "qa-1",
      title: "Charizard Holo 1999",
      description: "Upload tracking information",
      actionLabel: "Action",
      type: "upload_tracking",
    },
  ],
  recentDeals: [
    {
      id: "deal-1",
      title: "Charizard Holo 1999 Base Set",
      type: "selling",
      score: 96,
      status: "Awaiting Tracking",
      statusType: "warning",
      price: "$4,300",
      image: "🔥", // Emoji representational icons/colors since we want rich aesthetics without broken images
    },
    {
      id: "deal-2",
      title: "Vintage Leica M6",
      type: "buying",
      score: 84,
      status: "In Transit",
      statusType: "success",
      price: "$2,400",
      image: "📷",
    },
    {
      id: "deal-3",
      title: "MacBook Pro M3",
      type: "selling",
      score: 99,
      status: "Delivered",
      statusType: "muted",
      price: "$1,850",
      image: "💻",
    },
  ],
  insights: {
    activeListings: 3,
    awaitingFunds: 1,
    inTransit: 1,
    completedDeals: 16,
  },
  activity: {
    sellingActive: 1,
    buyingActive: 1,
  },
  wallet: {
    availableBalance: "$1,250.00",
    inEscrow: "$8,500.00",
    readyToWithdraw: "$1,250.00",
  },
};

export function useDashboardData(stateOverride?: "success" | "loading" | "error" | "empty") {
  return useQuery<DashboardData, Error>({
    queryKey: ["dashboardData", stateOverride],
    queryFn: async () => {
      // Determine the simulated state
      let state: string | null = stateOverride || null;
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        state = params.get("state") || stateOverride || "success";
      } else {
        state = state || "success";
      }

      // Simulate network latency (1.0 second)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (state === "error") {
        throw new Error("Failed to fetch dashboard data. Please check your internet connection and try again.");
      }

      if (state === "empty") {
        return {
          user: {
            ...MOCK_DASHBOARD_DATA.user,
            notificationCount: 0,
          },
          quickActions: [],
          recentDeals: [],
          insights: {
            activeListings: 0,
            awaitingFunds: 0,
            inTransit: 0,
            completedDeals: 0,
          },
          activity: {
            sellingActive: 0,
            buyingActive: 0,
          },
          wallet: {
            availableBalance: "$0.00",
            inEscrow: "$0.00",
            readyToWithdraw: "$0.00",
          },
        };
      }

      return MOCK_DASHBOARD_DATA;
    },
    staleTime: 5000,
  });
}
