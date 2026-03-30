"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Check, X, Users, BookOpen, MessageSquare, Clock } from "lucide-react";

export default function AdminPage() {
  const { isAdmin, isModerator } = useAuth();
  const { toast } = useToast();
  const [queue, setQueue] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [feedback, setFeedback] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/admin/queue").then((r) => r.json()).then((d) => setQueue(d.data || [])).catch(() => {});
    if (isAdmin) {
      fetch("/api/admin/analytics").then((r) => r.json()).then((d) => setAnalytics(d.data)).catch(() => {});
    }
  }, [isAdmin]);

  const handleModerate = async (id: string, status: "APPROVED" | "REJECTED") => {
    try {
      await fetch(`/api/admin/resources/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, feedback: feedback[id] }),
      });
      setQueue((prev) => prev.filter((r) => r.id !== id));
      toast({ title: `Resource ${status.toLowerCase()}` });
    } catch { toast({ title: "Error", variant: "destructive" }); }
  };

  if (!isModerator) {
    return <div className="py-12 text-center text-muted-foreground">Access denied</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <Tabs defaultValue="queue">
        <TabsList>
          <TabsTrigger value="queue">Moderation Queue{queue.length > 0 && <Badge variant="destructive" className="ml-2">{queue.length}</Badge>}</TabsTrigger>
          {isAdmin && <TabsTrigger value="analytics">Analytics</TabsTrigger>}
        </TabsList>

        <TabsContent value="queue" className="space-y-4 mt-4">
          {queue.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">No pending resources</div>
          ) : queue.map((resource) => (
            <Card key={resource.id}>
              <CardContent className="p-4">
                <h3 className="font-semibold">{resource.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{resource.description}</p>
                <div className="mt-2 flex gap-1 flex-wrap">
                  <Badge variant="secondary" className="capitalize">{resource.language}</Badge>
                  <Badge variant="outline">{resource.proficiencyLevel}</Badge>
                  <Badge variant="outline" className="capitalize">{resource.resourceType.toLowerCase().replace("_", " ")}</Badge>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">Submitted by {resource.contributor?.name} ({resource.contributor?.email})</p>
                {(resource.fileUrl || resource.embedUrl) && (
                  <a href={resource.fileUrl || resource.embedUrl} target="_blank" rel="noopener noreferrer" className="mt-1 text-xs text-blue-500 hover:underline">View resource</a>
                )}
                <div className="mt-3">
                  <Textarea placeholder="Feedback (optional)" value={feedback[resource.id] || ""} onChange={(e) => setFeedback((prev) => ({ ...prev, [resource.id]: e.target.value }))} rows={2} />
                </div>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleModerate(resource.id, "APPROVED")}><Check className="mr-1 h-4 w-4" /> Approve</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleModerate(resource.id, "REJECTED")}><X className="mr-1 h-4 w-4" /> Reject</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {isAdmin && (
          <TabsContent value="analytics" className="space-y-4 mt-4">
            {analytics ? (
              <>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <Card><CardContent className="flex items-center gap-3 p-4"><Users className="h-8 w-8 text-blue-500" /><div><p className="text-2xl font-bold">{analytics.totalUsers}</p><p className="text-xs text-muted-foreground">Total Users</p></div></CardContent></Card>
                  <Card><CardContent className="flex items-center gap-3 p-4"><BookOpen className="h-8 w-8 text-green-500" /><div><p className="text-2xl font-bold">{analytics.totalResources}</p><p className="text-xs text-muted-foreground">Total Resources</p></div></CardContent></Card>
                  <Card><CardContent className="flex items-center gap-3 p-4"><MessageSquare className="h-8 w-8 text-purple-500" /><div><p className="text-2xl font-bold">{analytics.totalReviews}</p><p className="text-xs text-muted-foreground">Total Reviews</p></div></CardContent></Card>
                  <Card><CardContent className="flex items-center gap-3 p-4"><Clock className="h-8 w-8 text-yellow-500" /><div><p className="text-2xl font-bold">{analytics.pendingResources}</p><p className="text-xs text-muted-foreground">Pending Review</p></div></CardContent></Card>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Card><CardHeader><CardTitle>This Week</CardTitle></CardHeader><CardContent><p className="text-sm"><strong>{analytics.resourcesThisWeek}</strong> new resources</p><p className="text-sm"><strong>{analytics.newUsersThisWeek}</strong> new users</p></CardContent></Card>
                  <Card><CardHeader><CardTitle>Resources by Language</CardTitle></CardHeader><CardContent><div className="space-y-2">{analytics.resourcesByLanguage?.map((item: any) => (<div key={item.language} className="flex items-center justify-between"><span className="text-sm capitalize">{item.language}</span><Badge variant="secondary">{item.count}</Badge></div>))}</div></CardContent></Card>
                </div>
              </>
            ) : (
              <div className="py-8 text-center text-muted-foreground">Loading analytics...</div>
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
