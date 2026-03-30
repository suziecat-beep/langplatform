"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onRate?: (rating: number) => void;
}

const sizeClasses = {
  sm: "h-3.5 w-3.5",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

export function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  interactive = false,
  onRate,
}: StarRatingProps) {
  return (
    <div className="flex items-center">
      {Array.from({ length: maxRating }, (_, i) => {
        const filled = i < Math.round(rating);
        return (
          <Star
            key={i}
            className={cn(
              sizeClasses[size],
              filled ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30",
              interactive && "cursor-pointer transition-colors hover:text-yellow-400"
            )}
            onClick={() => interactive && onRate?.(i + 1)}
          />
        );
      })}
    </div>
  );
}
