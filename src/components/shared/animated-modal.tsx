"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { motion } from "framer-motion";

export interface AnimatedModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
}

export const AnimatedModal: React.FC<AnimatedModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  closeOnOverlayClick = true,
  closeOnEsc = true,
  showCloseButton = true,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent
        showCloseButton={false}
        onPointerDownOutside={(e) => {
          if (!closeOnOverlayClick) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          if (!closeOnEsc) {
            e.preventDefault();
          }
        }}
        className="w-full max-w-sm overflow-visible bg-transparent border-none shadow-none p-0 focus:outline-none"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            type: "spring",
            damping: 24,
            stiffness: 320,
            mass: 1,
          }}
          className={cn(
            "relative w-full overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-2xl p-6 focus:outline-none",
            className
          )}
        >
          {showCloseButton && (
            <motion.button
              whileHover={{}}
              whileTap={{}}
              onClick={onClose}
              className="absolute top-4 right-4 rounded-full p-2 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors cursor-pointer"
            >
              <X size={15} />
              <span className="sr-only">Close</span>
            </motion.button>
          )}

          {title ? (
            <div className="px-1 pb-3 mb-4 border-b border-slate-50 dark:border-slate-800 text-left pr-10">
              <DialogTitle className="text-lg font-bold text-slate-900 dark:text-slate-50">
                {title}
              </DialogTitle>
            </div>
          ) : (
            <DialogTitle className="sr-only">Modal Dialog</DialogTitle>
          )}

          {/* Content Body */}
          <div className="max-h-[75vh] overflow-y-auto overflow-x-hidden">
            {children}
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
