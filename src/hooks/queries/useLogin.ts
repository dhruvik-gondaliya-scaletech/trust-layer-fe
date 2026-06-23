import { useMutation } from "@tanstack/react-query";
import { LoginInput } from "@/lib/validations/login";

export function useLoginMutation({
  onSuccess,
  onError,
}: {
  onSuccess: (data: { success: boolean; email: string }) => void;
  onError: (error: Error) => void;
}) {
  return useMutation({
    mutationFn: async (data: LoginInput) => {
      // Simulate network latency (1.5 seconds)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Trigger error state for testing if email contains "fail"
      if (data.email.toLowerCase().includes("fail")) {
        throw new Error("Invalid email address or password.");
      }

      return { success: true, email: data.email };
    },
    onSuccess,
    onError,
  });
}
