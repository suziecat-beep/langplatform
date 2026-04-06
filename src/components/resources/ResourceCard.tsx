"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { StarRating } from "./StarRating";
import { Bookmark, FileText, Video, Headphones, BookOpen, Layers, BookMarked, Newspaper } from "lucide-react";
import type { ResourceWithContributor } from "@/types";

const typeIcons: Record<string, React.ReactNode> = {
  TEXTBOOK: <BookOpen className="h-7 w-7" strokeWidth={1.25} />,
  WORKSHEET: <FileText className="h-7 w-7" strokeWidth={1.25} />,
  VIDEO: <Video className="h-7 w-7" strokeWidth={1.25} />,
  AUDIO: <Headphones className="h-7 w-7" strokeWidth={1.25} />,
  ARTICLE: <Newspaper className="h-7 w-7" strokeWidth={1.25} />,
  FLASHCARD_DECK: <Layers className="h-7 w-7" strokeWidth={1.25} />,
  GRADED_READER: <BookMarked className="h-7 w-7" strokeWidth={1.25} />,
};

const typeLabels: Record<string, string> = {
  VIDEO: "Video",
  TEXTBOOK: "Textbook",
  AUDIO: "Audio",
  WORKSHEET: "Worksheet",
  ARTICLE: "Article",
  FLASHCARD_DECK: "Flashcards",
  GRADED_READER: "Graded Reader",
};

/* Data status colors for proficiency level — color on value, not background */
const levelColors: Record<string, string> = {
  A1: "#4A9E5C",
  A2: "#4A9E5C",
  B1: "#D4A843",
  B2: "#D4A843",
  C1: "#D71921",
  C2: "#D71921",
};

interface ResourceCardProps {
  resource: ResourceWithContributor;
  onBookmark?: (id: string) => void;
}

export function ResourceCard({ resource, onBookmark }: ResourceCardProps) {
  return (
    <Card className="group relative flex flex-col overflow-hidden transition-colors hover:border-foreground/30">
      <Link href={`/resources/${resource.id}`} className="flex-1">
        {/* Thumbnail / placeholder */}
        <div className="relative flex aspect-video items-center justify-center overflow-hidden bg-secondary">
          {resource.thumbnailUrl ? (
            <Image
              src={resource.thumbnailUrl}
              alt={resource.title}
              fill
              className="object-cover"
            />
          ) : (
            <div
              className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground"
              style={{
                backgroundImage: "radial-gradient(circle, #CCCCCC 0.5px, transparent 0.5px)",
                backgroundSize: "12px 12px",
              }}
            >
              {typeIcons[resource.resourceType] ?? <FileText className="h-7 w-7" strokeWidth={1.25} />}
              <span className="font-mono text-[10px] uppercase tracking-label">
                {typeLabels[resource.resourceType] ?? "Resource"}
              </span>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          {/* Type + level — tertiary layer */}
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-label text-muted-foreground">
              {typeLabels[resource.resourceType] ?? "Resource"}
            </span>
            <span
              className="font-mono text-[10px] uppercase tracking-label font-bold"
              style={{ color: levelColors[resource.proficiencyLevel] ?? "#666666" }}
            >
              {resource.proficiencyLevel}
            </span>
          </div>

          {/* Title — secondary layer */}
          <h3 className="line-clamp-2 text-sm font-medium leading-snug text-foreground">
            {resource.title}
          </h3>

          {/* Language — tertiary */}
          <p className="mt-2 font-mono text-[10px] uppercase tracking-label text-muted-foreground capitalize">
            {resource.language}
          </p>
        </CardContent>
      </Link>

      {/* Footer — rating + contributor */}
      <CardFooter className="flex items-center justify-between border-t border-border px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <StarRating rating={resource.avgRating} size="sm" />
          <span className="font-mono text-[10px] text-muted-foreground">
            ({resource.ratingCount})
          </span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-label text-muted-foreground truncate max-w-[100px]">
          {resource.contributor?.name}
        </span>
      </CardFooter>

      {/* Bookmark — appears on hover */}
      {onBookmark && (
        <button
          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card opacity-0 transition-opacity group-hover:opacity-100 hover:border-foreground"
          onClick={(e) => {
            e.preventDefault();
            onBookmark(resource.id);
          }}
        >
          <Bookmark className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} />
        </button>
      )}
    </Card>
  );
}
