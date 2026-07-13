"use client";

import React from "react";
import { ChevronRight, Wallet } from "lucide-react";

interface WalletCardProps {
  availableBalance: string;
  inEscrow: string;
  readyToWithdraw: string;
  onWalletClick?: () => void;
}

export const WalletCard: React.FC<WalletCardProps> = ({
  availableBalance,
  inEscrow,
  readyToWithdraw,
  onWalletClick,
}) => {
  return (
    <div
      className="space-y-1 cursor-pointer select-none"
      onClick={onWalletClick}
      role="button"
      aria-label="View wallet details"
    >
      {/* Premium Gradient Card — bg-primary already tracks the active role's color */}
      <div
        className="rounded-[20px] p-5 text-primary-foreground relative overflow-hidden shadow-xl shadow-primary/20 transition-transform duration-150 active:scale-[0.98] bg-gradient-to-br from-primary to-[color-mix(in_srgb,var(--primary)_60%,black)]"
      >
        {/* Decorative background blurs — matching reference */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-24 h-24 rounded-full bg-white/10 blur-2xl pointer-events-none" />

        {/* Ghost wallet icon watermark */}
        <div className="absolute top-0 right-0 p-5 opacity-10 pointer-events-none">
          <Wallet className="h-20 w-20" />
        </div>

        {/* Balance section */}
        <div className="relative z-10">
          <p className="text-[11px] font-semibold tracking-wider uppercase mb-1 text-primary-foreground/80">
            Available Balance
          </p>
          <p className="text-[32px] font-extrabold text-primary-foreground leading-none tracking-tight mb-4">
            {availableBalance}
          </p>

          {/* Sub-stats row */}
          <div className="grid grid-cols-2 gap-4 border-t pt-4 border-primary-foreground/20">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider mb-1 text-primary-foreground/70">
                Funds Secured
              </p>
              <p className="font-bold text-[17px] text-primary-foreground">{inEscrow}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider mb-1 text-primary-foreground/70">
                Ready to Withdraw
              </p>
              <p className="font-bold text-[17px] text-primary-foreground">{readyToWithdraw}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
