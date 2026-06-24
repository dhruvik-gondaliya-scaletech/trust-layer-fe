import React, { Suspense } from "react";
import { VerifyContainer } from "@/features/auth/container/VerifyContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Account - TrustLayer",
  description: "Complete your TrustLayer account verification steps.",
};

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    }>
      <VerifyContainer />
    </Suspense>
  );
}
