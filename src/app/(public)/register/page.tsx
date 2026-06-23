import React from "react";
import { RegisterContainer } from "@/features/auth/container/RegisterContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account - TrustLayer",
  description: "Create your TrustLayer account to start trusted transactions.",
};

export default function RegisterPage() {
  return (
    <div className="w-full min-h-screen bg-background flex items-center justify-center p-0 sm:p-4">
      {/* Mobile-first centered card layout */}
      <div className="w-full sm:max-w-[440px] bg-card sm:rounded-[2.5rem] sm:shadow-2xl sm:border sm:border-border/40 overflow-y-auto flex flex-col min-h-screen sm:min-h-[840px] max-h-screen sm:max-h-[840px] relative scrollbar-none">
        <RegisterContainer />
      </div>
    </div>
  );
}
