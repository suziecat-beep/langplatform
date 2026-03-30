"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface MediaFilters {
  language?: string;
  platform?: string;
  proficiencyLevel?: string;
  page?: number;
  limit?: number;
}

export function useMediaLinks(filters: MediaFilters = {}) {
  return useQuery({
    queryKey: ["mediaLinks", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, String(value));
      });
      const res = await fetch(`/api/media?${params}`);
      if (!res.ok) throw new Error("Failed to fetch media links");
      return res.json();
    },
  });
}

export function useCreateMediaLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create media link");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mediaLinks"] });
    },
  });
}

export function useUpvoteMediaLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/media/${id}/upvote`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to upvote");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mediaLinks"] });
    },
  });
}
