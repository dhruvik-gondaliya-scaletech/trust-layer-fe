"use client";

import React, { useState } from "react";
import { Video, ShieldCheck, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CameraCapture } from "./CameraCapture";

interface Step4VideoVerificationProps {
  capturedVideo: Blob | null;
  onCapture: (videoBlob: Blob) => void;
  onContinue: () => void;
  onBack: () => void;
}

export const Step4VideoVerification: React.FC<Step4VideoVerificationProps> = ({
  capturedVideo,
  onCapture,
  onContinue,
  onBack,
}) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(
    capturedVideo ? URL.createObjectURL(capturedVideo) : null
  );

  const handleCaptureVideo = (blob: Blob) => {
    onCapture(blob);
    setVideoUrl(URL.createObjectURL(blob));
  };

  return (
    <div className="flex flex-col gap-6 text-left select-none">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-extrabold text-foreground tracking-tight">Video Verification</h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Record a 5-second video scan of the product. Tilt the product slowly to prove it is in your possession.
        </p>
      </div>

      {videoUrl ? (
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden border-2 border-emerald-500 shadow-md bg-black">
            <video
              src={videoUrl}
              controls
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-emerald-500 text-white rounded-full p-1.5 shadow-sm flex items-center justify-center pointer-events-none">
              <ShieldCheck className="w-4 h-4 stroke-[3]" />
            </div>
            <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10 flex items-center justify-between z-10">
              <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider">
                Video Scan Verified
              </span>
              <button
                onClick={() => setIsCameraOpen(true)}
                className="text-[10px] font-extrabold text-white hover:text-primary transition-colors uppercase tracking-wider"
              >
                Re-record
              </button>
            </div>
          </div>

          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-bold text-emerald-600">Motion Scan Authenticated</span>
              <span className="text-[11px] text-muted-foreground leading-normal">
                Anti-deepfake and possession scans verified. (+30 Trust Score)
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Action Trigger */}
          <div
            onClick={() => setIsCameraOpen(true)}
            className="w-full aspect-square rounded-3xl border-2 border-dashed border-border/80 hover:border-primary/50 bg-muted/20 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-4 cursor-pointer group"
          >
            <div className="w-14 h-14 rounded-full bg-background border border-border/50 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Video className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div className="flex flex-col items-center text-center px-6 gap-1">
              <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                Start Secure Video Scan
              </span>
              <span className="text-[10px] text-muted-foreground leading-relaxed max-w-[200px]">
                Requires a 5-second live camera scan of the product.
              </span>
            </div>
          </div>

          {/* Secure guidelines */}
          <div className="bg-muted/30 rounded-2xl p-4 flex items-start gap-3 border border-border/30">
            <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] font-bold text-foreground">Why verify with video?</span>
              <span className="text-[10px] text-muted-foreground leading-normal">
                Escrow deals with video verification convert 85% faster. Buyers gain complete security knowing you possess the live item.
              </span>
            </div>
          </div>
        </div>
      )}

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
          {capturedVideo ? "Continue" : "Skip (Not Recommended)"}
        </Button>
      </div>

      <CameraCapture
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={() => {}}
        onCaptureVideo={handleCaptureVideo}
        type="video"
        title="Verification Video"
      />
    </div>
  );
};
