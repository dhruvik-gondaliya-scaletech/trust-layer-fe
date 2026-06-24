"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

export interface TrustScoreBreakdown {
  hasItemDetails: boolean;
  hasMainPhoto: boolean;
  additionalPhotosCount: number;
  hasVideo: boolean;
}

interface TrustScoreHeaderProps {
  score: number;
  nextStepName?: string;
  breakdown?: TrustScoreBreakdown;
}

export const TrustScoreHeader: React.FC<TrustScoreHeaderProps> = ({
  score,
  nextStepName = "Take Main Photo",
  breakdown,
}) => {
  const [showBreakdown, setShowBreakdown] = useState(false);

  let tier = "GETTING STARTED";
  let tierClass = "bg-white/20 text-white border-none";
  if (score >= 1 && score < 60) {
    tier = "LOW";
    tierClass = "bg-red-500/20 text-red-200 border-none";
  } else if (score >= 60 && score < 80) {
    tier = "MEDIUM";
    tierClass = "bg-amber-500/25 text-amber-200 border-none font-extrabold";
  } else if (score >= 80 && score < 100) {
    tier = "HIGH";
    tierClass = "bg-emerald-500/20 text-emerald-200 border-none font-extrabold";
  } else if (score === 100) {
    tier = "EXCELLENT";
    tierClass = "bg-green-500 text-white border-none font-extrabold";
  }

  return (
    <div className="w-full bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-3xl p-5 shadow-md text-white flex flex-col gap-3 relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />

      {/* Main Row */}
      <div className="flex items-start justify-between z-10">
        <div className="flex flex-col gap-1">
          <span className="text-xl font-extrabold tracking-tight">Trust Score</span>
          {score > 0 ? (
            <Badge className={`${tierClass} rounded-md text-[11px] font-extrabold py-0.5 px-2 mt-1 uppercase w-max tracking-wider`}>
              {tier}
            </Badge>
          ) : (
            <span className="text-sm text-blue-100/70 font-semibold mt-0.5">Getting Started</span>
          )}
        </div>

        <div className="flex items-baseline text-white">
          <span className="text-5xl font-extrabold tracking-tight">{score}</span>
          <span className="text-xl font-semibold text-blue-100/60">/100</span>
        </div>
      </div>

      {/* Description Text */}
      <p className="text-sm text-blue-100/80 leading-relaxed z-10">
        {score === 100
          ? "Maximum trust achieved!"
          : score === 0
          ? "Complete steps to increase buyer trust."
          : `Next: ${nextStepName}`}
      </p>

      {/* Progress Bar + Breakdown Toggle */}
      <div className="w-full flex flex-col gap-3 z-10">
        <div className="w-full h-2.5 bg-blue-950/45 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-500 ease-out"
            style={{ width: `${score}%` }}
          />
        </div>

        {breakdown && (
          <button
            onClick={() => setShowBreakdown((prev) => !prev)}
            className="flex items-center justify-between text-xs font-extrabold text-blue-200/80 uppercase tracking-wider hover:text-white transition-colors w-full"
          >
            <span>
              {score === 100
                ? "All steps complete"
                : score > 0
                ? `Next: ${nextStepName}`
                : "Get started"}
            </span>
            <div className="flex items-center gap-1">
              <span>View Breakdown</span>
              {showBreakdown ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </div>
          </button>
        )}
      </div>

      {/* Accordion Breakdown */}
      <AnimatePresence initial={false}>
        {showBreakdown && breakdown && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-2.5 pt-3 border-t border-white/15 z-10 text-xs text-blue-100/90 font-semibold">

              {/* Verified Seller Profile — always earned */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-white/20 border border-white flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>Verified Seller Profile</span>
                </div>
                <span className="text-white font-extrabold">+20 pts</span>
              </div>

              {/* Item Details */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center border shrink-0 ${breakdown.hasItemDetails ? "bg-white/20 border-white" : "border-white/25"}`}>
                    <Check className={`w-2.5 h-2.5 stroke-[3] ${breakdown.hasItemDetails ? "" : "opacity-30"}`} />
                  </div>
                  <span className={breakdown.hasItemDetails ? "" : "opacity-50"}>Item Details</span>
                </div>
                <span className={breakdown.hasItemDetails ? "text-white font-extrabold" : "opacity-40"}>+20 pts</span>
              </div>

              {/* Main Photo */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center border shrink-0 ${breakdown.hasMainPhoto ? "bg-white/20 border-white" : "border-white/25"}`}>
                    <Check className={`w-2.5 h-2.5 stroke-[3] ${breakdown.hasMainPhoto ? "" : "opacity-30"}`} />
                  </div>
                  <span className={breakdown.hasMainPhoto ? "" : "opacity-50"}>Main Photo</span>
                </div>
                <span className={breakdown.hasMainPhoto ? "text-white font-extrabold" : "opacity-40"}>+15 pts</span>
              </div>

              {/* Additional Photos */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center border shrink-0 ${breakdown.additionalPhotosCount > 0 ? "bg-white/20 border-white" : "border-white/25"}`}>
                    <Check className={`w-2.5 h-2.5 stroke-[3] ${breakdown.additionalPhotosCount > 0 ? "" : "opacity-30"}`} />
                  </div>
                  <span className={breakdown.additionalPhotosCount > 0 ? "" : "opacity-50"}>
                    Additional Photos ({breakdown.additionalPhotosCount}/4)
                  </span>
                </div>
                <span className={breakdown.additionalPhotosCount > 0 ? "text-white font-extrabold" : "opacity-40"}>
                  +{Math.round((breakdown.additionalPhotosCount / 4) * 15)} pts
                </span>
              </div>

              {/* Product Video */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center border shrink-0 ${breakdown.hasVideo ? "bg-white/20 border-white" : "border-white/25"}`}>
                    <Check className={`w-2.5 h-2.5 stroke-[3] ${breakdown.hasVideo ? "" : "opacity-30"}`} />
                  </div>
                  <span className={breakdown.hasVideo ? "" : "opacity-50"}>Product Video</span>
                </div>
                <span className={breakdown.hasVideo ? "text-white font-extrabold" : "opacity-40"}>+30 pts</span>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
