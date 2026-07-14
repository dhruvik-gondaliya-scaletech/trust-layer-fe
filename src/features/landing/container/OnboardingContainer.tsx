"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProgressIndicator } from "../components/ProgressIndicator";
import { Step1Illust } from "../components/Step1Illust";
import { Step2Illust } from "../components/Step2Illust";
import { Step3Illust } from "../components/Step3Illust";
import { Step4Illust } from "../components/Step4Illust";
import { Button } from "@/components/ui/button";
import { HowItWorks } from "@/features/auth/components/HowItWorks";
import { Shield } from "lucide-react";
import { fadeIn } from "@/lib/motion";
import { useRouter } from "next/navigation";
import { FRONTEND_ROUTES } from "@/lib/contants";

export const OnboardingContainer: React.FC = () => {
  const router = useRouter();
  const [view, setView] = useState<"landing" | "onboarding">("landing");
  const [currentStep, setCurrentStep] = useState(0);

  const totalSteps = 4;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Completed last step, go to register route
      router.push(FRONTEND_ROUTES.REGISTER);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      // First step "Close" clicked, go back to landing page
      setView("landing");
    }
  };

  const handleSkip = () => {
    router.push(FRONTEND_ROUTES.REGISTER);
  };

  const renderIllustration = () => {
    switch (currentStep) {
      case 0:
        return <Step1Illust />;
      case 1:
        return <Step2Illust />;
      case 2:
        return <Step3Illust />;
      case 3:
        return <Step4Illust />;
      default:
        return null;
    }
  };

  const getStepText = () => {
    switch (currentStep) {
      case 0:
        return {
          title: "You found the deal. We make it safer.",
          description:
            "TrustLayer helps buyers and sellers complete transactions with proof, payment accountability, shipping records, and verified reviews.",
        };
      case 1:
        return {
          title: "Create Deals With Proof",
          description:
            "Upload product details, photos, videos, and supporting proof before sharing a private transaction link.",
        };
      case 2:
        return {
          title: "Funds Stay Protected",
          description:
            "Buyers review the deal before funding. Sellers upload tracking. Both parties monitor transaction progress from one place.",
        };
      case 3:
        return {
          title: "Build Your Reputation",
          description:
            "Verified reviews and completed transactions help buyers and sellers build confidence over time.",
        };
      default:
        return { title: "", description: "" };
    }
  };

  const { title, description } = getStepText();

  return (
    <div className="w-full min-h-dvh bg-background flex items-center justify-center p-0 sm:p-4">
      {/* Mobile-first centered card layout that widens on desktop (lg) */}
      <div className="w-full sm:max-w-[440px] lg:max-w-[960px] bg-card sm:rounded-[2.5rem] sm:shadow-2xl sm:border sm:border-border/40 overflow-y-auto flex flex-col min-h-dvh sm:min-h-[840px] lg:min-h-[680px] max-h-dvh sm:max-h-[840px] lg:max-h-[680px] relative scrollbar-none">
        <AnimatePresence mode="wait">
          {view === "landing" ? (
            <motion.div
              key="landing"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={fadeIn}
              className="flex-1 flex flex-col lg:grid lg:grid-cols-12 h-full"
            >
              {/* Landing Hero Area */}
              <div className="bg-primary pt-12 pb-10 lg:py-12 px-6 rounded-b-[2.5rem] lg:rounded-b-none lg:rounded-l-[2.5rem] text-center flex flex-col items-center justify-center gap-6 shadow-md shadow-primary/10 lg:col-span-5 h-full">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white/10 border border-white/20 rounded-full text-[11px] font-semibold text-white tracking-wide uppercase select-none">
                  <Shield className="w-3.5 h-3.5 text-white/95" />
                  <span>Built for private deals</span>
                </div>

                <div className="flex flex-col gap-3">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight px-2">
                    You found the deal.
                    <br />
                    We make it safe.
                  </h1>
                  <p className="text-xs sm:text-sm text-white/90 leading-relaxed max-w-[280px] sm:max-w-[320px] mx-auto px-1">
                    Met on Marketplace, Instagram, or Discord? Send your transaction through TrustLayer.
                    You make the deal, we protect that deal! Everyone wins.
                  </p>
                </div>

                <div className="w-full flex flex-col gap-3 px-2">
                  <Button
                    onClick={() => router.push(FRONTEND_ROUTES.REGISTER)}
                    size="lg"
                    className="w-full bg-white text-primary hover:bg-white/95 hover:text-primary rounded-2xl h-12 text-sm font-bold shadow-md active:scale-[0.98] transition-all"
                  >
                    Create account &rarr;
                  </Button>
                  <Button
                    onClick={() => {
                      setView("onboarding");
                      setCurrentStep(0);
                    }}
                    variant="outline"
                    size="lg"
                    className="w-full bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white rounded-2xl h-12 text-sm font-bold active:scale-[0.98] transition-all"
                  >
                    How it works
                  </Button>
                </div>
              </div>

              {/* Steps List */}
              <div className="bg-card flex-1 lg:col-span-7 overflow-y-auto flex flex-col justify-center py-6">
                <HowItWorks />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="onboarding"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={fadeIn}
              className="flex-1 flex flex-col lg:grid lg:grid-cols-12 min-h-dvh sm:min-h-[840px] lg:min-h-[680px] lg:max-h-[680px] justify-between relative h-full w-full"
            >
              {/* On Desktop: Left visual panel */}
              <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-primary to-[color-mix(in_srgb,var(--primary)_70%,black)] rounded-l-[2.5rem] flex-col justify-between p-8 text-primary-foreground relative overflow-hidden select-none">
                {/* Decorative background blurs */}
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/10 blur-2xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-24 h-24 rounded-full bg-white/10 blur-2xl pointer-events-none" />

                {/* Top logo */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/15 border border-white/25">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-extrabold text-[15px] tracking-tight text-white">TrustLayer</span>
                </div>

                {/* Central illustration */}
                <div className="flex-1 flex items-center justify-center py-6 w-full max-w-[280px] mx-auto">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={fadeIn}
                      className="w-full flex justify-center"
                    >
                      {renderIllustration()}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Bottom Step Indicator */}
                <div className="flex justify-center pb-2">
                  <ProgressIndicator totalSteps={totalSteps} currentStep={currentStep} dark={true} />
                </div>
              </div>

              {/* Main content area */}
              <div className="flex-1 flex flex-col justify-between lg:col-span-7 h-full">
                {/* Header Bar */}
                <div className="flex items-center justify-between px-6 py-5 select-none z-20">
                  <Button
                    variant="link"
                    size="sm"
                    onClick={handleBack}
                    className="text-foreground/80 hover:text-foreground font-semibold px-0 text-sm no-underline hover:no-underline"
                  >
                    {currentStep === 0 ? "Close" : "Back"}
                  </Button>

                  {/* Progress indicator is only shown here on mobile (< lg) */}
                  <div className="lg:hidden">
                    <ProgressIndicator totalSteps={totalSteps} currentStep={currentStep} />
                  </div>

                  {currentStep < totalSteps - 1 ? (
                    <Button
                      variant="link"
                      size="sm"
                      onClick={handleSkip}
                      className="text-foreground/80 hover:text-foreground font-semibold px-0 text-sm no-underline hover:no-underline"
                    >
                      Skip
                    </Button>
                  ) : (
                    <div className="w-9" /> /* Flex spacer to balance layout */
                  )}
                </div>

                {/* Content Body */}
                <div className="flex-1 flex flex-col justify-between px-6 pb-8 pt-4">
                  {/* On Mobile: central illustration shown inside main flow */}
                  <div className="lg:hidden w-full max-w-[340px] mx-auto">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentStep}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={fadeIn}
                        className="w-full"
                      >
                        {renderIllustration()}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Text Copy Area */}
                  <div className="text-center px-2 flex flex-col gap-4 justify-center flex-1 my-auto">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                        className="flex flex-col gap-3"
                      >
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground leading-tight tracking-tight">
                          {title}
                        </h1>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
                          {description}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Action Button at bottom */}
                  <div className="mt-8 lg:mt-0">
                    {currentStep < totalSteps - 1 ? (
                      <Button
                        onClick={handleNext}
                        size="lg"
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/95 shadow-md shadow-primary/10 rounded-2xl h-12 text-sm font-bold active:scale-[0.98] transition-all"
                      >
                        Continue
                      </Button>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <Button
                          onClick={() => router.push(FRONTEND_ROUTES.REGISTER)}
                          size="lg"
                          className="w-full bg-primary text-primary-foreground hover:bg-primary/95 shadow-md shadow-primary/10 rounded-2xl h-12 text-sm font-bold active:scale-[0.98] transition-all"
                        >
                          Create Account
                        </Button>
                        <Button
                          onClick={() => router.push(FRONTEND_ROUTES.LOGIN)}
                          variant="outline"
                          size="lg"
                          className="w-full bg-transparent border-border/80 text-foreground hover:bg-muted rounded-2xl h-12 text-sm font-bold active:scale-[0.98] transition-all"
                        >
                          Sign In
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

