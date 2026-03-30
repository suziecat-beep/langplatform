import { BookOpen } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 md:flex-row">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-5 w-5" />
          <span className="text-sm font-semibold">LangPlatform</span>
        </div>
        <nav className="flex items-center space-x-4 text-sm text-muted-foreground">
          <Link href="/resources" className="hover:text-foreground">Resources</Link>
          <Link href="/collections" className="hover:text-foreground">Collections</Link>
          <Link href="/media" className="hover:text-foreground">Media Hub</Link>
        </nav>
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} LangPlatform. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
