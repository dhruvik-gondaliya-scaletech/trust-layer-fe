"use client";

import React, { useState, useEffect } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ShareableDealLinkProps {
  dealNumber: string;
  className?: string;
}

export function ShareableDealLink({ dealNumber, className }: ShareableDealLinkProps) {
  const [copied, setCopied] = useState(false);
  const [host, setHost] = useState("trustlayer.com");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHost(window.location.host);
    }
  }, []);

  const shareableUrl = typeof window !== "undefined"
    ? `${window.location.origin}/deal/${dealNumber}`
    : `https://trustlayer.com/deal/${dealNumber}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareableUrl);
      setCopied(true);
      toast.success("Deal invitation link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link.");
    }
  };

  return (
    <div className={cn("w-full bg-muted/30 border border-border/50 rounded-[28px] p-5 text-left", className)}>
      <span className="text-[10px] font-extrabold text-muted-foreground/90 uppercase tracking-widest block mb-2.5 pl-1">
        Shareable Link
      </span>
      <div className="relative flex items-center bg-background border border-border/80 rounded-2xl p-3 pr-14 shadow-xs w-full min-w-0">
        <span className="text-xs font-bold text-foreground/80 truncate select-all pl-1 w-full block min-w-0">
          {host}/deal/{dealNumber}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="absolute right-2.5 w-9 h-9 rounded-full bg-primary hover:bg-primary/95 text-primary-foreground flex items-center justify-center active:scale-95 transition-all shadow-md shadow-primary/20 shrink-0 border-none cursor-pointer"
          title="Copy Link"
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.div
                key="check"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Copy className="w-4 h-4" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );
}
