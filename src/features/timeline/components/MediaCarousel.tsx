"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
} from "@/components/ui/carousel";
import type { CarouselMediaItem } from "@/types/timeline.types";
import Image from "next/image";

interface MediaCarouselProps {
  carouselItems: CarouselMediaItem[];
  certPhoto: string | undefined;
  videoMedia: string | undefined;
  isGraded: boolean | undefined;
  serialNumber: string | undefined;
  trustScore: number;
}

export function MediaCarousel({
  carouselItems,
  certPhoto,
  videoMedia,
  isGraded,
  serialNumber,
  trustScore,
}: MediaCarouselProps) {
  return (
    <>
      <div className="w-full aspect-square rounded-[32px] overflow-hidden bg-muted/30 border border-border/50 relative shadow-sm flex items-center justify-center">
        {carouselItems.length > 0 ? (
          <Carousel className="w-full h-full">
            <CarouselContent className="h-full">
              {carouselItems.map((item, idx) => (
                <CarouselItem key={idx} className="relative w-full h-full">
                  {item.type === "video" ? (
                    <video src={item.url} controls className="w-full h-full object-cover" />
                  ) : (
                    <Image src={item.url} alt={item.label} fill className="object-cover" />
                  )}

                  {/* Float Badge Overlays */}
                  {isGraded && (
                    <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10 pointer-events-none">
                      <span className="bg-black/75 text-white font-black text-[9px] tracking-widest uppercase px-2.5 py-1.5 rounded-lg w-fit shadow-md">
                        {serialNumber || "PSA 10"}
                      </span>
                      <span className="bg-yellow-500 text-black font-black text-[9px] tracking-widest uppercase px-2.5 py-1.5 rounded-lg w-fit shadow-md">
                        TRUST {trustScore}
                      </span>
                    </div>
                  )}
                </CarouselItem>
              ))}
            </CarouselContent>

            {carouselItems.length > 1 && (
              <>
                <CarouselPrevious className="left-3 bg-black/45 text-white hover:bg-black/60 hover:text-white border-none w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-lg z-10" />
                <CarouselNext className="right-3 bg-black/45 text-white hover:bg-black/60 hover:text-white border-none w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-lg z-10" />
                <CarouselDots className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10" />
              </>
            )}
          </Carousel>
        ) : (
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            No Media Available
          </div>
        )}
      </div>

      {/* Media Count Status Info Bar */}
      <div className="w-full bg-muted/40 border border-border/40 rounded-xl py-2 px-4 flex items-center justify-center text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground gap-3.5">
        <span>{carouselItems.filter((i) => i.type === "image" && i.label !== "Certificate Photo").length} Photos</span>
        <span className="text-border/80">|</span>
        <span>{videoMedia ? "1 Video" : "0 Video"}</span>
        <span className="text-border/80">|</span>
        <span>{certPhoto ? "1 Cert" : "0 Cert"}</span>
      </div>
    </>
  );
}
