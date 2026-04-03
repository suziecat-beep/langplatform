"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { useResource, useResources } from "@/hooks/useResources";
import { useReviews, useCreateReview, useVoteReview } from "@/hooks/useReviews";
import { useBookmarkStatus, useToggleBookmark } from "@/hooks/useBookmarks";
import { useCollections, useAddToCollection } from "@/hooks/useCollections";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { StarRating } from "@/components/resources/StarRating";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { useToast } from "@/components/ui/use-toast";
import { BookmarkCheck, Bookmark, Download, ExternalLink, FolderPlus, ThumbsUp } from "lucide-react";

const levelColors: Record<string, string> = {
  A1: "bg-green-100 text-green-800",
  A2: "bg-green-200 text-green-900",
  B1: "bg-yellow-100 text-yellow-800",
  B2: "bg-yellow-200 text-yellow-900",
  C1: "bg-red-100 text-red-800",
  C2: "bg-red-200 text-red-900",
};

export default function ResourceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const { data: resourceData, isLoading } = useResource(id);
  const { data: reviewsData } = useReviews(id);
  const createReview = useCreateReview();
  const voteReview = useVoteReview();
  const { data: bookmarkData } = useBookmarkStatus(id);
  const toggleBookmark = useToggleBookmark();
  const isBookmarked = bookmarkData?.bookmarked || false;
  const { data: collectionsData } = useCollections();
  const addToCollection = useAddToCollection();
  const myCollections = (collectionsData?.data || []).filter((c: any) => c.creatorId === user?.id);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewOpen, setReviewOpen] = useState(false);
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [addedToCollections, setAddedToCollections] = useState<Set<string>>(new Set());

  const resource = resourceData?.data;
  const reviews = reviewsData?.data || [];

  // Related resources
  const { data: relatedData } = useResources({
    language: resource?.language,
    proficiencyLevel: resource?.proficiencyLevel,
    limit: 4,
  });

  const handleSubmitReview = async () => {
    if (reviewRating === 0) return;
    try {
      await createReview.mutateAsync({
        resourceId: id,
        rating: reviewRating,
        comment: reviewComment || undefined,
      });
      toast({ title: "Review submitted!" });
      setReviewOpen(false);
      setReviewRating(0);
      setReviewComment("");
    } catch (err: any) {
      if (err.message?.includes("already reviewed")) {
        setReviewOpen(false);
        toast({ title: "You have already reviewed this resource.", variant: "destructive" });
      } else {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      }
    }
  };

  const handleAddToCollection = async (collectionId: string, collectionTitle: string) => {
    try {
      await addToCollection.mutateAsync({ collectionId, resourceId: id });
      setAddedToCollections((prev) => new Set(prev).add(collectionId));
      toast({ title: `Added to "${collectionTitle}"!` });
    } catch (err: any) {
      if (err.message?.includes("already in collection")) {
        setAddedToCollections((prev) => new Set(prev).add(collectionId));
      }
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      toast({ title: "Sign in to bookmark resources", variant: "destructive" });
      return;
    }
    try {
      const result = await toggleBookmark.mutateAsync({
        resourceId: id,
        bookmarkId: bookmarkData?.bookmarkId || null,
      });
      toast({ title: result.action === "added" ? "Resource bookmarked!" : "Bookmark removed." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!resource) {
    return <div className="py-12 text-center text-muted-foreground">Resource not found</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{resource.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="capitalize">{resource.language}</Badge>
          <Badge className={levelColors[resource.proficiencyLevel] || ""}>{resource.proficiencyLevel}</Badge>
          <Badge variant="outline" className="capitalize">
            {resource.resourceType.toLowerCase().replace("_", " ")}
          </Badge>
          {resource.skillTags?.map((tag: string) => (
            <Badge key={tag} variant="outline" className="text-xs capitalize">{tag.toLowerCase()}</Badge>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={resource.contributor?.avatarUrl || ""} />
              <AvatarFallback>{resource.contributor?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm">{resource.contributor?.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <StarRating rating={reviews.length > 0 ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length : 0} size="md" />
            <span className="text-sm text-muted-foreground">
              ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
            </span>
          </div>
          <span className="text-sm text-muted-foreground">
            <Download className="mr-1 inline h-4 w-4" />{resource.downloadCount} views
          </span>
        </div>

        <div className="mt-4 flex gap-2">
          {(resource.fileUrl || resource.embedUrl) && (
            <Button asChild>
              <a href={resource.fileUrl || resource.embedUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                {resource.fileUrl ? "Download" : "View"}
              </a>
            </Button>
          )}
          <Button variant={isBookmarked ? "default" : "outline"} onClick={handleBookmark} disabled={toggleBookmark.isPending}>
            {isBookmarked ? <BookmarkCheck className="mr-2 h-4 w-4" /> : <Bookmark className="mr-2 h-4 w-4" />}
            {isBookmarked ? "Bookmarked" : "Bookmark"}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              if (!isAuthenticated) {
                toast({ title: "Sign in to add to collections", variant: "destructive" });
                return;
              }
              setCollectionOpen(true);
            }}
          >
            <FolderPlus className="mr-2 h-4 w-4" />
            Add to Collection
          </Button>
        </div>
      </div>

      {/* Add to Collection Dialog */}
      <Dialog open={collectionOpen} onOpenChange={setCollectionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Collection</DialogTitle>
          </DialogHeader>
          {myCollections.length === 0 ? (
            <p className="text-sm text-muted-foreground">You have no collections yet. Create one first.</p>
          ) : (
            <div className="space-y-2">
              {myCollections.map((collection: any) => {
                const isAdded = addedToCollections.has(collection.id);
                return (
                  <div key={collection.id} className="flex items-center justify-between rounded border p-3">
                    <div>
                      <p className="font-medium">{collection.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {collection.language} · {collection._count?.items ?? 0} item{collection._count?.items !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant={isAdded ? "secondary" : "outline"}
                      disabled={isAdded || addToCollection.isPending}
                      onClick={() => handleAddToCollection(collection.id, collection.title)}
                    >
                      {isAdded ? "Added" : "Add"}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Description */}
      <Card>
        <CardHeader><CardTitle>Description</CardTitle></CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{resource.description}</p>
        </CardContent>
      </Card>

      {/* Embed */}
      {resource.embedUrl && resource.embedUrl.includes("youtube") && (
        <div className="aspect-video">
          <iframe
            src={resource.embedUrl.replace("watch?v=", "embed/")}
            className="h-full w-full rounded-lg"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {/* Reviews */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Reviews</h2>
          {isAuthenticated && (
            <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
              <DialogTrigger asChild>
                <Button>Write a Review</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Write a Review</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Rating</p>
                    <StarRating rating={reviewRating} interactive onRate={setReviewRating} />
                  </div>
                  <Textarea
                    placeholder="Share your thoughts (optional)"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={4}
                  />
                  <Button
                    onClick={handleSubmitReview}
                    disabled={reviewRating === 0 || createReview.isPending}
                  >
                    {createReview.isPending ? "Submitting..." : "Submit Review"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {reviews.length === 0 ? (
          <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review: any) => (
              <Card key={review.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={review.user?.avatarUrl || ""} />
                        <AvatarFallback>{review.user?.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{review.user?.name}</p>
                        <StarRating rating={review.rating} size="sm" />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => voteReview.mutate({ reviewId: review.id, resourceId: id })}
                    >
                      <ThumbsUp className="mr-1 h-3 w-3" />
                      {review.helpfulnessVotes}
                    </Button>
                  </div>
                  {review.comment && (
                    <p className="mt-2 text-sm">{review.comment}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Related */}
      {relatedData?.data?.filter((r: any) => r.id !== id).length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Related Resources</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relatedData.data
              .filter((r: any) => r.id !== id)
              .slice(0, 4)
              .map((r: any) => (
                <ResourceCard key={r.id} resource={r} />
              ))}
          </div>
        </section>
      )}
    </div>
  );
}
