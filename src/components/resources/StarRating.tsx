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
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

export function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  interactive = false,
  onRate,
}: StarRatingProps) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxRating }, (_, i) => {
        const filled = i < Math.round(rating);
        return (
          <Star
            key={i}
            className={cn(
              sizeClasses[size],
              filled
                ? "text-[#D4A843]"          /* Nothing warning amber — data status color */
                : "text-muted-foreground/25",
              interactive && "cursor-pointer transition-colors hover:text-[#D4A843]"
            )}
            fill={filled ? "#D4A843" : "none"}
            strokeWidth={filled ? 0 : 1.5}
            onClick={() => interactive && onRate?.(i + 1)}
          />
        );
      })}
    </div>
  );
}
