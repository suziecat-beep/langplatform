"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { useResource, useResources } from "@/hooks/useResources";
import { useReviews, useCreateReview, useVoteReview } from "@/hooks/useReviews";
import { useBookmarkStatus, useToggleBookmark } from "@/hooks/useBookmarks";
import { useCollections, useAddToCollection } from "@/hooks/useCollections";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StarRating } from "@/components/resources/StarRating";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { ResourceHero } from "@/components/resources/ResourceHero";
import { ResourceEmbed } from "@/components/resources/ResourceEmbed";
import { ResourceSidebar } from "@/components/resources/ResourceSidebar";
import { MarkdownContent } from "@/components/ui/MarkdownContent";
import { useToast } from "@/components/ui/use-toast";
import { ThumbsUp } from "lucide-react";

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
        <Skeleton className="h-64 w-full rounded-xl md:h-72" />
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!resource) {
    return <div className="py-12 text-center text-muted-foreground">Resource not found</div>;
  }

  const hasContent = Boolean(resource.content);
  const defaultTab = hasContent ? "content" : "about";

  return (
    <div className="space-y-8">
      {/* Hero */}
      <ResourceHero
        title={resource.title}
        thumbnailUrl={resource.thumbnailUrl}
        resourceType={resource.resourceType}
      />

      {/* Contributor + rating row */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={resource.contributor?.avatarUrl || ""} />
            <AvatarFallback>{resource.contributor?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">
            by <span className="font-medium text-foreground">{resource.contributor?.name}</span>
          </span>
        </div>
        <div className="flex items-center gap-1">
          <StarRating
            rating={reviews.length > 0 ? reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length : 0}
            size="md"
          />
          <span className="text-sm text-muted-foreground">
            ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
          </span>
        </div>
      </div>

      {/* Embed: YouTube plays inline; other URLs show as link card */}
      <ResourceEmbed embedUrl={resource.embedUrl} />

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main: tabbed content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue={defaultTab}>
            <TabsList className="mb-4">
              {hasContent && <TabsTrigger value="content">Content</TabsTrigger>}
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="reviews">
                Reviews {reviews.length > 0 && `(${reviews.length})`}
              </TabsTrigger>
            </TabsList>

            {/* Content tab */}
            {hasContent && (
              <TabsContent value="content">
                <Card>
                  <CardContent className="p-6">
                    <MarkdownContent content={resource.content} />
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* About tab */}
            <TabsContent value="about">
              <Card>
                <CardHeader>
                  <CardTitle>About This Resource</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                    {resource.description}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reviews tab */}
            <TabsContent value="reviews">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">
                    {reviews.length === 0 ? "No reviews yet" : `${reviews.length} Review${reviews.length !== 1 ? "s" : ""}`}
                  </h2>
                  {isAuthenticated && (
                    <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm">Write a Review</Button>
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
                  <p className="text-sm text-muted-foreground">Be the first to review this resource!</p>
                ) : (
                  reviews.map((review: any) => (
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
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div>
          <ResourceSidebar
            resource={resource}
            isBookmarked={isBookmarked}
            onBookmark={handleBookmark}
            bookmarkPending={toggleBookmark.isPending}
            isAuthenticated={isAuthenticated}
            onAddToCollection={() => {
              if (!isAuthenticated) {
                toast({ title: "Sign in to add to collections", variant: "destructive" });
                return;
              }
              setCollectionOpen(true);
            }}
          />
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

      {/* Related Resources */}
      {relatedData?.data?.filter((r: any) => r.id !== id).length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-bold">Related Resources</h2>
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
