"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface ResourceFilters {
  page?: number;
  limit?: number;
  language?: string;
  proficiencyLevel?: string;
  resourceType?: string;
  skillTag?: string;
  sort?: string;
  search?: string;
  contributorId?: string;
}

async function fetchResources(filters: ResourceFilters) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, String(value));
  });
  const res = await fetch(`/api/resources?${params}`);
  if (!res.ok) throw new Error("Failed to fetch resources");
  return res.json();
}

async function fetchResource(id: string) {
  const res = await fetch(`/api/resources/${id}`);
  if (!res.ok) {
    const err = new Error(
      res.status === 404 ? "Resource not found" : "Failed to fetch resource"
    );
    (err as any).status = res.status;
    throw err;
  }
  return res.json();
}

export function useResources(filters: ResourceFilters) {
  return useQuery({
    queryKey: ["resources", filters],
    queryFn: () => fetchResources(filters),
  });
}

export function useResource(id: string) {
  return useQuery({
    queryKey: ["resource", id],
    queryFn: () => fetchResource(id),
    enabled: !!id,
  });
}

export function useCreateResource() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create resource");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    },
  });
}

export function useUploadFile() {
  return useMutation({
    mutationFn: async ({ file }: { file: File }) => {
      // Get presigned URL
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          fileSize: file.size,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to get upload URL");
      }
      const { data } = await res.json();

      // Upload to S3
      await fetch(data.uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      return data.fileUrl;
    },
  });
}
