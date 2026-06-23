"use client";

import React from "react";
import { User, ShieldCheck, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export const Step1Illust: React.FC = () => {
  return (
    <div className="w-full aspect-[4/3] rounded-[2rem] border border-border/80 bg-card p-6 flex items-center justify-around shadow-xs relative overflow-hidden select-none">
      {/* Subtle background graphic */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/[0.02] to-transparent pointer-events-none" />

      {/* Seller */}
      <div className="flex flex-col items-center gap-2.5 z-10">
        <div className="w-12 h-12 rounded-full bg-secondary/80 flex items-center justify-center text-muted-foreground border border-border/60">
          <User className="w-6 h-6 stroke-[1.8]" />
        </div>
        <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
          Seller
        </span>
      </div>

      {/* Arrow 1 */}
      <motion.div
        animate={{ x: [0, 4, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="text-muted-foreground/60 z-10"
      >
        <ArrowRight className="w-5 h-5 stroke-[1.5]" />
      </motion.div>

      {/* TrustLayer Center Shield */}
      <div className="flex flex-col items-center gap-2.5 z-10">
        <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary shadow-sm shadow-primary/5">
          <ShieldCheck className="w-8 h-8 stroke-[1.8]" />
        </div>
        <span className="text-[10px] font-extrabold tracking-widest text-primary uppercase">
          Trustlayer
        </span>
      </div>

      {/* Arrow 2 */}
      <motion.div
        animate={{ x: [0, 4, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 0.5 }}
        className="text-muted-foreground/60 z-10"
      >
        <ArrowRight className="w-5 h-5 stroke-[1.5]" />
      </motion.div>

      {/* Buyer */}
      <div className="flex flex-col items-center gap-2.5 z-10">
        <div className="w-12 h-12 rounded-full bg-secondary/80 flex items-center justify-center text-muted-foreground border border-border/60">
          <User className="w-6 h-6 stroke-[1.8]" />
        </div>
        <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
          Buyer
        </span>
      </div>
    </div>
  );
};
