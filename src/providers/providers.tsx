"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfettiProvider } from "./confetti-provider";
import { AuthProvider } from "./auth-provider";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {/* AuthProvider must be inside QueryClientProvider — it uses useQueryClient internally */}
      <AuthProvider>
        <ConfettiProvider>
          {children}
        </ConfettiProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
