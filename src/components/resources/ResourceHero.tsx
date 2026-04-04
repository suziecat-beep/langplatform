"use client";

import Image from "next/image";
import { FileText, Video, Headphones, BookOpen, Layers, BookMarked, Newspaper } from "lucide-react";

const typeColors: Record<string, string> = {
  VIDEO: "bg-blue-100 text-blue-600",
  TEXTBOOK: "bg-green-100 text-green-600",
  AUDIO: "bg-orange-100 text-orange-600",
  WORKSHEET: "bg-purple-100 text-purple-600",
  ARTICLE: "bg-indigo-100 text-indigo-600",
  FLASHCARD_DECK: "bg-pink-100 text-pink-600",
  GRADED_READER: "bg-teal-100 text-teal-600",
};

const typeIcons: Record<string, React.ReactNode> = {
  TEXTBOOK: <BookOpen className="h-12 w-12" />,
  WORKSHEET: <FileText className="h-12 w-12" />,
  VIDEO: <Video className="h-12 w-12" />,
  AUDIO: <Headphones className="h-12 w-12" />,
  ARTICLE: <Newspaper className="h-12 w-12" />,
  FLASHCARD_DECK: <Layers className="h-12 w-12" />,
  GRADED_READER: <BookMarked className="h-12 w-12" />,
};

interface ResourceHeroProps {
  title: string;
  thumbnailUrl?: string | null;
  resourceType: string;
}

export function ResourceHero({ title, thumbnailUrl, resourceType }: ResourceHeroProps) {
  return (
    <div className="relative h-56 w-full overflow-hidden rounded-xl md:h-72">
      {thumbnailUrl ? (
        <>
          <Image src={thumbnailUrl} alt={title} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <h1 className="absolute bottom-4 left-6 right-6 text-2xl font-bold text-white drop-shadow-lg md:text-3xl">
            {title}
          </h1>
        </>
      ) : (
        <div className={`flex h-full w-full flex-col items-center justify-center gap-3 ${typeColors[resourceType] ?? "bg-muted/50 text-muted-foreground"}`}>
          {typeIcons[resourceType] ?? <FileText className="h-12 w-12" />}
          <h1 className="px-6 text-center text-xl font-bold md:text-2xl">{title}</h1>
        </div>
      )}
    </div>
  );
}
