"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useCollection, useForkCollection, useRemoveFromCollection, useAddToCollection } from "@/hooks/useCollections";
import { useResources } from "@/hooks/useResources";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { GitFork, Share2, Trash2, Plus } from "lucide-react";
import Link from "next/link";

export default function CollectionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const { data, isLoading } = useCollection(id);
  const forkCollection = useForkCollection();
  const removeItem = useRemoveFromCollection();

  const addToCollection = useAddToCollection();
  const [addResourceOpen, setAddResourceOpen] = useState(false);
  const [resourceSearch, setResourceSearch] = useState("");
  const { data: searchData } = useResources({ search: resourceSearch, limit: 10 });

  const collection = data?.data;
  const isOwner = user?.id === collection?.creatorId;
  const existingResourceIds = new Set(collection?.items?.map((item: any) => item.resource.id) || []);

  const handleFork = async () => {
    try {
      const result = await forkCollection.mutateAsync(id);
      toast({ title: "Collection forked!" });
      router.push(`/collections/${result.data.id}`);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: "Link copied to clipboard!" });
  };

  if (isLoading) {
    return <div className="space-y-4"><Skeleton className="h-10 w-2/3" /><Skeleton className="h-6 w-1/3" /><Skeleton className="h-64 w-full" /></div>;
  }

  if (!collection) {
    return <div className="py-12 text-center text-muted-foreground">Collection not found</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{collection.title}</h1>
            {collection.description && (
              <p className="mt-2 text-muted-foreground">{collection.description}</p>
            )}
          </div>
          <div className="flex gap-2">
            {isOwner && (
              <Button variant="outline" onClick={() => setAddResourceOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Resource
              </Button>
            )}
            {collection.visibility === "PUBLIC" && !isOwner && (
              <Button variant="outline" onClick={handleFork} disabled={forkCollection.isPending}>
                <GitFork className="mr-2 h-4 w-4" /> Fork
              </Button>
            )}
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <Badge variant="secondary" className="capitalize">{collection.language}</Badge>
          <Badge variant="outline">{collection.visibility.toLowerCase()}</Badge>
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={collection.creator?.avatarUrl || ""} />
              <AvatarFallback>{collection.creator?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm">{collection.creator?.name}</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {collection._count?.items || collection.items?.length || 0} resources
          </span>
        </div>
      </div>

      {collection.items?.length > 0 ? (
        <div className="space-y-3">
          {collection.items.map((item: any, index: number) => (
            <Card key={item.id}>
              <CardContent className="flex items-center gap-4 p-4">
                <span className="text-lg font-bold text-muted-foreground w-8 text-center">{index + 1}</span>
                <div className="flex-1 min-w-0">
                  <Link href={`/resources/${item.resource.id}`} className="font-medium hover:underline">
                    {item.resource.title}
                  </Link>
                  <div className="mt-1 flex gap-1">
                    <Badge variant="secondary" className="text-xs capitalize">{item.resource.language}</Badge>
                    <Badge variant="outline" className="text-xs">{item.resource.proficiencyLevel}</Badge>
                  </div>
                </div>
                {isOwner && (
                  <Button variant="ghost" size="icon" onClick={() => removeItem.mutate({ collectionId: id, resourceId: item.resource.id })}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-muted-foreground">This collection is empty.</div>
      )}

      {/* Add Resource Dialog */}
      <Dialog open={addResourceOpen} onOpenChange={setAddResourceOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Resource</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Search resources by title..."
            value={resourceSearch}
            onChange={(e) => setResourceSearch(e.target.value)}
            autoFocus
          />
          <div className="mt-2 max-h-80 space-y-2 overflow-y-auto">
            {resourceSearch.length < 2 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">Type at least 2 characters to search.</p>
            ) : searchData?.data?.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">No resources found.</p>
            ) : (
              searchData?.data?.map((resource: any) => {
                const alreadyAdded = existingResourceIds.has(resource.id);
                return (
                  <div key={resource.id} className="flex items-center justify-between rounded border p-3">
                    <div className="flex-1 min-w-0 mr-2">
                      <p className="truncate font-medium text-sm">{resource.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {resource.language} · {resource.proficiencyLevel}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant={alreadyAdded ? "secondary" : "outline"}
                      disabled={alreadyAdded || addToCollection.isPending}
                      onClick={async () => {
                        try {
                          await addToCollection.mutateAsync({ collectionId: id, resourceId: resource.id });
                          toast({ title: `"${resource.title}" added!` });
                        } catch (err: any) {
                          toast({ title: "Error", description: err.message, variant: "destructive" });
                        }
                      }}
                    >
                      {alreadyAdded ? "Added" : "Add"}
                    </Button>
                  </div>
                );
              })
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
