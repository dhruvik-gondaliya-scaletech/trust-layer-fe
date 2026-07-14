"use client";

import { Spinner } from "@/components/ui/spinner";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, Lock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WalkthroughOverlay } from "@/components/walkthrough-overlay";
import { FRONTEND_ROUTES } from "@/lib/contants";
import { useAuth } from "@/providers/auth-provider";

import { OnboardingContainer } from "@/features/landing/container/OnboardingContainer";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isInitializing } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isInitializing && isAuthenticated) {
      router.replace(FRONTEND_ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, isInitializing, router, mounted]);

  const isRedirecting = mounted && (isInitializing || isAuthenticated);

  if (isRedirecting) {
    return (
      <div className="mobile-constraint">
        <div className="w-full min-h-dvh bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
          <div className="flex flex-col items-center gap-4">
            <div className="relative flex items-center justify-center">
              <Spinner className="w-10 h-10 text-primary" strokeWidth={2.5} />
            </div>
            <p className="text-sm font-semibold text-muted-foreground animate-pulse">
              Verifying secure session...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <OnboardingContainer />;
}
