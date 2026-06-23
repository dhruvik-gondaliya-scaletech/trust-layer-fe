import React from "react";
import { Button } from "@/components/ui/button";

interface WalletCardProps {
  availableBalance: string;
  inEscrow: string;
  readyToWithdraw: string;
  onWithdrawClick?: () => void;
  onHistoryClick?: () => void;
}

export const WalletCard: React.FC<WalletCardProps> = ({
  availableBalance,
  inEscrow,
  readyToWithdraw,
  onWithdrawClick,
  onHistoryClick,
}) => {
  return (
    <section className="w-full px-6 flex flex-col gap-3 select-none">
      <h2 className="text-foreground font-bold text-base tracking-tight">
        Wallet
      </h2>

      {/* Royal Blue Gradient Box */}
      <div className="w-full bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-3xl p-6 shadow-lg shadow-blue-500/20 text-white flex flex-col gap-6 relative overflow-hidden">
        {/* Decorative subtle abstract circle shape */}
        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />

        {/* Balance layout */}
        <div className="flex flex-col gap-1.5 z-10">
          <span className="text-[10px] font-extrabold text-blue-100/70 uppercase tracking-widest">
            AVAILABLE BALANCE
          </span>
          <span className="text-3xl font-extrabold tracking-tight text-white leading-none">
            {availableBalance}
          </span>
        </div>

        {/* Escrow and withdraw subdivisions */}
        <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4 z-10">
          <div className="flex flex-col gap-1 border-r border-white/10 pr-2">
            <span className="text-[9px] font-extrabold text-blue-200/60 uppercase tracking-wider">
              IN ESCROW
            </span>
            <span className="text-sm font-extrabold text-white">
              {inEscrow}
            </span>
          </div>

          <div className="flex flex-col gap-1 pl-2">
            <span className="text-[9px] font-extrabold text-blue-200/60 uppercase tracking-wider">
              READY TO WITHDRAW
            </span>
            <span className="text-sm font-extrabold text-white">
              {readyToWithdraw}
            </span>
          </div>
        </div>

        {/* Actions row */}
        <div className="flex items-center gap-3 mt-1 z-10">
          <Button
            onClick={onWithdrawClick}
            size="default"
            className="flex-1 bg-white text-blue-700 hover:bg-white/95 rounded-full h-10 text-xs font-extrabold shadow-sm active:scale-95 transition-all"
          >
            Withdraw
          </Button>

          <Button
            onClick={onHistoryClick}
            variant="outline"
            size="default"
            className="flex-1 bg-transparent border-white/35 text-white hover:bg-white/10 hover:text-white rounded-full h-10 text-xs font-extrabold active:scale-95 transition-all"
          >
            History
          </Button>
        </div>
      </div>
    </section>
  );
};
