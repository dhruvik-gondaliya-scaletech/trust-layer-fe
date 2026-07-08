"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { stepVariants } from "@/styles/animation-tokens";
import type { Deal } from "@/types/fund-escrow.types";

interface SuccessStepProps {
  deal: Deal;
  totalAmount: number;
}

export function SuccessStep({ deal, totalAmount }: SuccessStepProps) {
  return (
    <motion.div
      key="step4"
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      className="flex flex-col items-center justify-center py-6 gap-4 text-center max-w-[380px] mx-auto"
    >
      <motion.div
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.2 }}
        className="w-24 h-24 bg-green-50 dark:bg-green-950/30 rounded-full flex items-center justify-center mb-2 shadow-[0_0_40px_rgba(34,197,94,0.25)] relative"
      >
        <div className="absolute inset-0 rounded-full border-4 border-emerald-500 opacity-20 animate-pulse" />
        <ShieldCheck className="w-12 h-12 text-emerald-600 dark:text-emerald-500" />
      </motion.div>

      <div className="space-y-1">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-[28px] font-extrabold tracking-tight text-slate-900 dark:text-slate-50"
        >
          Deal Funded
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="text-[12px] font-mono font-bold text-slate-400"
        >
          {deal.dealNumber}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-[32px] font-black text-slate-900 dark:text-slate-50 tracking-tight my-2 flex items-center justify-center gap-1.5"
      >
        <span>${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        <span className="text-[12px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full uppercase tracking-wider">
          Protected
        </span>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center text-[14px] text-slate-500 dark:text-slate-400 leading-relaxed mb-4 max-w-[340px]"
      >
        The seller has been notified and can begin preparing shipment. You will receive shipping updates once tracking information is uploaded.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="w-full"
      >
        <Card className="w-full bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-[24px] p-5 text-left flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Item</span>
            <div className="flex flex-col items-end text-right">
              <span className="font-bold text-[14px] text-slate-800 dark:text-slate-200">{deal.title}</span>
              {deal.condition && (
                <span className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">{deal.condition}</span>
              )}
            </div>
          </div>

          <div className="h-px bg-slate-100 dark:bg-slate-800" />

          <div className="flex justify-between items-start">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Seller</span>
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[14px] text-slate-800 dark:text-slate-200">
                  {deal.seller?.username ? `@${deal.seller.username}` : "@seller"}
                </span>
                <ShieldCheck className="w-4 h-4 text-primary animate-pulse" />
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">
                <Star size={10} className="fill-amber-500 text-amber-500" />
                <span className="text-amber-600 dark:text-amber-400 font-bold">{deal.trustScore || "4.9"}</span>
                <span>•</span>
                <span>Verified Seller</span>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100 dark:bg-slate-800" />

          <div className="flex justify-between items-center">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Amount Protected</span>
            <span className="font-bold text-[14px] text-slate-900 dark:text-slate-100">
              ${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Status</span>
            <div className="bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-400 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider">
              Awaiting Shipment
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
