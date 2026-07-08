import React, { Suspense } from "react";
import { LoginContainer } from "@/features/auth/container/LoginContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In - TrustLayer",
  description: "Sign in to your TrustLayer account to start secure transactions.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center min-h-dvh">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    }>
      <LoginContainer />
    </Suspense>
  );
}
