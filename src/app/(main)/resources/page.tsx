"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { ResourceFilters } from "@/components/resources/ResourceFilters";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { useResources } from "@/hooks/useResources";
import { useCreateBookmark } from "@/hooks/useBookmarks";
import { useToast } from "@/components/ui/use-toast";
import { Suspense } from "react";

function ResourcesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const createBookmark = useCreateBookmark();

  const filters = {
    page: parseInt(searchParams.get("page") || "1"),
    language: searchParams.get("language") || undefined,
    proficiencyLevel: searchParams.get("proficiencyLevel") || searchParams.get("level") || undefined,
    resourceType: searchParams.get("resourceType") || undefined,
    skillTag: searchParams.get("skillTag") || undefined,
    sort: searchParams.get("sort") || undefined,
    search: searchParams.get("search") || undefined,
  };

  const { data, isLoading } = useResources(filters);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`/resources?${params.toString()}`);
  };

  const handleBookmark = async (resourceId: string) => {
    try {
      await createBookmark.mutateAsync(resourceId);
      toast({ title: "Bookmarked!" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-6">
        <p className="mb-2 font-mono text-[11px] uppercase tracking-label text-muted-foreground">
          Browse Resources
        </p>
        <h1 className="font-sans text-3xl font-bold tracking-tight text-foreground">
          Find your next resource.
        </h1>
      </div>

      <ResourceFilters />

      {data && !isLoading && (
        <p className="text-sm text-muted-foreground">
          {data.total} resource{data.total !== 1 ? "s" : ""} found
        </p>
      )}

      {isLoading ? (
        <LoadingSkeleton />
      ) : data?.data?.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.data.map((resource: any) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                onBookmark={handleBookmark}
              />
            ))}
          </div>
          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <EmptyState
          title="No resources found"
          description="Try adjusting your filters or search terms"
          action={{ label: "Clear filters", onClick: () => router.push("/resources") }}
        />
      )}
    </div>
  );
}

export default function ResourcesPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <ResourcesContent />
    </Suspense>
  );
}
