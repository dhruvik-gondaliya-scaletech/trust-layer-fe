"use client";

import React from "react";
import { LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AnimatedModal } from "@/components/shared/animated-modal";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <AnimatedModal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center text-center p-4">
        <motion.div
          initial={{ scale: 0.5, rotate: -15, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 15,
            delay: 0.1,
          }}
          className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center text-red-500 dark:text-red-400 mb-5 shadow-sm border border-red-100 dark:border-red-900/30"
        >
          <LogOut size={26} className="text-red-500 dark:text-red-400" />
        </motion.div>

        <motion.h3
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="text-xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight mb-2.5"
        >
          Log Out
        </motion.h3>

        <motion.p
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="text-[14px] text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed"
        >
          Are you sure you want to log out of your TrustLayer account? You will need to sign in again to access your secure deals.
        </motion.p>

        <motion.div
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.3 }}
          className="flex flex-col gap-2 w-full"
        >
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="w-full">
            <Button
              variant="destructive"
              onClick={onConfirm}
              className="w-full h-12 text-[15px] font-bold rounded-2xl bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2 shadow-md shadow-red-500/10 transition-all cursor-pointer focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
            >
              <LogOut size={16} />
              <span>Log Out</span>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="w-full">
            <Button
              variant="ghost"
              onClick={onClose}
              className="w-full h-12 text-[15px] font-bold rounded-2xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/60 transition-all cursor-pointer focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
            >
              Cancel
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </AnimatedModal>
  );
};
