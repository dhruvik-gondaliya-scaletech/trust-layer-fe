
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { useRole } from "@/providers/role-provider";
import { useUnreadNotificationsCount } from "@/hooks/queries/useNotifications";
import { FRONTEND_ROUTES, AUTH_STORAGE_KEYS } from "@/lib/contants";
import { setStorageItems } from "@/lib/storage";
import { Spinner } from "@/components/ui/spinner";
import { Sidebar } from "@/features/dashboard/components/Sidebar";
import { DesktopHeader } from "@/features/dashboard/components/DesktopHeader";
import { LogoutModal } from "@/features/dashboard/components/LogoutModal";

export function DashboardLayoutContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isInitializing, isAuthenticated, logout } = useAuth();
  const { role, setRole } = useRole();
  const { data: unreadNotificationsCount = 0 } = useUnreadNotificationsCount({
    enabled: isAuthenticated,
  });
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      const redirectUrl = encodeURIComponent(window.location.pathname + window.location.search);
      router.replace(`${FRONTEND_ROUTES.LOGIN}?redirect=${redirectUrl}`);
      return;
    }

    if (isAuthenticated && user) {
      const emailVerified = !!user.emailVerifiedAt;
      const phoneVerified = !!user.phoneVerifiedAt;
      const profileComplete = !!user.username;

      if (!emailVerified || !phoneVerified || !profileComplete) {
        setStorageItems({
          [AUTH_STORAGE_KEYS.EMAIL_VERIFIED]: String(emailVerified),
          [AUTH_STORAGE_KEYS.PHONE_VERIFIED]: String(phoneVerified),
          [AUTH_STORAGE_KEYS.PROFILE_COMPLETE]: String(profileComplete),
        });
        const redirectUrl = encodeURIComponent(window.location.pathname + window.location.search);
        router.replace(`${FRONTEND_ROUTES.VERIFY}?email=${encodeURIComponent(user.email)}&redirect=${redirectUrl}`);
      }
    }
  }, [user, isInitializing, isAuthenticated, router]);

  if (isInitializing || !isAuthenticated) {
    return (
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
    );
  }

  if (user) {
    const emailVerified = !!user.emailVerifiedAt;
    const phoneVerified = !!user.phoneVerifiedAt;
    const profileComplete = !!user.username;

    if (!emailVerified || !phoneVerified || !profileComplete) {
      return (
        <div className="w-full min-h-dvh bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
          <div className="flex flex-col items-center gap-4">
            <Spinner className="w-10 h-10 text-primary" strokeWidth={2.5} />
            <p className="text-sm font-semibold text-muted-foreground animate-pulse">
              Redirecting to verification...
            </p>
          </div>
        </div>
      );
    }
  }

  const handleLogout = () => {
    setIsLogoutModalOpen(false);
    logout();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row text-left">
      {/* Sidebar Layout */}
      <Sidebar user={user} onLogoutTrigger={() => setIsLogoutModalOpen(true)} />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Desktop Header */}
        <DesktopHeader
          pathname={pathname}
          role={role}
          setRole={setRole}
          unreadNotificationsCount={unreadNotificationsCount}
        />

        {/* Content Children */}
        <main className="flex-1 flex flex-col min-h-0">{children}</main>
      </div>

      {/* Logout Dialog */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}
