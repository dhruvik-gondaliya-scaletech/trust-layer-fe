"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const items = [
  "Product Details",
  "Photos",
  "Videos",
  "Shipping Terms",
  "Transaction Record",
];

export const Step2Illust: React.FC = () => {
  return (
    <div className="w-full aspect-[4/3] rounded-[2rem] border border-border/80 bg-card p-6 flex flex-col justify-center shadow-xs select-none relative overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/[0.01] to-transparent pointer-events-none" />

      <div className="flex flex-col gap-3.5">
        {items.map((item, idx) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.3 }}
            className="flex items-center gap-3"
          >
            <div className="flex-shrink-0 text-primary">
              <CheckCircle2 className="w-5 h-5 stroke-[2]" />
            </div>
            <span className="text-[14px] font-bold text-foreground/90">
              {item}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
