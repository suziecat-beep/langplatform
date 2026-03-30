"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

const navLinks = [
  { href: "/resources", label: "Browse Resources" },
  { href: "/collections", label: "Collections" },
  { href: "/media", label: "Media Hub" },
  { href: "/dashboard", label: "Dashboard" },
];

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const { data: session } = useSession();

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>LangPlatform</span>
          </SheetTitle>
        </SheetHeader>
        <nav className="mt-6 flex flex-col space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground py-2"
            >
              {link.label}
            </Link>
          ))}
          {session?.user && (session.user as any).role === "ADMIN" && (
            <Link
              href="/admin"
              onClick={onClose}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground py-2"
            >
              Admin Panel
            </Link>
          )}
        </nav>
        <div className="mt-6 flex flex-col space-y-2">
          {session?.user ? (
            <Button variant="outline" onClick={() => { signOut(); onClose(); }}>
              Log out
            </Button>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link href="/login" onClick={onClose}>Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/register" onClick={onClose}>Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
