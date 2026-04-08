"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { proficiencyLevels, resourceTypes, skillTags } from "@/lib/validations";

const languages = ["japanese", "french", "spanish", "korean", "german", "chinese", "italian", "portuguese"];

export function ResourceFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`/resources?${params.toString()}`);
    },
    [router, searchParams]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentSearch = searchParams.get("search") || "";
      const newSearch = search || "";
      if (currentSearch === newSearch) return;
      const params = new URLSearchParams(searchParams.toString());
      if (newSearch) params.set("search", newSearch);
      else params.delete("search");
      params.delete("page");
      router.push(`/resources?${params.toString()}`);
    }, 400);
    return () => clearTimeout(timer);
  }, [search, searchParams, router]);

  const clearFilters = () => {
    setSearch("");
    router.push("/resources");
  };

  const hasFilters =
    searchParams.get("language") ||
    searchParams.get("proficiencyLevel") ||
    searchParams.get("level") ||
    searchParams.get("resourceType") ||
    searchParams.get("skillTag") ||
    searchParams.get("search") ||
    searchParams.get("sort");

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search resources..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Select
          value={searchParams.get("language") || ""}
          onValueChange={(v) => updateParam("language", v || null)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang} value={lang} className="capitalize">
                {lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={searchParams.get("proficiencyLevel") || searchParams.get("level") || ""}
          onValueChange={(v) => {
            const params = new URLSearchParams(searchParams.toString());
            params.delete("level");
            if (v) { params.set("proficiencyLevel", v); } else { params.delete("proficiencyLevel"); }
            params.delete("page");
            router.push(`/resources?${params.toString()}`);
          }}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            {proficiencyLevels.map((level) => (
              <SelectItem key={level} value={level}>{level}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={searchParams.get("resourceType") || ""}
          onValueChange={(v) => updateParam("resourceType", v || null)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            {resourceTypes.map((type) => (
              <SelectItem key={type} value={type} className="capitalize">
                {type.toLowerCase().replace("_", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={searchParams.get("skillTag") || ""}
          onValueChange={(v) => updateParam("skillTag", v || null)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Skill" />
          </SelectTrigger>
          <SelectContent>
            {skillTags.map((tag) => (
              <SelectItem key={tag} value={tag} className="capitalize">
                {tag.toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={searchParams.get("sort") || ""}
          onValueChange={(v) => updateParam("sort", v || null)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="mr-1 h-4 w-4" /> Clear
          </Button>
        )}
      </div>
    </div>
  );
}
