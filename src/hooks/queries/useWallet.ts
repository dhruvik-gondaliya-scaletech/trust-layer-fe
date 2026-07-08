import { useQuery } from "@tanstack/react-query";
import walletService from "@/services/wallet.service";

export const walletKeys = {
  all: ["wallet"] as const,
  me: () => [...walletKeys.all, "me"] as const,
};

export function useWallet() {
  return useQuery({
    queryKey: walletKeys.me(),
    queryFn: () => walletService.getMe(),
    staleTime: 30 * 1000, // 30 seconds
  });
}
