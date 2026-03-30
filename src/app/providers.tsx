"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster />
      </QueryClientProvider>
    </SessionProvider>
  );
}
