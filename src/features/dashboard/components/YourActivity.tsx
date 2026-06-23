import React from "react";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

interface YourActivityProps {
  sellingActive: number;
  buyingActive: number;
  onSellingClick?: () => void;
  onBuyingClick?: () => void;
}

export const YourActivity: React.FC<YourActivityProps> = ({
  sellingActive,
  buyingActive,
  onSellingClick,
  onBuyingClick,
}) => {
  return (
    <section className="w-full px-6 flex flex-col gap-3 select-none">
      <h2 className="text-foreground font-bold text-base tracking-tight">
        Your Activity
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {/* Selling Card */}
        <div
          onClick={onSellingClick}
          className="flex items-center gap-3 p-4 bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/10 hover:border-blue-500/20 rounded-2xl cursor-pointer active:scale-98 transition-all duration-200"
        >
          {/* Arrow bubble */}
          <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm border border-blue-500/5">
            <ArrowUpRight className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              SELLING
            </span>
            <span className="text-sm font-extrabold text-foreground leading-tight">
              {sellingActive} Active
            </span>
          </div>
        </div>

        {/* Buying Card */}
        <div
          onClick={onBuyingClick}
          className="flex items-center gap-3 p-4 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/10 hover:border-emerald-500/20 rounded-2xl cursor-pointer active:scale-98 transition-all duration-200"
        >
          {/* Arrow bubble */}
          <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm border border-emerald-500/5">
            <ArrowDownLeft className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              BUYING
            </span>
            <span className="text-sm font-extrabold text-foreground leading-tight">
              {buyingActive} Active
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
