import React, { Suspense } from "react";
import { RegisterContainer } from "@/features/auth/container/RegisterContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account - TrustLayer",
  description: "Create your TrustLayer account to start trusted transactions.",
};

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center min-h-dvh">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    }>
      <RegisterContainer />
    </Suspense>
  );
}
