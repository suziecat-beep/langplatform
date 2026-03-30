"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface CollectionFilters {
  language?: string;
  page?: number;
  limit?: number;
}

export function useCollections(filters: CollectionFilters = {}) {
  return useQuery({
    queryKey: ["collections", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, String(value));
      });
      const res = await fetch(`/api/collections?${params}`);
      if (!res.ok) throw new Error("Failed to fetch collections");
      return res.json();
    },
  });
}

export function useCollection(id: string) {
  return useQuery({
    queryKey: ["collection", id],
    queryFn: async () => {
      const res = await fetch(`/api/collections/${id}`);
      if (!res.ok) throw new Error("Failed to fetch collection");
      return res.json();
    },
    enabled: !!id,
  });
}

export function useCreateCollection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create collection");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
  });
}

export function useForkCollection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (collectionId: string) => {
      const res = await fetch(`/api/collections/${collectionId}/fork`, { method: "POST" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to fork collection");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
  });
}

export function useAddToCollection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ collectionId, resourceId, sortOrder }: { collectionId: string; resourceId: string; sortOrder?: number }) => {
      const res = await fetch(`/api/collections/${collectionId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resourceId, sortOrder }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to add to collection");
      }
      return res.json();
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["collection", vars.collectionId] });
    },
  });
}

export function useRemoveFromCollection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ collectionId, resourceId }: { collectionId: string; resourceId: string }) => {
      const res = await fetch(`/api/collections/${collectionId}/items`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resourceId }),
      });
      if (!res.ok) throw new Error("Failed to remove from collection");
      return res.json();
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["collection", vars.collectionId] });
    },
  });
}
