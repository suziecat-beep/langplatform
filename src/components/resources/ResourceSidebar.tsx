"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  TEXTBOOK: <BookOpen className="h-4 w-4" />,
  WORKSHEET: <FileText className="h-4 w-4" />,
  VIDEO: <Video className="h-4 w-4" />,
  AUDIO: <Headphones className="h-4 w-4" />,
  ARTICLE: <Newspaper className="h-4 w-4" />,
  FLASHCARD_DECK: <Layers className="h-4 w-4" />,
  GRADED_READER: <BookMarked className="h-4 w-4" />,
};

const skillIcons: Record<string, React.ReactNode> = {
  READING: <BookOpen className="h-4 w-4" />,
  WRITING: <PenLine className="h-4 w-4" />,
  LISTENING: <Headphones className="h-4 w-4" />,
  SPEAKING: <MessageCircle className="h-4 w-4" />,
  GRAMMAR: <GraduationCap className="h-4 w-4" />,
  VOCABULARY: <BookText className="h-4 w-4" />,
};

const levelColors: Record<string, string> = {
  A1: "bg-green-100 text-green-800",
  A2: "bg-green-200 text-green-900",
  B1: "bg-yellow-100 text-yellow-800",
  B2: "bg-yellow-200 text-yellow-900",
  C1: "bg-red-100 text-red-800",
  C2: "bg-red-200 text-red-900",
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

  return (
    <div className="space-y-4">
      {/* Resource Details */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Resource Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Type</span>
            <span className="flex items-center gap-1.5 font-medium">
              {typeIcons[resource.resourceType]}
              {typeLabels[resource.resourceType] ?? resource.resourceType}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Level</span>
            <Badge className={`${levelColors[resource.proficiencyLevel] || ""} border-0`}>
              {resource.proficiencyLevel}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Language</span>
            <span className="font-medium capitalize">{resource.language}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Rating</span>
            <span className="flex items-center gap-1">
              <StarRating rating={resource.avgRating} size="sm" />
              <span className="text-xs text-muted-foreground">({resource.ratingCount})</span>
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Views</span>
            <span className="font-medium">{resource.downloadCount.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Added</span>
            <span className="font-medium">{addedDate}</span>
          </div>
        </CardContent>
      </Card>

      {/* Skills You&apos;ll Practice */}
      {resource.skillTags.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Skills You&apos;ll Practice
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {resource.skillTags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1.5 px-2 py-1">
                  {skillIcons[tag]}
                  <span className="capitalize">{tag.toLowerCase()}</span>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Card>
        <CardContent className="space-y-2 p-4">
          {(resource.fileUrl || resource.embedUrl) && (
            <Button asChild className="w-full">
              <a href={resource.fileUrl || resource.embedUrl!} target="_blank" rel="noopener noreferrer">
                {resource.fileUrl ? (
                  <><Download className="mr-2 h-4 w-4" />Download</>
                ) : (
                  <><ExternalLink className="mr-2 h-4 w-4" />View Resource</>
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
              <><BookmarkCheck className="mr-2 h-4 w-4" />Bookmarked</>
            ) : (
              <><Bookmark className="mr-2 h-4 w-4" />Bookmark</>
            )}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              if (isAuthenticated) onAddToCollection();
            }}
          >
            <FolderPlus className="mr-2 h-4 w-4" />
            Add to Collection
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
