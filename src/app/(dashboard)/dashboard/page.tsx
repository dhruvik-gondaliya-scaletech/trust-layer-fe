import React from "react";
import { DashboardContainer } from "@/features/dashboard/container/DashboardContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - TrustLayer",
  description: "View and manage your secure deals, wallet balance, and recent activities.",
};

export default function DashboardPage() {
  return (
    <div className="w-full flex-1 flex flex-col min-h-0">
      <DashboardContainer />
    </div>
  );
}
