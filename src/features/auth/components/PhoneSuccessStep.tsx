"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Smartphone, Check } from "lucide-react";
import { motion } from "framer-motion";
import { BottomActionBar } from "@/components/ui/bottom-action-bar";

interface PhoneSuccessStepProps {
  phoneNumber: string;
  onContinue: () => void;
}

export const PhoneSuccessStep: React.FC<PhoneSuccessStepProps> = ({
  phoneNumber,
  onContinue,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col min-h-screen items-center justify-center relative py-12 px-5 pb-[160px]"
      style={{ background: "radial-gradient(circle at top, #EEF4FF 0%, #FFFFFF 45%)" }}
    >
      <div className="w-full max-w-sm flex flex-col items-center justify-center">
        {/* Hero Animation */}
        <div className="relative w-28 h-28 mb-8 flex items-center justify-center shrink-0">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="56" cy="56" r="52" fill="transparent" stroke="#10B981" strokeWidth="4" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <Smartphone className="w-10 h-10 text-[#10B981]" strokeWidth={2} />
          </div>

          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
            className="absolute bottom-0 right-0 bg-[#10B981] rounded-full p-1.5 border-4 border-white shadow-sm"
          >
            <Check className="w-5 h-5 text-white" strokeWidth={3} />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="text-center w-full"
        >
          <h1 className="text-[28px] font-extrabold text-foreground tracking-tight mb-2">
            Phone Verified
          </h1>
          <p className="text-[16px] text-[#2563EB] font-bold block mb-4">
            {phoneNumber}
          </p>
          <p className="text-[15px] text-muted-foreground leading-relaxed px-2 mb-8">
            Your phone number has been successfully verified and will be used for transaction updates, shipping alerts, and account recovery.
          </p>

          <div className="bg-white border border-gray-100 rounded-2xl p-5 text-left w-full mb-8 shadow-sm">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-green-600" strokeWidth={3} />
                </div>
                <span className="text-[15px] font-bold text-foreground">Email Verified</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-green-600" strokeWidth={3} />
                </div>
                <span className="text-[15px] font-bold text-foreground">Phone Verification</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full border-2 border-gray-200 shrink-0" />
                <span className="text-[15px] font-medium text-gray-500">Profile Setup</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <BottomActionBar>
        <Button onClick={onContinue} className="w-full h-14 text-[16px] font-bold">
          Complete Profile Setup
        </Button>
      </BottomActionBar>
    </motion.div>
  );
};
