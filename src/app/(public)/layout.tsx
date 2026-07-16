"use client";

import React, { Suspense } from "react";
import { PublicLayoutContainer } from "@/features/auth/container/PublicLayoutContainer";
import { PublicLayoutLoader } from "@/features/auth/components/PublicLayoutLoader";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<PublicLayoutLoader />}>
      <PublicLayoutContainer>{children}</PublicLayoutContainer>
    </Suspense>
  );
}
