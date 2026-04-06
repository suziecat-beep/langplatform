"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

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
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[280px] bg-background p-0">
        <SheetHeader className="border-b border-border px-6 py-4">
          <SheetTitle className="text-left">
            <span className="font-mono text-sm font-bold uppercase tracking-widest text-foreground">
              LangPlatform
            </span>
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col px-6 py-6">
          {navLinks.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`border-b border-border py-4 font-mono text-xs uppercase tracking-label transition-colors ${
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {active ? `[ ${link.label} ]` : link.label}
              </Link>
            );
          })}
          {session?.user && (session.user as any).role === "ADMIN" && (
            <Link
              href="/admin"
              onClick={onClose}
              className="border-b border-border py-4 font-mono text-xs uppercase tracking-label text-muted-foreground hover:text-foreground transition-colors"
            >
              Admin
            </Link>
          )}
        </nav>

        <div className="px-6 flex flex-col gap-3">
          {session?.user ? (
            <>
              <p className="font-mono text-[10px] uppercase tracking-label text-muted-foreground">
                {session.user.name}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => { signOut(); onClose(); }}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link href="/login" onClick={onClose}>Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register" onClick={onClose}>Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
