import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const [
      totalUsers,
      totalResources,
      totalReviews,
      pendingResources,
      resourcesThisWeek,
      newUsersThisWeek,
      resourcesByLanguage,
      resourcesByStatus,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.resource.count(),
      prisma.review.count(),
      prisma.resource.count({ where: { status: "PENDING" } }),
      prisma.resource.count({ where: { createdAt: { gte: oneWeekAgo } } }),
      prisma.user.count({ where: { createdAt: { gte: oneWeekAgo } } }),
      prisma.resource.groupBy({ by: ["language"], _count: { id: true }, orderBy: { _count: { id: "desc" } } }),
      prisma.resource.groupBy({ by: ["status"], _count: { id: true } }),
    ]);

    return NextResponse.json({
      data: {
        totalUsers,
        totalResources,
        totalReviews,
        pendingResources,
        resourcesThisWeek,
        newUsersThisWeek,
        resourcesByLanguage: resourcesByLanguage.map((r) => ({ language: r.language, count: r._count.id })),
        resourcesByStatus: resourcesByStatus.map((r) => ({ status: r.status, count: r._count.id })),
      },
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
