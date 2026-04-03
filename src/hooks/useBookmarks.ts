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

export function useBookmarkStatus(resourceId: string) {
  return useQuery({
    queryKey: ["bookmarkStatus", resourceId],
    queryFn: async () => {
      const res = await fetch(`/api/bookmarks?resourceId=${resourceId}`);
      if (!res.ok) return { bookmarked: false, bookmarkId: null };
      const data = await res.json();
      const bookmark = data.data?.[0];
      return { bookmarked: !!bookmark, bookmarkId: bookmark?.id || null };
    },
    enabled: !!resourceId,
  });
}

export function useToggleBookmark() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ resourceId, bookmarkId }: { resourceId: string; bookmarkId: string | null }) => {
      if (bookmarkId) {
        const res = await fetch(`/api/bookmarks/${bookmarkId}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to remove bookmark");
        return { action: "removed" as const };
      } else {
        const res = await fetch("/api/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resourceId }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to bookmark");
        }
        return { action: "added" as const };
      }
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      queryClient.invalidateQueries({ queryKey: ["bookmarkStatus", vars.resourceId] });
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
