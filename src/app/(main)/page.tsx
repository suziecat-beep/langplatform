"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { useResources } from "@/hooks/useResources";
import { useCollections } from "@/hooks/useCollections";
import { Search, BookOpen, Users, Globe } from "lucide-react";
import Link from "next/link";

const popularLanguages = [
  "japanese", "french", "spanish", "korean", "german", "chinese", "italian", "portuguese",
];

export default function HomePage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { data: recentData } = useResources({ sort: "recent", limit: 6 });
  const { data: topData } = useResources({ sort: "rating", limit: 6 });
  const { data: collectionsData } = useCollections({ limit: 4 });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/resources?search=${encodeURIComponent(search)}`);
    }
  };

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="py-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Every resource for your target language, in one place
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Discover, share, and organize learning resources — textbooks, worksheets,
          audio, video, flashcards, and more — across any language and skill level.
        </p>
        <form onSubmit={handleSearch} className="mx-auto mt-8 flex max-w-md gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {popularLanguages.map((lang) => (
            <Button key={lang} variant="outline" size="sm" asChild className="capitalize">
              <Link href={`/resources?language=${lang}`}>{lang}</Link>
            </Button>
          ))}
        </div>
      </section>

      {/* Recently Added */}
      {recentData?.data?.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Recently Added</h2>
            <Button variant="ghost" asChild>
              <Link href="/resources?sort=recent">View all</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {recentData.data.slice(0, 6).map((resource: any) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </section>
      )}

      {/* Top Rated */}
      {topData?.data?.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Top Rated</h2>
            <Button variant="ghost" asChild>
              <Link href="/resources?sort=rating">View all</Link>

            </Button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {topData.data.slice(0, 6).map((resource: any) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </section>
      )}

      {/* Popular Collections */}
      {collectionsData?.data?.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Popular Collections</h2>
            <Button variant="ghost" asChild>
              <Link href="/collections">View all</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {collectionsData.data.slice(0, 4).map((collection: any) => (
              <Card key={collection.id} className="transition-shadow hover:shadow-md">
                <Link href={`/collections/${collection.id}`}>
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{collection.title}</h3>
                    {collection.description && (
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {collection.description}
                      </p>
                    )}
                    <div className="mt-3 flex items-center gap-2">
                      <Badge variant="secondary" className="capitalize">{collection.language}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {collection._count?.items || 0} resources
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      by {collection.creator?.name}
                    </p>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Stats */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <BookOpen className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">{recentData?.total || 0}+</p>
              <p className="text-sm text-muted-foreground">Resources</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <Globe className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">{popularLanguages.length}+</p>
              <p className="text-sm text-muted-foreground">Languages</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">Growing</p>
              <p className="text-sm text-muted-foreground">Community</p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
