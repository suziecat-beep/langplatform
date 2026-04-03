"use client";

import { useState } from "react";
import { useMediaLinks, useCreateMediaLink, useUpvoteMediaLink } from "@/hooks/useMediaLinks";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/use-toast";
import { ArrowUp, ExternalLink, Plus, Play, Music, Radio, Newspaper, Globe } from "lucide-react";
import { proficiencyLevels, mediaPlatforms } from "@/lib/validations";

const languages = ["japanese", "french", "spanish", "korean", "german", "chinese", "italian", "portuguese"];

const platformIcons: Record<string, React.ReactNode> = {
  YOUTUBE: <Play className="h-5 w-5 text-red-500" />,
  SPOTIFY: <Music className="h-5 w-5 text-green-500" />,
  PODCAST: <Radio className="h-5 w-5 text-purple-500" />,
  NEWS: <Newspaper className="h-5 w-5 text-blue-500" />,
  OTHER: <Globe className="h-5 w-5 text-gray-500" />,
};

export default function MediaHubPage() {
  const { isContributor, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [langFilter, setLangFilter] = useState("");
  const [platformFilter, setPlatformFilter] = useState("");
  const { data, isLoading } = useMediaLinks({
    language: langFilter || undefined,
    platform: platformFilter || undefined,
  });
  const createMediaLink = useCreateMediaLink();
  const upvoteMediaLink = useUpvoteMediaLink();

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [platform, setPlatform] = useState("");
  const [language, setLanguage] = useState("");
  const [level, setLevel] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!url.trim()) newErrors.url = "URL is required";
    else if (!/^https?:\/\/.+/.test(url)) newErrors.url = "Please enter a valid URL";
    if (!platform) newErrors.platform = "Please select a platform";
    if (!language) newErrors.language = "Please select a language";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    try {
      await createMediaLink.mutateAsync({
        title, url, platform, language,
        proficiencyLevel: level || undefined,
      });
      toast({ title: "Media link submitted!" });
      setOpen(false);
      setTitle(""); setUrl(""); setPlatform(""); setLanguage(""); setLevel("");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleUpvote = async (id: string) => {
    if (!isAuthenticated) {
      toast({ title: "Sign in to upvote", variant: "destructive" });
      return;
    }
    try { await upvoteMediaLink.mutateAsync(id); } catch { toast({ title: "Error upvoting", variant: "destructive" }); }
  };

  const mediaLinks = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Media Hub</h1>
          <p className="text-muted-foreground mt-1">Curated links to videos, podcasts, and more</p>
        </div>
        {isContributor && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" /> Submit Link</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Submit a Media Link</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div><Label>Title</Label><Input value={title} onChange={(e) => { setTitle(e.target.value); setErrors((prev) => ({ ...prev, title: "" })); }} placeholder="e.g. Japanese Pod 101" className={errors.title ? "border-red-500" : ""} />{errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}</div>
                <div><Label>URL</Label><Input value={url} onChange={(e) => { setUrl(e.target.value); setErrors((prev) => ({ ...prev, url: "" })); }} placeholder="https://..." className={errors.url ? "border-red-500" : ""} />{errors.url && <p className="text-sm text-red-500 mt-1">{errors.url}</p>}</div>
                <div><Label>Platform</Label><Select value={platform} onValueChange={(v) => { setPlatform(v); setErrors((prev) => ({ ...prev, platform: "" })); }}><SelectTrigger className={errors.platform ? "border-red-500" : ""}><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{mediaPlatforms.map((p) => <SelectItem key={p} value={p} className="capitalize">{p.toLowerCase()}</SelectItem>)}</SelectContent></Select>{errors.platform && <p className="text-sm text-red-500 mt-1">{errors.platform}</p>}</div>
                <div><Label>Language</Label><Select value={language} onValueChange={(v) => { setLanguage(v); setErrors((prev) => ({ ...prev, language: "" })); }}><SelectTrigger className={errors.language ? "border-red-500" : ""}><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{languages.map((l) => <SelectItem key={l} value={l} className="capitalize">{l}</SelectItem>)}</SelectContent></Select>{errors.language && <p className="text-sm text-red-500 mt-1">{errors.language}</p>}</div>
                <div><Label>Level (optional)</Label><Select value={level} onValueChange={setLevel}><SelectTrigger><SelectValue placeholder="Any level" /></SelectTrigger><SelectContent>{proficiencyLevels.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent></Select></div>
                <Button onClick={handleSubmit} disabled={!title || !url || !platform || !language || createMediaLink.isPending} className="w-full">
                  {createMediaLink.isPending ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="flex gap-2">
        <Select value={langFilter} onValueChange={setLangFilter}>
          <SelectTrigger className="w-[150px]"><SelectValue placeholder="Language" /></SelectTrigger>
          <SelectContent>{languages.map((l) => <SelectItem key={l} value={l} className="capitalize">{l}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={platformFilter} onValueChange={setPlatformFilter}>
          <SelectTrigger className="w-[150px]"><SelectValue placeholder="Platform" /></SelectTrigger>
          <SelectContent>{mediaPlatforms.map((p) => <SelectItem key={p} value={p} className="capitalize">{p.toLowerCase()}</SelectItem>)}</SelectContent>
        </Select>
        {(langFilter || platformFilter) && (
          <Button variant="ghost" size="sm" onClick={() => { setLangFilter(""); setPlatformFilter(""); }}>Clear</Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map((i) => <div key={i} className="h-20 animate-pulse rounded-lg bg-muted" />)}</div>
      ) : mediaLinks.length > 0 ? (
        <div className="space-y-3">
          {mediaLinks.map((link: any) => (
            <Card key={link.id}>
              <CardContent className="flex items-center gap-4 p-4">
                <Button variant="ghost" size="sm" className="flex flex-col items-center gap-0 px-2" onClick={() => handleUpvote(link.id)}>
                  <ArrowUp className="h-4 w-4" />
                  <span className="text-sm font-bold">{link.upvotes}</span>
                </Button>
                <div className="flex-shrink-0">{platformIcons[link.platform] || platformIcons.OTHER}</div>
                <div className="flex-1 min-w-0">
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline flex items-center gap-1">
                    {link.title}<ExternalLink className="h-3 w-3" />
                  </a>
                  <div className="mt-1 flex gap-1">
                    <Badge variant="secondary" className="text-xs capitalize">{link.language}</Badge>
                    {link.proficiencyLevel && <Badge variant="outline" className="text-xs">{link.proficiencyLevel}</Badge>}
                    <Badge variant="outline" className="text-xs capitalize">{link.platform.toLowerCase()}</Badge>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">by {link.submittedBy?.name}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No media links yet" description="Submit the first link to share with the community" />
      )}
    </div>
  );
}
