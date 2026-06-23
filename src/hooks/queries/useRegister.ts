import { useMutation } from "@tanstack/react-query";
import { RegisterInput } from "@/lib/validations/register";

export function useRegisterMutation({
  onSuccess,
  onError,
}: {
  onSuccess: (data: { success: boolean; user: RegisterInput }) => void;
  onError: (error: Error) => void;
}) {
  return useMutation({
    mutationFn: async (data: RegisterInput) => {
      // Simulate network latency (1.5 seconds)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Trigger error state for testing if email contains "fail"
      if (data.email.toLowerCase().includes("fail")) {
        throw new Error("This email address is already registered.");
      }

      return { success: true, user: data };
    },
    onSuccess,
    onError,
  });
}
