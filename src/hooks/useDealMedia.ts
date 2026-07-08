import { MediaItem } from "@/types/buyer-view.types";

const PLACEHOLDER_MEDIA: MediaItem = {
  id: "placeholder",
  url: "/pokemon-main.jpg",
  mimeType: "image/jpeg",
  sortOrder: 0,
};

export function useDealMedia(media: MediaItem[]) {
  const photos = media?.filter((m) => m.mimeType.startsWith("image/")) || [];
  const videos = media?.filter((m) => m.mimeType.startsWith("video/")) || [];
  const activeMedia = [...photos, ...videos];

  if (activeMedia.length === 0) {
    activeMedia.push(PLACEHOLDER_MEDIA);
  }

  return { photos, videos, activeMedia };
}
