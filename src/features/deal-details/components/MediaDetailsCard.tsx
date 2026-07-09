"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ImageOff, Play, FileText, Camera } from "lucide-react";
import type { Deal, DealMedia } from "@/types/api.types";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface MediaDetailsCardProps {
  deal: Deal;
}

const SLOT_METADATA: Record<number, { label: string; shortLabel: string; description: string }> = {
  0: { label: "Front (Main) Photo", shortLabel: "Front", description: "Primary view of the item" },
  1: { label: "Back Photo", shortLabel: "Back", description: "Back view of the item" },
  2: { label: "Left Side Photo", shortLabel: "Left Side", description: "Left side view" },
  3: { label: "Right Side Photo", shortLabel: "Right Side", description: "Right side view" },
  4: { label: "Closeup Detail Photo", shortLabel: "Closeup", description: "Close-up or defect details" },
  5: { label: "Verification Video", shortLabel: "Video", description: "Continuous video verification" },
  6: { label: "Certificate Photo", shortLabel: "Certificate", description: "Certificate of authenticity" },
};

export function MediaDetailsCard({ deal }: MediaDetailsCardProps) {
  const mediaItems = [...(deal.media ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);
  const [activeMedia, setActiveMedia] = useState<DealMedia | null>(null);

  // Set default active media to the first item (typically sortOrder 0)
  useEffect(() => {
    if (mediaItems.length > 0) {
      setActiveMedia(mediaItems[0]);
    } else {
      setActiveMedia(null);
    }
  }, [deal.media]);

  if (mediaItems.length === 0) {
    return (
      <Card className="p-6 border-gray-100 shadow-sm rounded-2xl bg-white text-center flex flex-col items-center justify-center min-h-[200px]">
        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-3">
          <ImageOff size={24} />
        </div>
        <h4 className="text-sm font-bold text-gray-800">No Media Uploaded</h4>
        <p className="text-xs text-gray-500 mt-1 max-w-[280px]">
          There are no photos or videos uploaded for verification on this deal.
        </p>
      </Card>
    );
  }

  const getMediaMeta = (item: DealMedia) => {
    return SLOT_METADATA[item.sortOrder] || {
      label: `Verification Media #${item.sortOrder}`,
      shortLabel: `Media #${item.sortOrder}`,
      description: "Additional item media"
    };
  };

  const isActive = (item: DealMedia) => activeMedia?.id === item.id;
  const isVideo = (item: DealMedia) => (item.mimeType ?? "").startsWith("video/") || item.sortOrder === 5;
  const isCert = (item: DealMedia) => item.sortOrder === 6;

  const currentMeta = activeMedia ? getMediaMeta(activeMedia) : null;

  return (
    <Card className="p-5 border-gray-100 shadow-sm rounded-2xl bg-white overflow-hidden flex flex-col gap-4">
      <div>
        <h3 className="font-bold text-[16px] text-gray-900 flex items-center gap-2">
          <Camera className="w-4 h-4 text-blue-600" /> Item Media & Verification
        </h3>
        <p className="text-[12px] text-gray-400 mt-0.5 font-medium">
          Review the condition details and proof of authenticity.
        </p>
      </div>

      {/* Main Preview Area */}
      <div className="relative w-full aspect-[4/3] bg-slate-950 rounded-2xl overflow-hidden shadow-inner border border-slate-900 group">
        {activeMedia ? (
          isVideo(activeMedia) ? (
            <video
              key={activeMedia.id}
              src={activeMedia.url}
              controls
              className="w-full h-full object-contain"
              preload="metadata"
            />
          ) : (
            <div className="relative w-full h-full">
              <Image
                src={activeMedia.url}
                alt={currentMeta?.label ?? "Item Media"}
                fill
                priority
                className="object-contain"
                sizes="(max-w-768px) 100vw, 640px"
              />
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-500">
            <ImageOff className="w-10 h-10 mb-2" />
            <span className="text-xs">No preview available</span>
          </div>
        )}

        {/* Selected Media Label Overlay */}
        {currentMeta && (
          <div className="absolute bottom-4 left-4 right-4 bg-slate-900/80 backdrop-blur-md px-3 py-2 rounded-xl text-white pointer-events-none transition-all duration-200">
            <p className="text-xs font-bold">{currentMeta.label}</p>
            <p className="text-[10px] text-slate-300 font-medium truncate mt-0.5">{currentMeta.description}</p>
          </div>
        )}
      </div>

      {/* Thumbnails list */}
      <div className="flex gap-2 overflow-x-auto pb-1.5 pt-0.5 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {mediaItems.map((item) => {
          const meta = getMediaMeta(item);
          const itemIsVideo = isVideo(item);
          const itemIsCert = isCert(item);

          return (
            <button
              key={item.id}
              onClick={() => setActiveMedia(item)}
              className={cn(
                "relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 bg-slate-50 text-left transition-all duration-200 active:scale-95 flex flex-col justify-between",
                isActive(item) 
                  ? "border-blue-600 shadow-md ring-2 ring-blue-600/10" 
                  : "border-gray-100 hover:border-gray-300"
              )}
            >
              {itemIsVideo ? (
                <div className="absolute inset-0 bg-slate-900/10 hover:bg-slate-900/20 flex items-center justify-center text-slate-800 z-10">
                  <div className="w-8 h-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center text-slate-800">
                    <Play className="w-3.5 h-3.5 fill-current text-slate-800 translate-x-[1px]" />
                  </div>
                </div>
              ) : itemIsCert ? (
                <div className="absolute inset-0 bg-amber-500/5 flex items-center justify-center text-amber-600 z-10">
                  <FileText className="w-6 h-6" />
                </div>
              ) : null}

              {!itemIsVideo && !itemIsCert && (
                <div className="relative w-full h-full">
                  <Image
                    src={item.url}
                    alt={meta.shortLabel}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
              )}

              {/* Overlay Label */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-[1px] text-white py-0.5 px-1.5 text-[9px] font-bold text-center z-20 truncate">
                {meta.shortLabel}
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
