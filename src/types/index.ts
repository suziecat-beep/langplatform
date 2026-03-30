import type { User, Resource, Collection, Review, Bookmark, MediaLink, Tag, CollectionItem } from "@prisma/client";

export type ResourceWithContributor = Resource & {
  contributor: Pick<User, "id" | "name" | "avatarUrl">;
  _count?: { reviews: number };
  tags?: Tag[];
};

export type ResourceWithDetails = Resource & {
  contributor: Pick<User, "id" | "name" | "avatarUrl">;
  reviews: (Review & { user: Pick<User, "id" | "name" | "avatarUrl"> })[];
  tags: Tag[];
  _count: { reviews: number };
};

export type CollectionWithDetails = Collection & {
  creator: Pick<User, "id" | "name" | "avatarUrl">;
  items: (CollectionItem & { resource: ResourceWithContributor })[];
  _count: { items: number };
};

export type BookmarkWithResource = Bookmark & {
  resource: ResourceWithContributor;
};

export type MediaLinkWithUser = MediaLink & {
  submittedBy: Pick<User, "id" | "name">;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
};

export type ApiResponse<T = unknown> = {
  data?: T;
  error?: string;
  message?: string;
};
