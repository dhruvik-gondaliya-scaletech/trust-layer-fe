"use client";

import React, { useState } from "react";
import { Camera, Check, ChevronRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CameraCapture } from "./CameraCapture";
import { toast } from "sonner";

interface Step3ProductPhotosProps {
  capturedImages: {
    back: string | null;
    leftSide: string | null;
    rightSide: string | null;
    detail: string | null;
  };
  onCaptureSlot: (slot: "back" | "leftSide" | "rightSide" | "detail", dataUrl: string) => void;
  onContinue: () => void;
  onBack: () => void;
}

const PHOTO_SLOTS = [
  { id: "back", label: "Back View", desc: "Photo of the back of the item" },
  { id: "leftSide", label: "Left Side", desc: "Photo of the left side panel" },
  { id: "rightSide", label: "Right Side", desc: "Photo of the right side panel" },
  { id: "detail", label: "Serial Number / Detail", desc: "Close-up of engraving, serial, or label" },
] as const;

export const Step3ProductPhotos: React.FC<Step3ProductPhotosProps> = ({
  capturedImages,
  onCaptureSlot,
  onContinue,
  onBack,
}) => {
  const [activeSlot, setActiveSlot] = useState<"back" | "leftSide" | "rightSide" | "detail" | null>(null);

  const capturedCount = Object.values(capturedImages).filter(Boolean).length;
  const totalCount = PHOTO_SLOTS.length;
  const isComplete = capturedCount === totalCount;

  return (
    <div className="flex flex-col gap-6 text-left select-none">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-extrabold text-foreground tracking-tight">Additional Photos</h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Provide detailed angles of the product to maximize trust. Tap each slot below to capture.
        </p>
      </div>

      {/* Progress count indicator */}
      <div className="flex justify-between items-center text-xs font-bold text-foreground">
        <span>Captured ({capturedCount}/{totalCount})</span>
        <span className={isComplete ? "text-emerald-500" : "text-primary"}>
          {isComplete ? "All slots completed" : "Recommendation: Complete all slots"}
        </span>
      </div>

      {/* Grid of slots */}
      <div className="grid grid-cols-2 gap-3.5">
        {PHOTO_SLOTS.map((slot) => {
          const image = capturedImages[slot.id];
          return (
            <div
              key={slot.id}
              onClick={() => setActiveSlot(slot.id)}
              className={`aspect-square rounded-2xl border-2 overflow-hidden relative cursor-pointer group flex flex-col items-center justify-center p-3 transition-all ${
                image
                  ? "border-emerald-500/80 bg-background"
                  : "border-dashed border-border/80 hover:border-primary/50 bg-muted/25 hover:bg-primary/5"
              }`}
            >
              {image ? (
                <>
                  <img src={image} alt={slot.label} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                      <RefreshCw className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full p-1 shadow-sm">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-md py-1 px-2 rounded-lg border border-white/10 text-center">
                    <span className="text-[8px] font-extrabold text-white uppercase tracking-wider">
                      {slot.label}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-9 h-9 rounded-full bg-background border border-border/50 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform mb-2">
                    <Camera className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <span className="text-[11px] font-bold text-foreground text-center group-hover:text-primary transition-colors">
                    {slot.label}
                  </span>
                  <span className="text-[9px] text-muted-foreground text-center leading-normal mt-0.5 max-w-[120px]">
                    {slot.desc}
                  </span>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation Actions */}
      <div className="flex gap-3 mt-4">
        <Button
          type="button"
          onClick={onBack}
          variant="outline"
          className="flex-1 border-border/80 rounded-2xl h-12 text-sm font-bold active:scale-[0.98] transition-all"
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={onContinue}
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/95 shadow-md shadow-primary/10 rounded-2xl h-12 text-sm font-bold active:scale-[0.98] transition-all"
        >
          {capturedCount > 0 ? "Continue" : "Skip (Not Recommended)"}
        </Button>
      </div>

      {activeSlot && (
        <CameraCapture
          isOpen={true}
          onClose={() => setActiveSlot(null)}
          onCapture={(dataUrl) => {
            onCaptureSlot(activeSlot, dataUrl);
            setActiveSlot(null);
          }}
          type={activeSlot === "detail" ? "detail" : "back"}
          title={PHOTO_SLOTS.find((s) => s.id === activeSlot)?.label || "Product Photo"}
        />
      )}
    </div>
  );
};
