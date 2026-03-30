"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useReviews(resourceId: string) {
  return useQuery({
    queryKey: ["reviews", resourceId],
    queryFn: async () => {
      const res = await fetch(`/api/resources/${resourceId}/reviews`);
      if (!res.ok) throw new Error("Failed to fetch reviews");
      return res.json();
    },
    enabled: !!resourceId,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ resourceId, ...data }: { resourceId: string; rating: number; comment?: string }) => {
      const res = await fetch(`/api/resources/${resourceId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create review");
      }
      return res.json();
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", vars.resourceId] });
      queryClient.invalidateQueries({ queryKey: ["resource", vars.resourceId] });
    },
  });
}

export function useVoteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ reviewId }: { reviewId: string; resourceId: string }) => {
      const res = await fetch(`/api/reviews/${reviewId}/vote`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to vote");
      return res.json();
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", vars.resourceId] });
    },
  });
}
