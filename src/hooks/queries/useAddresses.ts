import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import addressService from "@/services/address.service";
import { AddressFormInput } from "@/lib/validations/address";

export const addressKeys = {
  all: ["addresses"] as const,
};

export function useAddresses() {
  return useQuery({
    queryKey: addressKeys.all,
    queryFn: () => addressService.getAddresses(),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

export function useAddAddress({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AddressFormInput) => addressService.addAddress(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.all });
      onSuccess?.();
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });
}

export function useSetDefaultAddress({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => addressService.setDefaultAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.all });
      onSuccess?.();
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });
}

export function useDeleteAddress({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => addressService.deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.all });
      onSuccess?.();
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });
}
