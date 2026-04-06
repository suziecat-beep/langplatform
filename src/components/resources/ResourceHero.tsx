"use client";

import Image from "next/image";
import { FileText, Video, Headphones, BookOpen, Layers, BookMarked, Newspaper } from "lucide-react";

const typeLabels: Record<string, string> = {
  VIDEO: "Video",
  TEXTBOOK: "Textbook",
  AUDIO: "Audio",
  WORKSHEET: "Worksheet",
  ARTICLE: "Article",
  FLASHCARD_DECK: "Flashcards",
  GRADED_READER: "Graded Reader",
};

const typeIcons: Record<string, React.ReactNode> = {
  TEXTBOOK: <BookOpen className="h-10 w-10" strokeWidth={1.25} />,
  WORKSHEET: <FileText className="h-10 w-10" strokeWidth={1.25} />,
  VIDEO: <Video className="h-10 w-10" strokeWidth={1.25} />,
  AUDIO: <Headphones className="h-10 w-10" strokeWidth={1.25} />,
  ARTICLE: <Newspaper className="h-10 w-10" strokeWidth={1.25} />,
  FLASHCARD_DECK: <Layers className="h-10 w-10" strokeWidth={1.25} />,
  GRADED_READER: <BookMarked className="h-10 w-10" strokeWidth={1.25} />,
};

interface ResourceHeroProps {
  title: string;
  thumbnailUrl?: string | null;
  resourceType: string;
}

export function ResourceHero({ title, thumbnailUrl, resourceType }: ResourceHeroProps) {
  return (
    <div className="relative h-56 w-full overflow-hidden rounded-xl border border-border md:h-72">
      {thumbnailUrl ? (
        <>
          <Image src={thumbnailUrl} alt={title} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          {/* Type label over image */}
          <span className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-label text-white/70">
            {typeLabels[resourceType] ?? resourceType}
          </span>
          <h1 className="absolute bottom-5 left-5 right-5 font-sans text-2xl font-bold leading-tight text-white md:text-3xl">
            {title}
          </h1>
        </>
      ) : (
        <div
          className="flex h-full w-full flex-col items-center justify-center gap-3 text-muted-foreground"
          style={{
            backgroundImage: "radial-gradient(circle, #CCCCCC 0.5px, transparent 0.5px)",
            backgroundSize: "12px 12px",
          }}
        >
          {typeIcons[resourceType] ?? <FileText className="h-10 w-10" strokeWidth={1.25} />}
          <div className="text-center">
            <p className="font-mono text-[10px] uppercase tracking-label text-muted-foreground mb-1">
              {typeLabels[resourceType] ?? "Resource"}
            </p>
            <h1 className="px-8 font-sans text-lg font-medium text-foreground md:text-xl">
              {title}
            </h1>
          </div>
        </div>
      )}
    </div>
  );
}
