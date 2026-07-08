"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ShieldCheck, Image as ImageIcon, Video, Sparkles } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { MediaItem } from "@/types/buyer-view.types";

interface MediaGalleryProps {
  activeMedia: MediaItem[];
  activeImageIndex: number;
  setActiveImageIndex: (updater: (current: number) => number) => void;
  photosCount: number;
  videosCount: number;
  displayScore: number;
  isScoreLoaded: boolean;
  showBurst: boolean;
}

export function MediaGallery({
  activeMedia,
  activeImageIndex,
  setActiveImageIndex,
  photosCount,
  videosCount,
  displayScore,
  isScoreLoaded,
  showBurst,
}: MediaGalleryProps) {
  return (
    <div>
      <div className="relative w-full aspect-square bg-slate-900 rounded-3xl overflow-hidden shadow-md flex items-center justify-center mb-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeImageIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {activeMedia[activeImageIndex]?.mimeType.startsWith("video/") ? (
              <div className="w-full h-full relative bg-black">
                <video
                  src={activeMedia[activeImageIndex].url}
                  className="absolute inset-0 w-full h-full object-cover"
                  controls
                  playsInline
                />
              </div>
            ) : activeMedia[activeImageIndex]?.url ? (
              <Image
                src={activeMedia[activeImageIndex].url}
                alt="Product view"
                fill
                className="object-cover"
              />
            ) : null}
          </motion.div>
        </AnimatePresence>

        {/* Top right overlay - Trust Badge */}
        <div className="absolute top-4 right-4 flex justify-end items-start z-10 pointer-events-none">
          <div className={cn(
            "relative transition-all duration-1000",
            isScoreLoaded ? "scale-100 opacity-100" : "scale-90 opacity-0"
          )}>
            {/* Glow behind badge */}
            <div className="absolute inset-0 bg-blue-500/30 blur-2xl rounded-full" />

            {/* Premium Badge Container */}
            <div className="relative flex items-center gap-3 pl-3 pr-5 py-2.5 rounded-[24px] bg-gradient-to-b from-[#1e3a8a]/95 to-[#0f172a]/95 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.4)] border border-[#F5C542]/30 ring-1 ring-[#F5C542]/10">
              {/* Left Icon Area */}
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#F5C542] to-[#d97706] shadow-[0_0_15px_rgba(245,197,66,0.3)] border border-[#F5C542]/50">
                <ShieldCheck className="w-5 h-5 text-blue-950" strokeWidth={2.5} />
              </div>

              {/* Right Text Area */}
              <div className="flex flex-col pt-0.5">
                <span className="text-[#F5C542] text-[10.5px] font-bold tracking-[0.15em] uppercase leading-none mb-1">
                  Trust Score
                </span>
                <span className="text-white text-[24px] font-black leading-none drop-shadow-md">
                  {displayScore}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Burst animation overlay */}
        <AnimatePresence>
          {showBurst && (
            <motion.div
               initial={{ opacity: 0, scale: 0.5 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 1.1 }}
               className="absolute inset-0 bg-white/95 backdrop-blur-sm z-30 flex flex-col items-center justify-center rounded-3xl"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                 <ShieldCheck className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-green-700">Verified Listing</h3>
              <p className="text-sm font-bold text-amber-500 mt-1">Maximum Buyer Confidence</p>
              <Sparkles className="absolute top-10 left-10 w-6 h-6 text-[#F5C542] animate-ping" />
              <Sparkles className="absolute bottom-20 right-10 w-5 h-5 text-[#F5C542] animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Carousel Controls */}
        {activeMedia.length > 1 && (
          <>
            <button
              onClick={() => setActiveImageIndex((s) => (s === 0 ? activeMedia.length - 1 : s - 1))}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white z-20 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveImageIndex((s) => (s === activeMedia.length - 1 ? 0 : s + 1))}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white z-20 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Pagination Indicators */}
        {activeMedia.length > 1 && (
          <div className="absolute bottom-4 left-0 w-full flex justify-center gap-1.5 z-10">
            {activeMedia.map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  "h-1.5 rounded-full shadow-sm transition-all duration-300",
                  idx === activeImageIndex ? "w-6 bg-white" : "w-1.5 bg-white/50"
                )}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-center gap-4 text-[12px] font-bold text-muted-foreground uppercase tracking-wider">
        <span className="flex items-center gap-1.5"><ImageIcon className="w-3.5 h-3.5" /> {photosCount} Photos</span>
        <span className="text-gray-300">|</span>
        <span className="flex items-center gap-1.5"><Video className="w-3.5 h-3.5" /> {videosCount} Video</span>
      </div>
    </div>
  );
}
