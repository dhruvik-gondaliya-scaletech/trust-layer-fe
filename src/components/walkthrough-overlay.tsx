"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, CheckCircle2, User, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { FRONTEND_ROUTES } from "@/lib/contants";
import { cn } from "@/lib/utils";

interface WalkthroughOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalkthroughOverlay({ isOpen, onClose }: WalkthroughOverlayProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleCreateAccount = () => {
    onClose();
    router.push(FRONTEND_ROUTES.REGISTER);
  };

  const handleSignIn = () => {
    onClose();
    router.push(FRONTEND_ROUTES.LOGIN);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: "100%", x: "-50%" }}
          animate={{ y: 0, x: "-50%" }}
          exit={{ y: "100%", x: "-50%" }}
          transition={{ type: "spring", bounce: 0, duration: 0.4 }}
          className="fixed inset-y-0 w-full max-w-[430px] left-1/2 z-50 bg-background flex flex-col overflow-hidden"
        >
          {/* Progress Indicator */}
          <div className="absolute top-0 left-0 right-0 p-6 flex items-center z-10 bg-background/80 backdrop-blur-md">
            {/* Left Action: Back or Close */}
            <div className="flex-1 flex justify-start">
              {step > 0 ? (
                <button
                  onClick={prevStep}
                  className="text-[14px] font-bold text-muted-foreground hover:text-foreground transition-colors"
                >
                  Back
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="text-[14px] font-bold text-muted-foreground hover:text-foreground transition-colors"
                >
                  Close
                </button>
              )}
            </div>

            {/* Center: Dots */}
            <div className="flex justify-center gap-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={cn("h-1.5 rounded-full transition-all duration-300", i === step ? "w-8 bg-primary" : "w-2 bg-gray-200")}
                />
              ))}
            </div>

            {/* Right Action: Skip */}
            <div className="flex-1 flex justify-end">
              {step < 3 && (
                <button
                  onClick={handleCreateAccount}
                  className="text-[14px] font-bold text-muted-foreground hover:text-foreground transition-colors"
                >
                  Skip
                </button>
              )}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col justify-end px-6 pb-8 pt-24 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full"
              >
                {/* Screen 1: Welcome */}
                {step === 0 && (
                  <div className="flex flex-col items-center text-center">
                    <div className="w-full h-48 bg-white border border-border rounded-2xl shadow-sm flex items-center justify-center mb-10 p-6">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                            <User className="w-6 h-6 text-gray-400" />
                          </div>
                          <span className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest">
                            Seller
                          </span>
                        </div>

                        <ArrowRight className="w-5 h-5 text-gray-300" />

                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2 border border-primary/20">
                            <Shield className="w-8 h-8 text-primary" />
                          </div>
                          <span className="text-[12px] font-bold text-primary uppercase tracking-widest">
                            TrustLayer
                          </span>
                        </div>

                        <ArrowRight className="w-5 h-5 text-gray-300" />

                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                            <User className="w-6 h-6 text-gray-400" />
                          </div>
                          <span className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest">
                            Buyer
                          </span>
                        </div>
                      </div>
                    </div>

                    <h1 className="text-[32px] font-extrabold mb-4 text-foreground leading-tight tracking-tight">
                      You found the deal.
                      <br />
                      We make it safer.
                    </h1>
                    <p className="text-[16px] text-muted-foreground leading-relaxed">
                      TrustLayer helps buyers and sellers complete transactions with proof, payment accountability, shipping
                      records, and verified reviews.
                    </p>
                  </div>
                )}

                {/* Screen 2: Proof */}
                {step === 1 && (
                  <div className="flex flex-col items-center text-center">
                    <div className="w-full bg-white border border-border rounded-2xl shadow-sm mb-10 p-5 space-y-4">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                        <span className="font-semibold text-[15px]">Product Details</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                        <span className="font-semibold text-[15px]">Photos</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                        <span className="font-semibold text-[15px]">Videos</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                        <span className="font-semibold text-[15px]">Shipping Terms</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                        <span className="font-semibold text-[15px]">Transaction Record</span>
                      </div>
                    </div>

                    <h1 className="text-[32px] font-extrabold mb-4 text-foreground leading-tight tracking-tight">
                      Create Deals With Proof
                    </h1>
                    <p className="text-[16px] text-muted-foreground leading-relaxed">
                      Upload product details, photos, videos, and supporting proof before sharing a private transaction link.
                    </p>
                  </div>
                )}

                {/* Screen 3: Protected */}
                {step === 2 && (
                  <div className="flex flex-col items-center text-center">
                    <div className="w-full bg-white border border-border rounded-2xl shadow-sm mb-10 p-6 flex flex-col items-start text-left max-h-[220px] overflow-hidden relative">
                      <div className="absolute top-0 bottom-0 left-[35px] w-0.5 bg-gray-100" />

                      <div className="flex items-center gap-4 relative z-10 mb-4 bg-white">
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                          <div className="w-2 h-2 rounded-full bg-white" />
                        </div>
                        <span className="font-semibold text-[14px]">Create Deal</span>
                      </div>

                      <div className="flex items-center gap-4 relative z-10 mb-4 bg-white">
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                          <div className="w-2 h-2 rounded-full bg-white" />
                        </div>
                        <span className="font-semibold text-[14px]">Buyer Reviews</span>
                      </div>

                      <div className="flex items-center gap-4 relative z-10 mb-4 bg-white">
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                          <div className="w-2 h-2 rounded-full bg-white" />
                        </div>
                        <span className="font-semibold text-[14px]">Fund Deal</span>
                      </div>

                      <div className="flex items-center gap-4 relative z-10 mb-4 bg-white">
                        <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center shrink-0">
                          <div className="w-2 h-2 rounded-full bg-white" />
                        </div>
                        <span className="font-medium text-[14px] text-muted-foreground">Ship Item</span>
                      </div>

                      <div className="flex items-center gap-4 relative z-10 bg-white">
                        <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center shrink-0">
                          <div className="w-2 h-2 rounded-full bg-white" />
                        </div>
                        <span className="font-medium text-[14px] text-muted-foreground">
                          Confirm Delivery & Reviews
                        </span>
                      </div>
                    </div>

                    <h1 className="text-[32px] font-extrabold mb-4 text-foreground leading-tight tracking-tight">
                      Funds Stay Protected
                    </h1>
                    <p className="text-[16px] text-muted-foreground leading-relaxed">
                      Buyers review the deal before funding. Sellers upload tracking. Both parties monitor transaction
                      progress from one place.
                    </p>
                  </div>
                )}

                {/* Screen 4: Reputation */}
                {step === 3 && (
                  <div className="flex flex-col items-center text-center">
                    <div className="w-full bg-white border border-border rounded-2xl shadow-sm mb-10 p-5 text-left">
                      <div className="flex items-center gap-4 border-b border-gray-100 pb-4 mb-4">
                        <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                          <User className="w-6 h-6 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="font-bold text-[16px]">Alex M.</h3>
                          <div className="flex items-center gap-1 mt-1">
                            <Shield className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-[12px] font-bold text-emerald-500 uppercase tracking-widest">
                              Verified Identity
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                            Reviews
                          </p>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-bold text-[15px]">
                              5.0 <span className="text-muted-foreground font-medium">(24)</span>
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                            Transactions
                          </p>
                          <span className="font-bold text-[15px]">32 Completed</span>
                        </div>
                      </div>
                    </div>

                    <h1 className="text-[32px] font-extrabold mb-4 text-foreground leading-tight tracking-tight">
                      Build Your Reputation
                    </h1>
                    <p className="text-[16px] text-muted-foreground leading-relaxed">
                      Verified reviews and completed transactions help buyers and sellers build confidence over time.
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Bottom Actions */}
            <div className="w-full space-y-3 mt-10">
              {step < 3 ? (
                <Button className="w-full h-14 text-[16px]" onClick={nextStep}>
                  Continue
                </Button>
              ) : (
                <>
                  <Button className="w-full h-14 text-[16px]" onClick={handleCreateAccount}>
                    Create Account
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-14 border-border text-foreground hover:bg-gray-50 text-[16px]"
                    onClick={handleSignIn}
                  >
                    Sign In
                  </Button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
