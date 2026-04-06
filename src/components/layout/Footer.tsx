import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-8 md:flex-row md:items-center">
        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-foreground">
            LangPlatform
          </span>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-label text-muted-foreground">
            Language Learning Resources
          </p>
        </div>

        <nav className="flex items-center gap-8">
          {[
            { href: "/resources", label: "Browse" },
            { href: "/collections", label: "Collections" },
            { href: "/media", label: "Media" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-[10px] uppercase tracking-label text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="font-mono text-[10px] uppercase tracking-label text-muted-foreground">
          &copy; {new Date().getFullYear()} LangPlatform
        </p>
      </div>
    </footer>
  );
}
