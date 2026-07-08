"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DECLINE_REASONS = [
  "Need additional photos",
  "Need clearer video",
  "Certification concern",
  "Price concern",
  "Other",
];

interface DeclineModalProps {
  open: boolean;
  declineReason: string;
  setDeclineReason: (reason: string) => void;
  declineMessage: string;
  setDeclineMessage: (message: string) => void;
  isSubmittingDecline: boolean;
  onSubmit: () => void;
  onClose: () => void;
}

export function DeclineModal({
  open,
  declineReason,
  setDeclineReason,
  declineMessage,
  setDeclineMessage,
  isSubmittingDecline,
  onSubmit,
  onClose,
}: DeclineModalProps) {
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
            className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl"
          >
            <div className="p-6 text-left">
              <h2 className="text-xl font-bold text-foreground mb-2">Why are you declining?</h2>
              <p className="text-[13px] text-muted-foreground mb-5 leading-relaxed">
                Tell the seller what needs to be improved.
              </p>

              <div className="space-y-2 mb-5">
                {DECLINE_REASONS.map((reason) => (
                  <label key={reason} className={cn(
                    "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors",
                    declineReason === reason ? "border-primary bg-blue-50/50" : "border-gray-100 bg-gray-50/50 hover:bg-gray-100"
                  )}>
                    <input
                      type="radio"
                      name="declineReason"
                      value={reason}
                      checked={declineReason === reason}
                      onChange={(e) => setDeclineReason(e.target.value)}
                      className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                    />
                    <span className="text-[14px] font-medium text-foreground">{reason}</span>
                  </label>
                ))}
              </div>

              <div className="mb-6">
                <textarea
                  className="w-full border border-gray-200 rounded-xl p-3 text-[14px] resize-none h-24 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
                  placeholder="Provide feedback to seller"
                  value={declineMessage}
                  onChange={(e) => setDeclineMessage(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  className="w-full h-[52px] text-[15px] font-bold rounded-xl bg-primary text-white cursor-pointer"
                  onClick={onSubmit}
                  disabled={!declineReason || isSubmittingDecline}
                >
                  {isSubmittingDecline ? "Sending..." : "Send Feedback"}
                </Button>
                <Button
                  variant="ghost"
                  className="w-full h-[52px] text-[15px] font-bold rounded-xl text-muted-foreground hover:bg-gray-100 cursor-pointer"
                  onClick={onClose}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
