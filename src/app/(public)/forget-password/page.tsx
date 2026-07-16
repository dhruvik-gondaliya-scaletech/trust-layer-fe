import { Spinner } from "@/components/ui/spinner";
import React, { Suspense } from "react";
import { ForgotPasswordContainer } from "@/features/auth/container/ForgotPasswordContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password - TrustLayer",
  description: "Request a password reset code for your TrustLayer account.",
};

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center min-h-dvh">
        <Spinner className="w-8 h-8 text-primary" />
      </div>
    }>
      <ForgotPasswordContainer />
    </Suspense>
  );
}
