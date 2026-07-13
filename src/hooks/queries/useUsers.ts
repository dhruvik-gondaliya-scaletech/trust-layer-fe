import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import usersService from "@/services/users.service";
import s3Service from "@/services/s3.service";
import { AUTH_STORAGE_KEYS } from "@/lib/contants";
import { getStorageItem } from "@/lib/storage";
import { UploadPurpose } from "@/types/enums";
import type { UpdateProfileDto, User } from "@/types/api.types";
import { dashboardKeys } from "@/hooks/queries/useDashboardData";

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
      !!getStorageItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN)
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
export function useCurrentUser(enabled?: boolean) {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: () => usersService.getMe(),
    enabled: enabled !== undefined ? enabled : hasStoredToken(),
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
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
      onSuccess?.();
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });
}

// ─── useUploadProfilePhoto ────────────────────────────────────────────────────

/**
 * Mutation: S3 upload + PATCH /users/me
 * Uploads a new profile photo via S3. Invalidates the me cache on success.
 */
export function useUploadProfilePhoto({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: User) => void;
  onError?: (error: Error) => void;
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      // 1. Get presigned post credentials
      const presignedUrls = await s3Service.getPreSignedUrls({
        files: [
          {
            purpose: UploadPurpose.PROFILE_PHOTO,
            fileName: file.name,
            contentType: file.type,
          },
        ],
      });
      const presignResponse = presignedUrls[0];

      // 2. Upload file to S3 using POST
      await s3Service.uploadToS3(presignResponse, file);

      // 3. Update the user's profile with the new photo CDN URL
      return await usersService.updateMe({
        profilePhotoUrl: presignResponse.cdnUrl,
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
      onSuccess?.(data);
    },
    onError: (error: Error) => {
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
