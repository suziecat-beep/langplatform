import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileSearch } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <FileSearch className="h-16 w-16 text-muted-foreground" />
      <h1 className="mt-4 text-4xl font-bold">404</h1>
      <p className="mt-2 text-muted-foreground">Page not found</p>
      <Button asChild className="mt-6">
        <Link href="/">Go Home</Link>
      </Button>
    </div>
  );
}
