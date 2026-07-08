"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FeedbackSuccessModalProps {
  open: boolean;
  onReturnToDashboard: () => void;
}

export function FeedbackSuccessModal({ open, onReturnToDashboard }: FeedbackSuccessModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-white rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl relative"
          >
            <div className="relative p-0 flex flex-col items-center">
              <div className="w-full bg-gradient-to-b from-green-50 via-white to-white pt-12 pb-4 px-8 flex flex-col items-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.15),transparent_60%)]"></div>

                {/* Premium checkmark icon with pulse */}
                <div className="relative mb-6">
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.1 }}
                    className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-[0_10px_40px_rgba(34,197,94,0.4)] relative z-10"
                  >
                    <Check className="w-12 h-12 text-white stroke-[3] drop-shadow-md" />
                  </motion.div>

                  <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20" style={{ animationDuration: "3s" }}></div>
                  <div className="absolute -inset-6 border border-green-500/20 rounded-full animate-pulse" style={{ animationDuration: "2s" }}></div>
                  <div className="absolute -inset-12 border border-green-500/10 rounded-full animate-pulse delay-75" style={{ animationDuration: "2.5s" }}></div>
                </div>

                <h2 className="text-2xl font-extrabold text-gray-900 mb-2 relative z-10 tracking-tight text-center">Feedback sent to the seller</h2>
              </div>

              <div className="px-8 pb-8 pt-4 w-full text-center relative z-10">
                <p className="text-[15px] text-gray-600 mb-8 leading-relaxed">
                  The seller has been notified and can update the deal before sharing it again.
                </p>

                <div className="w-full space-y-3">
                  <Button
                    className="w-full h-[56px] text-[16px] font-bold rounded-2xl bg-gray-900 text-white hover:bg-gray-800 shadow-lg shadow-gray-900/20 transition-all cursor-pointer"
                    onClick={onReturnToDashboard}
                  >
                    Return to Dashboard
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
