"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useBookmarks(status?: string) {
  return useQuery({
    queryKey: ["bookmarks", status],
    queryFn: async () => {
      const params = status ? `?status=${status}` : "";
      const res = await fetch(`/api/bookmarks${params}`);
      if (!res.ok) throw new Error("Failed to fetch bookmarks");
      return res.json();
    },
  });
}

export function useCreateBookmark() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (resourceId: string) => {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resourceId }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to bookmark");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });
}

export function useUpdateBookmark() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string; status?: string; notes?: string }) => {
      const res = await fetch(`/api/bookmarks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update bookmark");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });
}

export function useDeleteBookmark() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/bookmarks/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete bookmark");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });
}
