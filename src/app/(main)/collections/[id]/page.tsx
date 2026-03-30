"use client";

import { useParams, useRouter } from "next/navigation";
import { useCollection, useForkCollection, useRemoveFromCollection } from "@/hooks/useCollections";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { GitFork, Share2, Trash2 } from "lucide-react";
import Link from "next/link";

export default function CollectionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const { data, isLoading } = useCollection(id);
  const forkCollection = useForkCollection();
  const removeItem = useRemoveFromCollection();

  const collection = data?.data;
  const isOwner = user?.id === collection?.creatorId;

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
    </div>
  );
}
