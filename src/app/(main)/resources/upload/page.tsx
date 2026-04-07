"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
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
import {
  createResourceSchema,
  proficiencyLevels,
  resourceTypes,
  skillTags,
} from "@/lib/validations";
import { Upload, X, FileText, CheckCircle, ArrowLeft } from "lucide-react";

const languages = [
  "japanese", "french", "spanish", "korean", "german", "chinese", "italian", "portuguese",
];

type FormData = z.infer<typeof createResourceSchema>;

export default function UploadResourcePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { isContributor } = useAuth();
  const createResource = useCreateResource();
  const uploadFile = useUploadFile();

  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(createResourceSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      language: "",
      proficiencyLevel: "A1",
      resourceType: "TEXTBOOK",
      skillTags: [],
      fileUrl: "",
      embedUrl: "",
      thumbnailUrl: "",
    },
  });

  const watchedSkills = watch("skillTags");
  const watchedEmbedUrl = watch("embedUrl");
  const watchedFileUrl = watch("fileUrl");

  if (!isContributor) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-2xl font-bold tracking-tight">Contributor Access Required</h2>
        <p className="mt-2 text-[var(--nd-text-secondary)]">
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
      setValue("fileUrl", url);
      setStep(2);
      toast({ title: "File uploaded" });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      await createResource.mutateAsync({
        ...data,
        fileUrl: data.fileUrl || undefined,
        embedUrl: data.embedUrl || undefined,
        thumbnailUrl: data.thumbnailUrl || undefined,
        content: data.content || undefined,
      });
      setStep(3);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const toggleSkill = (skill: string) => {
    const current = watchedSkills || [];
    const updated = current.includes(skill as any)
      ? current.filter((s) => s !== skill)
      : [...current, skill as (typeof skillTags)[number]];
    setValue("skillTags", updated, { shouldValidate: true });
  };

  const resetForm = () => {
    reset();
    setFile(null);
    setStep(1);
  };

  const stepLabels = ["File or Link", "Details", "Done"];

  return (
    <div className="mx-auto max-w-2xl space-y-8 pb-12">
      {/* Header */}
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-[var(--nd-text-secondary)]">
          Contribute
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">Upload Resource</h1>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-3">
        {stepLabels.map((label, i) => {
          const s = i + 1;
          const isActive = s === step;
          const isComplete = s < step;
          return (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`flex h-7 w-7 items-center justify-center text-xs font-bold transition-colors ${
                  isActive
                    ? "bg-[var(--nd-text-display)] text-white"
                    : isComplete
                    ? "bg-[var(--nd-success)] text-white"
                    : "border border-[var(--nd-border-visible)] text-[var(--nd-text-disabled)]"
                }`}
              >
                {isComplete ? <CheckCircle className="h-4 w-4" /> : s}
              </div>
              <span
                className={`text-xs font-medium ${
                  isActive ? "text-[var(--nd-text-primary)]" : "text-[var(--nd-text-disabled)]"
                }`}
              >
                {label}
              </span>
              {i < stepLabels.length - 1 && (
                <div className="mx-1 h-px w-8 bg-[var(--nd-border-visible)]" />
              )}
            </div>
          );
        })}
      </div>

      {/* Step 1: File */}
      {step === 1 && (
        <Card className="border-[var(--nd-border-visible)] shadow-none">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold tracking-tight">File or Link</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className="flex cursor-pointer flex-col items-center justify-center border-2 border-dashed border-[var(--nd-border-visible)] p-10 text-center transition-colors hover:border-[var(--nd-text-display)]"
              onClick={() => document.getElementById("file-input")?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files[0];
                if (f) setFile(f);
              }}
            >
              <Upload className="h-8 w-8 text-[var(--nd-text-disabled)]" />
              <p className="mt-3 text-sm font-medium">
                {file ? file.name : "Drag & drop or click to upload"}
              </p>
              <p className="mt-1 text-xs text-[var(--nd-text-secondary)]">
                PDF, images, audio, video, zip — Max 50 MB
              </p>
              <input
                id="file-input"
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.mp3,.wav,.ogg,.mp4,.zip"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>

            {file && (
              <div className="flex items-center justify-between border border-[var(--nd-border-visible)] p-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  <span className="text-sm font-medium">{file.name}</span>
                  <span className="text-xs text-[var(--nd-text-secondary)]">
                    ({(file.size / 1024 / 1024).toFixed(1)} MB)
                  </span>
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
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[var(--nd-border-visible)]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest">
                <span className="bg-card px-3 text-[var(--nd-text-secondary)]">Or paste a link</span>
              </div>
            </div>

            <Input
              placeholder="https://youtube.com/watch?v=..."
              {...register("embedUrl")}
              className="border-[var(--nd-border-visible)]"
            />

            {watchedEmbedUrl && (
              <Button onClick={() => setStep(2)} className="w-full">
                Continue with Link
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 2: Metadata */}
      {step === 2 && (
        <Card className="border-[var(--nd-border-visible)] shadow-none">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold tracking-tight">Resource Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Title */}
              <div className="space-y-1.5">
                <Label htmlFor="title" className="text-xs font-bold uppercase tracking-widest">
                  Title
                </Label>
                <Input
                  id="title"
                  placeholder="e.g. Genki I: Elementary Japanese"
                  {...register("title")}
                  className={errors.title ? "border-destructive" : "border-[var(--nd-border-visible)]"}
                />
                {errors.title && (
                  <p className="text-xs text-destructive">{errors.title.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label htmlFor="description" className="text-xs font-bold uppercase tracking-widest">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the resource..."
                  rows={4}
                  {...register("description")}
                  className={errors.description ? "border-destructive" : "border-[var(--nd-border-visible)]"}
                />
                {errors.description && (
                  <p className="text-xs text-destructive">{errors.description.message}</p>
                )}
              </div>

              {/* Content (markdown) */}
              <div className="space-y-1.5">
                <Label htmlFor="content" className="text-xs font-bold uppercase tracking-widest">
                  Content <span className="font-normal normal-case text-[var(--nd-text-secondary)]">(optional, markdown supported)</span>
                </Label>
                <Textarea
                  id="content"
                  placeholder="Add detailed content, notes, or instructions in markdown..."
                  rows={6}
                  {...register("content")}
                  className="border-[var(--nd-border-visible)] font-mono text-sm"
                />
              </div>

              {/* Language + Level grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-widest">Language</Label>
                  <Select
                    value={watch("language")}
                    onValueChange={(v) => setValue("language", v, { shouldValidate: true })}
                  >
                    <SelectTrigger
                      className={errors.language ? "border-destructive" : "border-[var(--nd-border-visible)]"}
                    >
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((l) => (
                        <SelectItem key={l} value={l} className="capitalize">
                          {l}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.language && (
                    <p className="text-xs text-destructive">{errors.language.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-widest">Level</Label>
                  <Select
                    value={watch("proficiencyLevel")}
                    onValueChange={(v: any) => setValue("proficiencyLevel", v, { shouldValidate: true })}
                  >
                    <SelectTrigger className="border-[var(--nd-border-visible)]">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {proficiencyLevels.map((l) => (
                        <SelectItem key={l} value={l}>
                          {l}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Resource Type */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-widest">Resource Type</Label>
                <Select
                  value={watch("resourceType")}
                  onValueChange={(v: any) => setValue("resourceType", v, { shouldValidate: true })}
                >
                  <SelectTrigger className="border-[var(--nd-border-visible)]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {resourceTypes.map((t) => (
                      <SelectItem key={t} value={t} className="capitalize">
                        {t.toLowerCase().replace("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Skill Tags */}
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest">Skill Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {skillTags.map((tag) => {
                    const isSelected = watchedSkills?.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleSkill(tag)}
                        className={`border px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors ${
                          isSelected
                            ? "border-[var(--nd-text-display)] bg-[var(--nd-text-display)] text-white"
                            : "border-[var(--nd-border-visible)] text-[var(--nd-text-secondary)] hover:border-[var(--nd-text-primary)]"
                        }`}
                      >
                        {tag.toLowerCase()}
                      </button>
                    );
                  })}
                </div>
                {errors.skillTags && (
                  <p className="text-xs text-destructive">{errors.skillTags.message}</p>
                )}
              </div>

              {/* Thumbnail URL */}
              <div className="space-y-1.5">
                <Label htmlFor="thumbnailUrl" className="text-xs font-bold uppercase tracking-widest">
                  Thumbnail URL <span className="font-normal normal-case text-[var(--nd-text-secondary)]">(optional)</span>
                </Label>
                <Input
                  id="thumbnailUrl"
                  placeholder="https://example.com/image.jpg"
                  {...register("thumbnailUrl")}
                  className="border-[var(--nd-border-visible)]"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="border-[var(--nd-border-visible)]"
                >
                  <ArrowLeft className="mr-1.5 h-4 w-4" />
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={createResource.isPending}
                  className="flex-1"
                >
                  {createResource.isPending ? "Submitting..." : "Submit for Review"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Success */}
      {step === 3 && (
        <Card className="border-[var(--nd-border-visible)] shadow-none">
          <CardContent className="py-16 text-center">
            <CheckCircle className="mx-auto h-14 w-14 text-[var(--nd-success)]" />
            <h2 className="mt-5 text-2xl font-bold tracking-tight">Resource Submitted</h2>
            <p className="mt-2 text-sm text-[var(--nd-text-secondary)]">
              Your resource is pending review by a moderator.
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <Button variant="outline" onClick={resetForm} className="border-[var(--nd-border-visible)]">
                Upload Another
              </Button>
              <Button onClick={() => router.push("/dashboard?tab=uploads")}>
                View My Uploads
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
