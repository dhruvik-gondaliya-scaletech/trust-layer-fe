import React from "react";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TrustScoreHeaderProps {
  score: number;
  nextStepName?: string;
  onViewBreakdownClick?: () => void;
}

export const TrustScoreHeader: React.FC<TrustScoreHeaderProps> = ({
  score,
  nextStepName = "Take Main Photo",
  onViewBreakdownClick,
}) => {
  // Determine level tier name and colors
  let tier = "GETTING STARTED";
  let tierClass = "bg-white/20 text-white border-none";
  if (score >= 20 && score < 40) {
    tier = "LOW";
    tierClass = "bg-red-500/20 text-red-200 border-none";
  } else if (score >= 40 && score < 70) {
    tier = "MEDIUM";
    tierClass = "bg-amber-500/25 text-amber-200 border-none font-extrabold";
  } else if (score >= 70 && score < 100) {
    tier = "GOOD";
    tierClass = "bg-emerald-500/20 text-emerald-200 border-none font-extrabold";
  } else if (score === 100) {
    tier = "EXCELLENT";
    tierClass = "bg-green-500 text-white border-none font-extrabold";
  }

  return (
    <div className="w-full bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-3xl p-6 shadow-md text-white flex flex-col gap-4 relative overflow-hidden">
      {/* Dynamic graphic circles */}
      <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />

      {/* Main Row */}
      <div className="flex items-start justify-between z-10">
        <div className="flex flex-col gap-1">
          <span className="text-lg font-extrabold tracking-tight">Trust Score</span>
          {score > 0 ? (
            <Badge className={`${tierClass} rounded-md text-[9px] font-extrabold py-0.5 px-2 mt-1 uppercase w-max tracking-wider`}>
              {tier}
            </Badge>
          ) : (
            <span className="text-xs text-blue-100/70 font-semibold mt-0.5">Getting Started</span>
          )}
        </div>

        <div className="flex items-baseline text-white">
          <span className="text-4xl font-extrabold tracking-tight">{score}</span>
          <span className="text-lg font-semibold text-blue-100/60">/100</span>
        </div>
      </div>

      {/* Description Text */}
      <p className="text-xs text-blue-100/80 leading-relaxed z-10">
        {score === 0
          ? "Upload proof to increase buyer trust."
          : `Next: ${nextStepName}`}
      </p>

      {/* Progress Bar Container */}
      <div className="w-full flex flex-col gap-3 mt-1 z-10">
        <div className="w-full h-2.5 bg-blue-950/45 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-500 ease-out"
            style={{ width: `${score}%` }}
          />
        </div>

        {score > 0 && (
          <div className="flex justify-between items-center text-[10px] font-extrabold text-blue-200/80 uppercase tracking-wider">
            <span>Next: {nextStepName}</span>
            <button
              onClick={onViewBreakdownClick}
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <span>View Breakdown</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
