"use client";

import React from "react";
import { DashboardLayoutContainer } from "@/features/dashboard/container/DashboardLayoutContainer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayoutContainer>
      {children}
    </DashboardLayoutContainer>
  );
}
