"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  _error,
  reset,
}: {
  _error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <AlertTriangle className="h-16 w-16 text-destructive" />
      <h1 className="mt-4 text-2xl font-bold">Something went wrong</h1>
      <p className="mt-2 text-muted-foreground">An unexpected error occurred</p>
      <Button onClick={reset} className="mt-6">Try again</Button>
    </div>
  );
}
