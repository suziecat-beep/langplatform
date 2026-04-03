"use client";

import { useState } from "react";
import Link from "next/link";
import { useCollections, useCreateCollection } from "@/hooks/useCollections";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { useToast } from "@/components/ui/use-toast";
import { Plus, FolderOpen } from "lucide-react";

const languages = ["japanese", "french", "spanish", "korean", "german", "chinese", "italian", "portuguese"];

export default function CollectionsPage() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [langFilter, setLangFilter] = useState("");
  const { data, isLoading } = useCollections({ language: langFilter || undefined });
  const createCollection = useCreateCollection();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("");
  const [visibility, setVisibility] = useState("PUBLIC");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCreate = async () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!language) newErrors.language = "Please select a language";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    try {
      await createCollection.mutateAsync({ title, description, language, visibility });
      toast({ title: "Collection created!" });
      setOpen(false);
      setTitle(""); setDescription(""); setLanguage(""); setVisibility("PUBLIC");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Collections</h1>
          <p className="text-muted-foreground mt-1">Curated sets of learning resources</p>
        </div>
        {isAuthenticated && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" /> Create Collection</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create Collection</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div><Label>Title</Label><Input value={title} onChange={(e) => { setTitle(e.target.value); setErrors((prev) => ({ ...prev, title: "" })); }} className={errors.title ? "border-red-500" : ""} />{errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}</div>
                <div><Label>Description</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} /></div>
                <div>
                  <Label>Language</Label>
                  <Select value={language} onValueChange={(v) => { setLanguage(v); setErrors((prev) => ({ ...prev, language: "" })); }}>
                    <SelectTrigger className={errors.language ? "border-red-500" : ""}><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {languages.map((l) => <SelectItem key={l} value={l} className="capitalize">{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.language && <p className="text-sm text-red-500 mt-1">{errors.language}</p>}
                </div>
                <div>
                  <Label>Visibility</Label>
                  <Select value={visibility} onValueChange={setVisibility}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PUBLIC">Public</SelectItem>
                      <SelectItem value="UNLISTED">Unlisted</SelectItem>
                      <SelectItem value="PRIVATE">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleCreate} disabled={!title || !language || createCollection.isPending} className="w-full">
                  {createCollection.isPending ? "Creating..." : "Create"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="flex gap-2">
        <Select value={langFilter} onValueChange={setLangFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="All languages" /></SelectTrigger>
          <SelectContent>
            {languages.map((l) => <SelectItem key={l} value={l} className="capitalize">{l}</SelectItem>)}
          </SelectContent>
        </Select>
        {langFilter && <Button variant="ghost" size="sm" onClick={() => setLangFilter("")}>Clear</Button>}
      </div>

      {isLoading ? (
        <LoadingSkeleton count={4} />
      ) : data?.data?.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.data.map((collection: any) => (
            <Card key={collection.id} className="transition-shadow hover:shadow-md">
              <Link href={`/collections/${collection.id}`}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <FolderOpen className="h-8 w-8 text-muted-foreground" />
                    <Badge variant="secondary" className="capitalize">{collection.language}</Badge>
                  </div>
                  <h3 className="mt-3 font-semibold text-lg">{collection.title}</h3>
                  {collection.description && (
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{collection.description}</p>
                  )}
                  <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
                    <span>{collection._count?.items || 0} resources</span>
                    <span>by {collection.creator?.name}</span>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No collections yet" description="Be the first to create a curated collection" />
      )}
    </div>
  );
}
