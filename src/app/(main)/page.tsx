"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { useResources } from "@/hooks/useResources";
import { useCollections } from "@/hooks/useCollections";
import Link from "next/link";

const popularLanguages = [
  "japanese", "french", "spanish", "korean", "german", "chinese", "italian", "portuguese",
];

export default function HomePage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { data: recentData } = useResources({ sort: "recent", limit: 8 });
  const { data: topData } = useResources({ sort: "rating", limit: 4 });
  const { data: collectionsData } = useCollections({ limit: 4 });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/resources?search=${encodeURIComponent(search)}`);
    }
  };

  return (
    <div className="space-y-20">

      {/* ── Hero ── */}
      <section
        className="relative -mx-4 px-4 py-16 md:py-24"
        style={{
          backgroundImage: "radial-gradient(circle, #CCCCCC 0.5px, transparent 0.5px)",
          backgroundSize: "12px 12px",
        }}
      >
        <div className="relative max-w-3xl">
          {/* Eyebrow */}
          <p className="mb-6 font-mono text-[11px] uppercase tracking-label text-muted-foreground">
            Language Learning Platform
          </p>

          {/* Headline — primary layer */}
          <h1 className="font-sans text-5xl font-bold leading-[1.05] tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Every resource<br />
            for your target<br />
            language.
          </h1>

          {/* Search — underline style */}
          <form
            onSubmit={handleSearch}
            className="mt-10 flex max-w-lg items-end gap-4 border-b border-foreground/30 pb-2"
          >
            <input
              className="flex-1 bg-transparent font-sans text-base text-foreground placeholder-muted-foreground outline-none"
              placeholder="Search resources, languages, levels..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              type="submit"
              className="font-mono text-[11px] uppercase tracking-label text-muted-foreground transition-colors hover:text-foreground"
            >
              Search →
            </button>
          </form>

          {/* Language chips — Space Mono ALL CAPS, border only */}
          <div className="mt-8 flex flex-wrap gap-2">
            {popularLanguages.map((lang) => (
              <Link
                key={lang}
                href={`/resources?language=${lang}`}
                className="rounded-full border border-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-label text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
              >
                {lang}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="grid grid-cols-3 overflow-hidden rounded-xl border border-border">
        {[
          { value: `${recentData?.total ?? 35}+`, label: "Resources" },
          { value: `${popularLanguages.length}+`, label: "Languages" },
          { value: "∞", label: "Community" },
        ].map((stat, i, arr) => (
          <div
            key={stat.label}
            className={`px-6 py-8 ${i < arr.length - 1 ? "border-r border-border" : ""}`}
          >
            {/* Hero number — Doto display font, the one moment of surprise */}
            <p className="font-display text-5xl font-bold tracking-tight text-foreground">
              {stat.value}
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-label text-muted-foreground">
              {stat.label}
            </p>
          </div>
        ))}
      </section>

      {/* ── Recently Added ── */}
      {recentData?.data?.length > 0 && (
        <section>
          <div className="mb-6 flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-label text-muted-foreground">
              Recently Added
            </span>
            <Link
              href="/resources?sort=recent"
              className="font-mono text-[11px] uppercase tracking-label text-muted-foreground transition-colors hover:text-foreground"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {recentData.data.slice(0, 8).map((resource: any) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </section>
      )}

      {/* ── Top Rated + Collections ── two-column asymmetric layout */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">

        {/* Top Rated — narrower */}
        {topData?.data?.length > 0 && (
          <section className="lg:col-span-1">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-label text-muted-foreground">
                Top Rated
              </span>
              <Link
                href="/resources?sort=rating"
                className="font-mono text-[11px] uppercase tracking-label text-muted-foreground transition-colors hover:text-foreground"
              >
                All →
              </Link>
            </div>
            <div className="divide-y divide-border rounded-xl border border-border overflow-hidden">
              {topData.data.slice(0, 4).map((resource: any, i: number) => (
                <Link
                  key={resource.id}
                  href={`/resources/${resource.id}`}
                  className="flex items-start gap-4 bg-card px-4 py-4 transition-colors hover:bg-secondary"
                >
                  <span className="font-display text-2xl font-bold text-muted-foreground/40 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-[10px] uppercase tracking-label text-muted-foreground mb-1">
                      {resource.language} · {resource.proficiencyLevel}
                    </p>
                    <p className="text-sm font-medium text-foreground leading-snug line-clamp-1">
                      {resource.title}
                    </p>
                    <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                      ★ {resource.avgRating?.toFixed(1)} ({resource.ratingCount})
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Popular Collections — wider */}
        {collectionsData?.data?.length > 0 && (
          <section className="lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-label text-muted-foreground">
                Popular Collections
              </span>
              <Link
                href="/collections"
                className="font-mono text-[11px] uppercase tracking-label text-muted-foreground transition-colors hover:text-foreground"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {collectionsData.data.slice(0, 4).map((collection: any) => (
                <Link
                  key={collection.id}
                  href={`/collections/${collection.id}`}
                  className="group block"
                >
                  <Card className="h-full transition-colors hover:border-foreground/30">
                    <CardContent className="p-5">
                      <p className="font-mono text-[10px] uppercase tracking-label text-muted-foreground mb-3">
                        {collection.language} · {collection._count?.items ?? 0} resources
                      </p>
                      <h3 className="text-sm font-medium text-foreground leading-snug">
                        {collection.title}
                      </h3>
                      {collection.description && (
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                          {collection.description}
                        </p>
                      )}
                      <p className="mt-4 font-mono text-[10px] uppercase tracking-label text-muted-foreground">
                        by {collection.creator?.name}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
