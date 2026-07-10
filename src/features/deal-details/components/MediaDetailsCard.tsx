"use client";

import { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { Deal, DealMedia } from "@/types/api.types";
import { cn } from "@/lib/utils";
import { Image as ImageIcon, Play, Maximize2, Video } from "lucide-react";

interface MediaDetailsCardProps {
  deal: Deal;
}

const getMediaLabel = (type?: string) => {
  if (!type) return "Product Media";
  switch (type) {
    case "main_photo":
    case "item_media":
      return "Main Photo";
    case "back":
    case "back_photo":
    case "back_view":
      return "Back View";
    case "left_side":
    case "leftSide":
      return "Left View";
    case "right_side":
    case "rightSide":
      return "Right View";
    case "detail":
      return "Detail View";
    case "cert_photo":
    case "serial_cert":
      return "Certificate";
    case "video":
      return "Verification Video";
    case "drop_off_receipt":
      return "Drop-off Receipt";
    case "package":
      return "Package Photo";
    default:
      return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }
};

export function MediaDetailsCard({ deal }: MediaDetailsCardProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const mediaList = [...(deal.media ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);
  const photos = mediaList.filter((m) => (m.mimeType ?? "").startsWith("image/"));
  const videos = mediaList.filter((m) => (m.mimeType ?? "").startsWith("video/") || m.type === "video");
  const allMedia = [...photos, ...videos];

  const activeItem = allMedia[activeIndex];

  if (allMedia.length === 0) {
    return null;
  }

  return (
    <Card className="p-0 border-gray-100 shadow-sm rounded-2xl overflow-hidden bg-white">
      <div className="p-5 border-b border-gray-50 flex items-center justify-between">
        <div className="flex flex-col">
          <h3 className="font-bold text-[16px] text-gray-900 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-primary" /> Item Media & Verification
          </h3>
          <p className="text-[12px] text-gray-500 mt-0.5">
            Physical proof and scanning media of the item.
          </p>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center overflow-hidden">
        {activeItem ? (
          (activeItem.mimeType ?? "").startsWith("video/") || activeItem.type === "video" ? (
            <video
              src={activeItem.url}
              className="w-full h-full object-contain"
              controls
              playsInline
            />
          ) : (
            <div
              className="relative w-full h-full cursor-zoom-in group"
              onClick={() => setIsOpen(true)}
            >
              <Image
                src={activeItem.url}
                alt={getMediaLabel(activeItem.type)}
                fill
                sizes="(max-width: 768px) 100vw, 672px"
                className="object-contain transition-all duration-300"
                priority
              />
              <span className="absolute bottom-4 left-4 px-2.5 py-1 rounded-md bg-black/60 text-white text-[11px] font-bold backdrop-blur-xs select-none">
                {getMediaLabel(activeItem.type)}
              </span>
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="bg-black/60 text-white rounded-full p-2.5 text-xs flex items-center gap-1.5 font-bold shadow-md">
                  <Maximize2 className="w-3.5 h-3.5" /> Zoom
                </span>
              </div>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-500">
            <ImageIcon className="w-8 h-8" />
            <span className="text-xs">No preview available</span>
          </div>
        )}
      </div>

      {/* Thumbnail Selector List */}
      {allMedia.length > 1 && (
        <div className="flex gap-2 overflow-x-auto p-4 bg-slate-50/50 border-t border-gray-100 scrollbar-none">
          {allMedia.map((m, idx) => {
            const isVideo = (m.mimeType ?? "").startsWith("video/") || m.type === "video";
            const isActive = idx === activeIndex;
            return (
              <button
                key={m.id || idx}
                onClick={() => setActiveIndex(idx)}
                className={cn(
                  "relative w-16 h-16 rounded-xl overflow-hidden border-2 bg-slate-900 transition-all shrink-0 cursor-pointer shadow-xs focus:outline-hidden",
                  isActive
                    ? "border-primary ring-2 ring-primary/20 scale-[0.98]"
                    : "border-transparent hover:border-gray-300"
                )}
              >
                {isVideo ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-white gap-1 select-none">
                    <Video className="w-4 h-4 text-primary animate-pulse" />
                    <span className="text-[9px] uppercase font-bold text-gray-300">Video</span>
                  </div>
                ) : (
                  <Image
                    src={m.url}
                    alt={getMediaLabel(m.type)}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                )}
                {isVideo && (
                  <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full bg-primary/95 text-white flex items-center justify-center shadow-xs">
                      <Play className="w-2.5 h-2.5 fill-current text-white translate-x-[0.5px]" />
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Media Count & Info Bar */}
      <div className="px-5 py-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[11px] font-bold text-gray-500 uppercase tracking-wider">
        <span>
          {photos.length} Photo{photos.length !== 1 && "s"}
          {videos.length > 0 && ` · ${videos.length} Video${videos.length !== 1 && "s"}`}
        </span>
        <span className="text-primary flex items-center gap-1 text-[10px]">
          🛡️ Secured by TrustLayer
        </span>
      </div>

      {/* Lightbox / Zoom Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[95vw] md:max-w-4xl p-0 border-none bg-black/95 text-white aspect-auto max-h-[85vh] flex items-center justify-center overflow-hidden rounded-2xl">
          {activeItem && (
            <div className="relative w-full h-[75vh] flex items-center justify-center p-4">
              <Image
                src={activeItem.url}
                alt="Zoomed item view"
                fill
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
