import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import usersService from "@/services/users.service";
import type { UpdateProfileDto } from "@/types/api.types";

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const userKeys = {
  all: ["user"] as const,
  me: () => [...userKeys.all, "me"] as const,
  byUsername: (username: string) => [...userKeys.all, "profile", username] as const,
};

// ─── useCurrentUser ───────────────────────────────────────────────────────────

function hasStoredToken(): boolean {
  try {
    return (
      typeof window !== "undefined" &&
      !!localStorage.getItem("tl_access_token")
    );
  } catch {
    return false;
  }
}

/**
 * Query: GET /users/me
 * Fetches the authenticated user's full profile.
 * Only fires when an access token is present in localStorage.
 * Cached for 60 seconds (staleTime).
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: () => usersService.getMe(),
    enabled: hasStoredToken(),
    staleTime: 60_000,
    retry: 1,
  });
}


// ─── useUpdateProfile ─────────────────────────────────────────────────────────

/**
 * Mutation: PATCH /users/me
 * Updates the authenticated user's profile. Invalidates the me cache on success.
 */
export function useUpdateProfile({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateProfileDto) => usersService.updateMe(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
      toast.success("Profile updated successfully.");
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Failed to update profile. Please try again.");
      onError?.(error);
    },
  });
}

// ─── useUploadProfilePhoto ────────────────────────────────────────────────────

/**
 * Mutation: POST /users/me/photo
 * Uploads a new profile photo. Invalidates the me cache on success.
 */
export function useUploadProfilePhoto({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => usersService.uploadPhoto(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
      toast.success("Profile photo updated.");
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Photo upload failed. Please try again.");
      onError?.(error);
    },
  });
}

// ─── usePublicProfile ─────────────────────────────────────────────────────────

/**
 * Query: GET /users/:username
 * Fetches a user's public profile by username. Cached for 5 minutes.
 */
export function usePublicProfile(username: string | undefined) {
  return useQuery({
    queryKey: userKeys.byUsername(username ?? ""),
    queryFn: () => usersService.getByUsername(username!),
    enabled: !!username,
    staleTime: 5 * 60_000,
    retry: 1,
  });
}
