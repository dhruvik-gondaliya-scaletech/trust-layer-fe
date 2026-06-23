"use client";

import React from "react";
import { User, Star, ShieldAlert } from "lucide-react";

export const Step4Illust: React.FC = () => {
  return (
    <div className="w-full aspect-[4/3] rounded-[2rem] border border-border/80 bg-card p-6 flex flex-col justify-between shadow-xs select-none relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-[0.01] to-transparent pointer-events-none" />

      {/* Profile Header Row */}
      <div className="flex items-center gap-3">
        {/* Avatar circle */}
        <div className="w-12 h-12 rounded-full bg-secondary/80 flex items-center justify-center text-muted-foreground border border-border/60">
          <User className="w-6 h-6 stroke-[1.8]" />
        </div>

        {/* User Info & Badge */}
        <div className="flex flex-col gap-1.5 text-left">
          <span className="text-[15px] font-extrabold text-foreground leading-none">
            Alex M.
          </span>
          <div className="flex items-center gap-1 text-[9px] font-extrabold text-emerald-500 uppercase tracking-wider">
            <svg
              className="w-3.5 h-3.5 fill-current"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M6.267 3.455a.75.75 0 00-.708-.523H4.5a2.5 2.5 0 00-2.5 2.5v1.847a.75.75 0 00.322.617l6.5 4.5a.75.75 0 00.856 0l6.5-4.5a.75.75 0 00.322-.617V5.432a2.5 2.5 0 00-2.5-2.5h-1.06a.75.75 0 00-.707.523l-.707 2.122a1.5 1.5 0 01-1.414 1.029H9.72a1.5 1.5 0 01-1.414-1.03l-.707-2.121zM10 16a6 6 0 100-12 6 6 0 000 12zM9.43 7.823a.5.5 0 00-.86.5l1 1.732a.5.5 0 00.73.18l2.5-1.5a.5.5 0 00-.51-.86l-2.07 1.242-.8-1.385z"
                clipRule="evenodd"
              />
            </svg>
            Verified Identity
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-4 border-t border-border/60 pt-4 text-left">
        {/* Reviews */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
            Reviews
          </span>
          <div className="flex items-center gap-1 text-[13px] font-bold text-foreground">
            <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
            5.0 <span className="text-muted-foreground font-semibold">(24)</span>
          </div>
        </div>

        {/* Transactions */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
            Transactions
          </span>
          <span className="text-[13px] font-bold text-foreground">
            32 Completed
          </span>
        </div>
      </div>
    </div>
  );
};
