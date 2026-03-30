"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StarRating } from "./StarRating";
import { Bookmark, FileText, Video, Headphones, BookOpen, Layers, BookMarked, Newspaper } from "lucide-react";
import type { ResourceWithContributor } from "@/types";

const levelColors: Record<string, string> = {
  A1: "bg-green-100 text-green-800",
  A2: "bg-green-200 text-green-900",
  B1: "bg-yellow-100 text-yellow-800",
  B2: "bg-yellow-200 text-yellow-900",
  C1: "bg-red-100 text-red-800",
  C2: "bg-red-200 text-red-900",
};

const typeIcons: Record<string, React.ReactNode> = {
  TEXTBOOK: <BookOpen className="h-8 w-8" />,
  WORKSHEET: <FileText className="h-8 w-8" />,
  VIDEO: <Video className="h-8 w-8" />,
  AUDIO: <Headphones className="h-8 w-8" />,
  ARTICLE: <Newspaper className="h-8 w-8" />,
  FLASHCARD_DECK: <Layers className="h-8 w-8" />,
  GRADED_READER: <BookMarked className="h-8 w-8" />,
};

interface ResourceCardProps {
  resource: ResourceWithContributor;
  onBookmark?: (id: string) => void;
}

export function ResourceCard({ resource, onBookmark }: ResourceCardProps) {
  return (
    <Card className="group relative flex flex-col overflow-hidden transition-shadow hover:shadow-md">
      <Link href={`/resources/${resource.id}`} className="flex-1">
        <div className="relative flex h-32 items-center justify-center bg-muted/50 text-muted-foreground">
          {resource.thumbnailUrl ? (
            <Image
              src={resource.thumbnailUrl}
              alt={resource.title}
              fill
              className="object-cover"
            />
          ) : (
            typeIcons[resource.resourceType] || <FileText className="h-8 w-8" />
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="line-clamp-2 font-semibold leading-tight">{resource.title}</h3>
          <div className="mt-2 flex flex-wrap gap-1">
            <Badge variant="secondary" className="capitalize">
              {resource.language}
            </Badge>
            <Badge className={levelColors[resource.proficiencyLevel] || ""}>
              {resource.proficiencyLevel}
            </Badge>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {resource.skillTags?.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs capitalize">
                {tag.toLowerCase()}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Link>
      <CardFooter className="flex items-center justify-between border-t p-3">
        <div className="flex items-center space-x-1">
          <StarRating rating={resource.avgRating} size="sm" />
          <span className="text-xs text-muted-foreground">
            ({resource.ratingCount})
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          {resource.contributor?.name}
        </span>
      </CardFooter>
      {onBookmark && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={(e) => {
            e.preventDefault();
            onBookmark(resource.id);
          }}
        >
          <Bookmark className="h-4 w-4" />
        </Button>
      )}
    </Card>
  );
}
