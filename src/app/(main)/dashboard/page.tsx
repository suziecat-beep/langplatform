"use client";

import { useAuth } from "@/hooks/useAuth";
import { useBookmarks, useUpdateBookmark, useDeleteBookmark } from "@/hooks/useBookmarks";
import { useCollections } from "@/hooks/useCollections";
import { useResources } from "@/hooks/useResources";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/use-toast";
import { BookOpen, Bookmark, FolderOpen, Upload, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const statusColors: Record<string, string> = {
  TO_STUDY: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-green-100 text-green-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

const nextStatus: Record<string, string> = {
  TO_STUDY: "IN_PROGRESS",
  IN_PROGRESS: "COMPLETED",
  COMPLETED: "TO_STUDY",
};

export default function DashboardPage() {
  const { user, isContributor } = useAuth();
  const { toast } = useToast();
  const [bookmarkFilter, setBookmarkFilter] = useState<string | undefined>(undefined);
  const { data: bookmarksData } = useBookmarks(bookmarkFilter);
  const { data: collectionsData } = useCollections();
  const { data: uploadsData } = useResources({ limit: 50 });
  const updateBookmark = useUpdateBookmark();
  const deleteBookmark = useDeleteBookmark();

  const bookmarks = bookmarksData?.data || [];
  const collections = collectionsData?.data?.filter((c: any) => c.creatorId === user?.id) || [];

  const totalBookmarks = bookmarks.length;
  const inProgress = bookmarks.filter((b: any) => b.status === "IN_PROGRESS").length;
  const completed = bookmarks.filter((b: any) => b.status === "COMPLETED").length;

  const handleCycleStatus = async (bookmarkId: string, currentStatus: string) => {
    const newStatus = nextStatus[currentStatus] || "TO_STUDY";
    try {
      await updateBookmark.mutateAsync({ id: bookmarkId, status: newStatus });
    } catch {
      toast({ title: "Error updating bookmark", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground">Welcome back, {user?.name}!</p>

      <Tabs defaultValue="overview">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bookmarks">My Bookmarks</TabsTrigger>
          <TabsTrigger value="collections">My Collections</TabsTrigger>
          {isContributor && <TabsTrigger value="uploads">My Uploads</TabsTrigger>}
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Card><CardContent className="flex items-center gap-3 p-4"><Bookmark className="h-8 w-8 text-blue-500" /><div><p className="text-2xl font-bold">{totalBookmarks}</p><p className="text-xs text-muted-foreground">Bookmarked</p></div></CardContent></Card>
            <Card><CardContent className="flex items-center gap-3 p-4"><BookOpen className="h-8 w-8 text-yellow-500" /><div><p className="text-2xl font-bold">{inProgress}</p><p className="text-xs text-muted-foreground">In Progress</p></div></CardContent></Card>
            <Card><CardContent className="flex items-center gap-3 p-4"><BookOpen className="h-8 w-8 text-green-500" /><div><p className="text-2xl font-bold">{completed}</p><p className="text-xs text-muted-foreground">Completed</p></div></CardContent></Card>
            <Card><CardContent className="flex items-center gap-3 p-4"><FolderOpen className="h-8 w-8 text-purple-500" /><div><p className="text-2xl font-bold">{collections.length}</p><p className="text-xs text-muted-foreground">Collections</p></div></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="bookmarks" className="space-y-4 mt-4">
          <div className="flex gap-2">
            {["All", "TO_STUDY", "IN_PROGRESS", "COMPLETED"].map((status) => (
              <Button key={status} variant={(bookmarkFilter === undefined && status === "All") || bookmarkFilter === status ? "default" : "outline"} size="sm"
                onClick={() => setBookmarkFilter(status === "All" ? undefined : status)}>
                {status === "All" ? "All" : status.replace(/_/g, " ").toLowerCase().replace(/^\w/, (c) => c.toUpperCase())}
              </Button>
            ))}
          </div>
          {bookmarks.length > 0 ? (
            <div className="space-y-3">
              {bookmarks.map((bookmark: any) => (
                <Card key={bookmark.id}>
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex-1 min-w-0">
                      <Link href={`/resources/${bookmark.resource.id}`} className="font-medium hover:underline">{bookmark.resource.title}</Link>
                      <div className="mt-1 flex gap-1">
                        <Badge variant="secondary" className="text-xs capitalize">{bookmark.resource.language}</Badge>
                        <Badge variant="outline" className="text-xs">{bookmark.resource.proficiencyLevel}</Badge>
                      </div>
                    </div>
                    <Badge className={`cursor-pointer ${statusColors[bookmark.status] || ""}`} onClick={() => handleCycleStatus(bookmark.id, bookmark.status)}>
                      {bookmark.status.replace(/_/g, " ")}
                    </Badge>
                    <Button variant="ghost" size="icon" onClick={() => deleteBookmark.mutate(bookmark.id)}><Trash2 className="h-4 w-4" /></Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState title="No bookmarks" description="Browse resources and bookmark ones you want to study" />
          )}
        </TabsContent>

        <TabsContent value="collections" className="space-y-4 mt-4">
          {collections.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {collections.map((collection: any) => (
                <Card key={collection.id} className="transition-shadow hover:shadow-md">
                  <Link href={`/collections/${collection.id}`}>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">{collection.title}</h3>
                      <div className="mt-2 flex gap-2">
                        <Badge variant="secondary" className="capitalize">{collection.language}</Badge>
                        <Badge variant="outline">{collection.visibility.toLowerCase()}</Badge>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">{collection._count?.items || 0} resources</p>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState title="No collections" description="Create a collection to organize your favorite resources" />
          )}
        </TabsContent>

        {isContributor && (
          <TabsContent value="uploads" className="space-y-4 mt-4">
            <Button asChild><Link href="/resources/upload"><Upload className="mr-2 h-4 w-4" /> Upload Resource</Link></Button>
            {uploadsData?.data?.filter((r: any) => r.contributor?.id === user?.id).length > 0 ? (
              <div className="space-y-3">
                {uploadsData.data.filter((r: any) => r.contributor?.id === user?.id).map((resource: any) => (
                  <Card key={resource.id}>
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="flex-1">
                        <Link href={`/resources/${resource.id}`} className="font-medium hover:underline">{resource.title}</Link>
                        <div className="mt-1 flex gap-1"><Badge variant="secondary" className="capitalize text-xs">{resource.language}</Badge></div>
                      </div>
                      <Badge className={statusColors[resource.status] || ""}>{resource.status}</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState title="No uploads yet" description="Share your first learning resource" />
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
