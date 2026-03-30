"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useCreateResource, useUploadFile } from "@/hooks/useResources";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { proficiencyLevels, resourceTypes, skillTags } from "@/lib/validations";
import { Upload, X, FileText, CheckCircle } from "lucide-react";

const languages = [
  "japanese", "french", "spanish", "korean", "german", "chinese", "italian", "portuguese",
];

export default function UploadResourcePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { isContributor } = useAuth();
  const createResource = useCreateResource();
  const uploadFile = useUploadFile();

  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("");
  const [level, setLevel] = useState("");
  const [type, setType] = useState("");
  const [skills, setSkills] = useState<string[]>([]);

  if (!isContributor) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-2xl font-bold">Contributor Access Required</h2>
        <p className="mt-2 text-muted-foreground">
          You need a Contributor role to upload resources.
        </p>
      </div>
    );
  }

  const handleFileUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile.mutateAsync({ file });
      setFileUrl(url);
      setStep(2);
      toast({ title: "File uploaded!" });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      await createResource.mutateAsync({
        title,
        description,
        language,
        proficiencyLevel: level,
        resourceType: type,
        skillTags: skills,
        fileUrl: fileUrl || undefined,
        embedUrl: embedUrl || undefined,
      });
      setStep(3);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const toggleSkill = (skill: string) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold">Upload Resource</h1>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
              s === step
                ? "bg-primary text-primary-foreground"
                : s < step
                ? "bg-green-500 text-white"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {s < step ? <CheckCircle className="h-5 w-5" /> : s}
          </div>
        ))}
      </div>

      {/* Step 1: File */}
      {step === 1 && (
        <Card>
          <CardHeader><CardTitle>Step 1: File or Link</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div
              className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center cursor-pointer hover:border-primary/50"
              onClick={() => document.getElementById("file-input")?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files[0];
                if (f) setFile(f);
              }}
            >
              <Upload className="h-10 w-10 text-muted-foreground" />
              <p className="mt-2 font-medium">
                {file ? file.name : "Drag & drop or click to upload"}
              </p>
              <p className="text-sm text-muted-foreground">PDF, images, audio, video, zip — Max 50 MB</p>
              <input
                id="file-input"
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.mp3,.wav,.ogg,.mp4,.zip"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>
            {file && (
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  <span className="text-sm">{file.name}</span>
                  <span className="text-xs text-muted-foreground">({(file.size / 1024 / 1024).toFixed(1)} MB)</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setFile(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            {file && (
              <Button onClick={handleFileUpload} disabled={uploading} className="w-full">
                {uploading ? "Uploading..." : "Upload File"}
              </Button>
            )}

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or paste a link</span>
              </div>
            </div>

            <Input
              placeholder="https://youtube.com/watch?v=..."
              value={embedUrl}
              onChange={(e) => setEmbedUrl(e.target.value)}
            />
            {embedUrl && (
              <Button onClick={() => setStep(2)} className="w-full">Continue with Link</Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 2: Metadata */}
      {step === 2 && (
        <Card>
          <CardHeader><CardTitle>Step 2: Resource Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Genki I: Elementary Japanese" />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the resource..." rows={4} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {languages.map((l) => (
                      <SelectItem key={l} value={l} className="capitalize">{l}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Proficiency Level</Label>
                <Select value={level} onValueChange={setLevel}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {proficiencyLevels.map((l) => (
                      <SelectItem key={l} value={l}>{l}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Resource Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {resourceTypes.map((t) => (
                    <SelectItem key={t} value={t} className="capitalize">{t.toLowerCase().replace("_", " ")}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Skill Tags</Label>
              <div className="mt-2 flex flex-wrap gap-3">
                {skillTags.map((tag) => (
                  <label key={tag} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={skills.includes(tag)}
                      onCheckedChange={() => toggleSkill(tag)}
                    />
                    <span className="capitalize">{tag.toLowerCase()}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button
                onClick={handleSubmit}
                disabled={!title || !description || !language || !level || !type || skills.length === 0 || createResource.isPending}
                className="flex-1"
              >
                {createResource.isPending ? "Submitting..." : "Submit for Review"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Success */}
      {step === 3 && (
        <Card>
          <CardContent className="py-12 text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="mt-4 text-2xl font-bold">Resource Submitted!</h2>
            <p className="mt-2 text-muted-foreground">
              Your resource has been submitted and will be reviewed by a moderator.
            </p>
            <div className="mt-6 flex justify-center gap-2">
              <Button variant="outline" onClick={() => { setStep(1); setFile(null); setFileUrl(""); setEmbedUrl(""); setTitle(""); setDescription(""); setLanguage(""); setLevel(""); setType(""); setSkills([]); }}>
                Upload Another
              </Button>
              <Button onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
