import { CarouselMediaItem, TimelineMediaItem } from "@/types/timeline.types";

export function useTimelineMedia(media: TimelineMediaItem[] = []) {
  const mainPhoto = media.find((m) => m.type === "main_photo")?.url;
  const certPhoto = media.find((m) => m.type === "serial_cert")?.url;
  const productPhotos = media.filter((m) => m.type === "additional_photo").map((m) => m.url);
  const videoMedia = media.find((m) => m.type === "video")?.url;

  const carouselItems: CarouselMediaItem[] = [];
  if (mainPhoto) carouselItems.push({ type: "image", url: mainPhoto, label: "Main Photo" });
  productPhotos.forEach((url, i) => {
    carouselItems.push({ type: "image", url, label: `Product Photo ${i + 1}` });
  });
  if (certPhoto) carouselItems.push({ type: "image", url: certPhoto, label: "Certificate Photo" });
  if (videoMedia) carouselItems.push({ type: "video", url: videoMedia, label: "Verification Video" });

  return { carouselItems, certPhoto, videoMedia };
}
