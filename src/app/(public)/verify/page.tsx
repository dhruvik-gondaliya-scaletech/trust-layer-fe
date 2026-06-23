import React, { Suspense } from "react";
import { VerifyContainer } from "@/features/auth/container/VerifyContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Account - TrustLayer",
  description: "Complete your TrustLayer account verification steps.",
};

export default function VerifyPage() {
  return (
    <div className="w-full min-h-screen bg-background flex items-center justify-center p-0 sm:p-4">
      {/* Mobile-first centered card layout */}
      <div className="w-full sm:max-w-[440px] bg-card sm:rounded-[2.5rem] sm:shadow-2xl sm:border sm:border-border/40 overflow-y-auto flex flex-col min-h-screen sm:min-h-[840px] max-h-screen sm:max-h-[840px] relative scrollbar-none">
        <Suspense fallback={
          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
        }>
          <VerifyContainer />
        </Suspense>
      </div>
    </div>
  );
}
