"use client";

import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ResourceEmbedProps {
  embedUrl?: string | null;
}

export function ResourceEmbed({ embedUrl }: ResourceEmbedProps) {
  if (!embedUrl) return null;

  const isYouTube =
    embedUrl.includes("youtube.com") || embedUrl.includes("youtu.be");

  if (isYouTube) {
    const embedSrc = embedUrl
      .replace("watch?v=", "embed/")
      .replace("youtu.be/", "www.youtube.com/embed/");
    return (
      <div className="aspect-video overflow-hidden rounded-xl">
        <iframe
          src={embedSrc}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  // Non-YouTube external link card
  let domain = embedUrl;
  try {
    domain = new URL(embedUrl).hostname.replace(/^www\./, "");
  } catch {
    // fallback to raw URL if invalid
  }

  return (
    <Card className="border-dashed">
      <CardContent className="flex items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
            alt={domain}
            className="h-6 w-6 rounded"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <div>
            <p className="text-sm font-medium">Access this resource</p>
            <p className="text-xs text-muted-foreground">{domain}</p>
          </div>
        </div>
        <Button asChild size="sm">
          <a href={embedUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            Visit
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
