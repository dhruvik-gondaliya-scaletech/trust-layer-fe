"use client";

import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";
import { RegisterContainer } from "@/features/auth/container/RegisterContainer";
import { PublicLayoutContainer } from "@/features/auth/container/PublicLayoutContainer";

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center min-h-dvh">
        <Spinner className="w-8 h-8 text-primary" />
      </div>
    }>
      <PublicLayoutContainer>
        <RegisterContainer />
      </PublicLayoutContainer>
    </Suspense>
  );
}

