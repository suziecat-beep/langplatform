"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StarRating } from "./StarRating";
import {
  BookOpen,
  FileText,
  Video,
  Headphones,
  Layers,
  BookMarked,
  Newspaper,
  PenLine,
  MessageCircle,
  GraduationCap,
  BookText,
  Download,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  FolderPlus,
} from "lucide-react";

const typeLabels: Record<string, string> = {
  VIDEO: "Video",
  TEXTBOOK: "Textbook",
  AUDIO: "Audio",
  WORKSHEET: "Worksheet",
  ARTICLE: "Article",
  FLASHCARD_DECK: "Flashcard Deck",
  GRADED_READER: "Graded Reader",
};

const typeIcons: Record<string, React.ReactNode> = {
  TEXTBOOK: <BookOpen className="h-4 w-4" strokeWidth={1.5} />,
  WORKSHEET: <FileText className="h-4 w-4" strokeWidth={1.5} />,
  VIDEO: <Video className="h-4 w-4" strokeWidth={1.5} />,
  AUDIO: <Headphones className="h-4 w-4" strokeWidth={1.5} />,
  ARTICLE: <Newspaper className="h-4 w-4" strokeWidth={1.5} />,
  FLASHCARD_DECK: <Layers className="h-4 w-4" strokeWidth={1.5} />,
  GRADED_READER: <BookMarked className="h-4 w-4" strokeWidth={1.5} />,
};

const skillIcons: Record<string, React.ReactNode> = {
  READING: <BookOpen className="h-3.5 w-3.5" strokeWidth={1.5} />,
  WRITING: <PenLine className="h-3.5 w-3.5" strokeWidth={1.5} />,
  LISTENING: <Headphones className="h-3.5 w-3.5" strokeWidth={1.5} />,
  SPEAKING: <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.5} />,
  GRAMMAR: <GraduationCap className="h-3.5 w-3.5" strokeWidth={1.5} />,
  VOCABULARY: <BookText className="h-3.5 w-3.5" strokeWidth={1.5} />,
};

/* Data status colors for proficiency level */
const levelColors: Record<string, string> = {
  A1: "#4A9E5C",
  A2: "#4A9E5C",
  B1: "#D4A843",
  B2: "#D4A843",
  C1: "#D71921",
  C2: "#D71921",
};

interface ResourceSidebarProps {
  resource: {
    resourceType: string;
    proficiencyLevel: string;
    language: string;
    skillTags: string[];
    avgRating: number;
    ratingCount: number;
    downloadCount: number;
    createdAt: string;
    fileUrl?: string | null;
    embedUrl?: string | null;
  };
  isBookmarked: boolean;
  onBookmark: () => void;
  bookmarkPending: boolean;
  isAuthenticated: boolean;
  onAddToCollection: () => void;
}

export function ResourceSidebar({
  resource,
  isBookmarked,
  onBookmark,
  bookmarkPending,
  isAuthenticated,
  onAddToCollection,
}: ResourceSidebarProps) {
  const addedDate = new Date(resource.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const rows = [
    {
      label: "Type",
      value: (
        <span className="flex items-center gap-1.5 text-foreground">
          {typeIcons[resource.resourceType]}
          <span className="font-mono text-[11px] uppercase tracking-label">
            {typeLabels[resource.resourceType] ?? resource.resourceType}
          </span>
        </span>
      ),
    },
    {
      label: "Level",
      value: (
        <span
          className="font-mono text-[11px] uppercase tracking-label font-bold"
          style={{ color: levelColors[resource.proficiencyLevel] ?? "#666666" }}
        >
          {resource.proficiencyLevel}
        </span>
      ),
    },
    {
      label: "Language",
      value: (
        <span className="font-mono text-[11px] uppercase tracking-label text-foreground capitalize">
          {resource.language}
        </span>
      ),
    },
    {
      label: "Rating",
      value: (
        <span className="flex items-center gap-1">
          <StarRating rating={resource.avgRating} size="sm" />
          <span className="font-mono text-[10px] text-muted-foreground">({resource.ratingCount})</span>
        </span>
      ),
    },
    {
      label: "Views",
      value: (
        <span className="font-mono text-[11px] uppercase tracking-label text-foreground">
          {resource.downloadCount.toLocaleString()}
        </span>
      ),
    },
    {
      label: "Added",
      value: (
        <span className="font-mono text-[11px] uppercase tracking-label text-foreground">
          {addedDate}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Resource Details */}
      <Card>
        <CardContent className="p-0">
          {/* Section label */}
          <div className="border-b border-border px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-label text-muted-foreground">
              Resource Details
            </p>
          </div>
          {/* Stat rows */}
          <div className="divide-y divide-border">
            {rows.map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between px-4 py-3">
                <span className="font-mono text-[10px] uppercase tracking-label text-muted-foreground">
                  {label}
                </span>
                {value}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      {resource.skillTags.length > 0 && (
        <Card>
          <CardContent className="p-0">
            <div className="border-b border-border px-4 py-3">
              <p className="font-mono text-[10px] uppercase tracking-label text-muted-foreground">
                Skills You&apos;ll Practice
              </p>
            </div>
            <div className="flex flex-wrap gap-2 p-4">
              {resource.skillTags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1 font-mono text-[10px] uppercase tracking-label text-muted-foreground"
                >
                  {skillIcons[tag]}
                  {tag.toLowerCase()}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="space-y-2">
        {(resource.fileUrl || resource.embedUrl) && (
          <Button asChild className="w-full">
            <a href={resource.fileUrl || resource.embedUrl!} target="_blank" rel="noopener noreferrer">
              {resource.fileUrl ? (
                <><Download className="mr-2 h-4 w-4" strokeWidth={1.5} />Download</>
              ) : (
                <><ExternalLink className="mr-2 h-4 w-4" strokeWidth={1.5} />View Resource</>
              )}
            </a>
          </Button>
        )}
        <Button
          variant={isBookmarked ? "default" : "outline"}
          className="w-full"
          onClick={onBookmark}
          disabled={bookmarkPending}
        >
          {isBookmarked ? (
            <><BookmarkCheck className="mr-2 h-4 w-4" strokeWidth={1.5} />Bookmarked</>
          ) : (
            <><Bookmark className="mr-2 h-4 w-4" strokeWidth={1.5} />Bookmark</>
          )}
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => { if (isAuthenticated) onAddToCollection(); }}
        >
          <FolderPlus className="mr-2 h-4 w-4" strokeWidth={1.5} />
          Add to Collection
        </Button>
      </div>
    </div>
  );
}
