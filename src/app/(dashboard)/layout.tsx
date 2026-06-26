"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { FRONTEND_ROUTES, AUTH_STORAGE_KEYS } from "@/lib/contants";
import { Loader2 } from "lucide-react";
import { setStorageItems } from "@/lib/storage";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isInitializing, isAuthenticated } = useAuth();

  useEffect(() => {
    // If initializing is done and user is not authenticated, send to login
    if (!isInitializing && !isAuthenticated) {
      router.replace(FRONTEND_ROUTES.LOGIN);
      return;
    }

    // If authenticated, check user verification details
    if (isAuthenticated && user) {
      const emailVerified = !!user.emailVerifiedAt;
      const phoneVerified = !!user.phoneVerifiedAt;
      const profileComplete = !!user.username;

      if (!emailVerified || !phoneVerified || !profileComplete) {
        // Sync flags to local storage to resume onboarding at correct step
        setStorageItems({
          [AUTH_STORAGE_KEYS.EMAIL_VERIFIED]: String(emailVerified),
          [AUTH_STORAGE_KEYS.PHONE_VERIFIED]: String(phoneVerified),
          [AUTH_STORAGE_KEYS.PROFILE_COMPLETE]: String(profileComplete),
        });

        // Redirect to multi-step verification hub
        router.replace(`${FRONTEND_ROUTES.VERIFY}?email=${encodeURIComponent(user.email)}`);
      }
    }
  }, [user, isInitializing, isAuthenticated, router]);

  // Show a premium loading indicator while checking verification and auth status
  if (isInitializing || !isAuthenticated) {
    return (
      <div className="w-full min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-primary animate-spin" strokeWidth={2.5} />
            <div className="absolute w-2 h-2 bg-primary rounded-full animate-ping" />
          </div>
          <p className="text-sm font-semibold text-muted-foreground animate-pulse">
            Verifying secure session...
          </p>
        </div>
      </div>
    );
  }

  // Double check to prevent layout flashing before redirection takes effect
  if (user) {
    const emailVerified = !!user.emailVerifiedAt;
    const phoneVerified = !!user.phoneVerifiedAt;
    const profileComplete = !!user.username;

    if (!emailVerified || !phoneVerified || !profileComplete) {
      return (
        <div className="w-full min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" strokeWidth={2.5} />
            <p className="text-sm font-semibold text-muted-foreground animate-pulse">
              Redirecting to verification...
            </p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}
