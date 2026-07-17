import React from "react";
import { AuthMarketingSidebar } from "./AuthMarketingSidebar";

interface PublicLayoutPresenterProps {
  children: React.ReactNode;
}

export const PublicLayoutPresenter: React.FC<PublicLayoutPresenterProps> = ({
  children,
}) => {
  return (
    <div className="flex min-h-dvh bg-background">
      {/* Left side: branding/marketing (desktop only) */}
      <AuthMarketingSidebar />

      {/* Right side: form area */}
      <div
        className="flex-1 w-full lg:w-[55%] xl:w-[50%] h-dvh relative bg-background flex flex-col"
        style={{ transform: "translate3d(0, 0, 0)" }}
      >
        <div className="w-full h-full overflow-y-auto flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
};
