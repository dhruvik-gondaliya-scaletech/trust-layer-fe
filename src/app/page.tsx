"use client";

import { Spinner } from "@/components/ui/spinner";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, Lock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WalkthroughOverlay } from "@/components/walkthrough-overlay";
import { FRONTEND_ROUTES } from "@/lib/contants";
import { useAuth } from "@/providers/auth-provider";

export default function Home() {
  const router = useRouter();
  const [showWalkthrough, setShowWalkthrough] = useState(false);
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

  return (
    <div className="mobile-constraint">
      <div className="flex flex-col min-h-dvh bg-[#F8FAFC]">
        {/* Top Blue Hero Section */}
        <div className="bg-primary text-white p-6 pt-12 pb-16 flex flex-col items-center text-center rounded-b-[2rem]">
          <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 mb-6 backdrop-blur-sm">
            <Shield className="w-4 h-4" />
            Built for private deals
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight mb-4 leading-tight">
            You found the deal. We make it safe.
          </h1>

          <p className="text-blue-100 text-[16px] leading-relaxed mb-8 max-w-[320px]">
            Met on Marketplace, Instagram, or Discord? Send your transaction through TrustLayer. You make the deal, we protect that deal! Everyone wins.
          </p>

          <div className="w-full space-y-3 px-2">
            <Button
              className="w-full h-14 bg-white text-primary hover:bg-gray-50 rounded-2xl text-[16px]"
              onClick={() => router.push(FRONTEND_ROUTES.REGISTER)}
            >
              Create account &rarr;
            </Button>
            <Button
              variant="outline"
              className="w-full h-14 border-white text-white hover:bg-white/10 hover:text-white bg-transparent rounded-2xl text-[16px]"
              onClick={() => setShowWalkthrough(true)}
            >
              How it works
            </Button>
          </div>
        </div>

        <WalkthroughOverlay
          isOpen={showWalkthrough}
          onClose={() => setShowWalkthrough(false)}
        />

        {/* How it works section */}
        <div className="p-6 pt-8 flex-1">
          <h2 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest mb-6">
            How it works
          </h2>

          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-border flex gap-4">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-[15px] mb-1">Seller creates the deal</h3>
                <p className="text-muted-foreground text-[14px] leading-snug">
                  Upload proof, set price and shipping. Get a shareable link.
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-border flex gap-4">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-[15px] mb-1">Buyer funds escrow</h3>
                <p className="text-muted-foreground text-[14px] leading-snug">
                  Funds are held by TrustLayer. Seller is cleared to ship.
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-border flex gap-4">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-[15px] mb-1">Buyer confirms receipt</h3>
                <p className="text-muted-foreground text-[14px] leading-snug">
                  Funds release to the seller. Both leave reviews.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
