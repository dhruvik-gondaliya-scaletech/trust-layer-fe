"use client";

import Image from "next/image";

interface TrustScoreCardProps {
  seller?: {
    username: string | null;
    firstName?: string | null;
    profilePhotoUrl?: string | null;
  };
  trustScore: number;
  tier: string;
}

export function TrustScoreCard({ seller, trustScore, tier }: TrustScoreCardProps) {
  return (
    <div className="w-full bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-3xl p-5 shadow-sm text-white flex flex-col gap-3.5 relative overflow-hidden">
      <div className="absolute -right-6 -top-6 w-20 h-20 bg-white/5 rounded-full pointer-events-none" />

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          {seller?.profilePhotoUrl ? (
            <Image
              src={seller.profilePhotoUrl}
              alt="Seller Profile"
              width={40}
              height={40}
              className="rounded-full border border-white/20 object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-bold text-sm">
              {seller?.firstName?.[0]?.toUpperCase() || "S"}
            </div>
          )}
          <div className="flex flex-col text-left">
            <span className="text-xs font-medium text-blue-100/75">Verified Seller</span>
            <span className="text-sm font-extrabold tracking-tight">
              @{seller?.username || "seller"}
            </span>
          </div>
        </div>

        <div className="flex items-baseline text-white">
          <span className="text-3xl font-extrabold tracking-tight">{trustScore}</span>
          <span className="text-sm font-semibold text-blue-100/60">/100</span>
        </div>
      </div>

      <div className="w-full relative z-10">
        <div className="w-full h-2 bg-blue-950/45 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-700 ease-out"
            style={{ width: `${trustScore}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[9px] font-black text-blue-100/90 tracking-widest uppercase mt-2">
          <span>Tier: {tier}</span>
          <span>Verification Score</span>
        </div>
      </div>
    </div>
  );
}
