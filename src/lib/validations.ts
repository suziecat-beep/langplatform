import { z } from "zod/v4";

export const proficiencyLevels = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
export const resourceTypes = ["TEXTBOOK", "WORKSHEET", "VIDEO", "AUDIO", "ARTICLE", "FLASHCARD_DECK", "GRADED_READER"] as const;
export const skillTags = ["READING", "WRITING", "LISTENING", "SPEAKING", "GRAMMAR", "VOCABULARY"] as const;
export const visibilityOptions = ["PUBLIC", "UNLISTED", "PRIVATE"] as const;
export const mediaPlatforms = ["YOUTUBE", "SPOTIFY", "PODCAST", "NEWS", "OTHER"] as const;
export const bookmarkStatuses = ["TO_STUDY", "IN_PROGRESS", "COMPLETED"] as const;

export const createResourceSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  description: z.string().min(10, "Description must be at least 10 characters").max(5000),
  content: z.string().max(50000).optional(),
  language: z.string().min(1, "Language is required"),
  proficiencyLevel: z.enum(proficiencyLevels),
  resourceType: z.enum(resourceTypes),
  skillTags: z.array(z.enum(skillTags)).min(1, "Select at least one skill tag"),
  fileUrl: z.url().optional().or(z.literal("")),
  embedUrl: z.url().optional().or(z.literal("")),
  thumbnailUrl: z.url().optional().or(z.literal("")),
});

export const updateResourceSchema = createResourceSchema.partial();

export const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(2000).optional(),
});

export const createCollectionSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(2000).optional(),
  language: z.string().min(1),
  visibility: z.enum(visibilityOptions).optional(),
});

export const createMediaLinkSchema = z.object({
  title: z.string().min(3).max(200),
  url: z.url(),
  platform: z.enum(mediaPlatforms),
  language: z.string().min(1),
  proficiencyLevel: z.enum(proficiencyLevels).optional(),
});

export const queryParamsSchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(20),
  language: z.string().optional(),
  proficiencyLevel: z.enum(proficiencyLevels).optional(),
  level: z.enum(proficiencyLevels).optional(),
  resourceType: z.enum(resourceTypes).optional(),
  skillTag: z.enum(skillTags).optional(),
  sort: z.enum(["rating", "recent", "popular"]).optional(),
  search: z.string().optional(),
  contributorId: z.string().optional(),
});

export function validateRequest<T>(schema: z.ZodType<T>, data: unknown): { data?: T; errors?: string } {
  const result = schema.safeParse(data);
  if (!result.success) {
    return { errors: result.error.issues.map((i: any) => i.message).join(", ") };
  }
  return { data: result.data };
}
