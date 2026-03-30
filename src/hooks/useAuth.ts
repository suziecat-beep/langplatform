"use client";

import { useSession } from "next-auth/react";
import type { Role } from "@prisma/client";

export function useAuth() {
  const { data: session, status } = useSession();

  return {
    user: session?.user,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    role: session?.user?.role as Role | undefined,
    isAdmin: session?.user?.role === "ADMIN",
    isModerator: session?.user?.role === "MODERATOR" || session?.user?.role === "ADMIN",
    isContributor: ["CONTRIBUTOR", "MODERATOR", "ADMIN"].includes(session?.user?.role || ""),
  };
}
