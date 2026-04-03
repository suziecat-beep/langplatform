import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const resourceId = searchParams.get("resourceId");

    const where: any = { userId: session.user.id };
    if (status && ["TO_STUDY", "IN_PROGRESS", "COMPLETED"].includes(status)) {
      where.status = status;
    }
    if (resourceId) {
      where.resourceId = resourceId;
    }

    const bookmarks = await prisma.bookmark.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        resource: {
          include: {
            contributor: { select: { id: true, name: true, avatarUrl: true } },
            _count: { select: { reviews: true } },
          },
        },
      },
    });

    return NextResponse.json({ data: bookmarks });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { resourceId } = body;

    if (!resourceId) {
      return NextResponse.json({ error: "resourceId is required" }, { status: 400 });
    }

    const existing = await prisma.bookmark.findUnique({
      where: { userId_resourceId: { userId: session.user.id, resourceId } },
    });
    if (existing) {
      return NextResponse.json({ error: "Already bookmarked" }, { status: 409 });
    }

    const bookmark = await prisma.bookmark.create({
      data: { userId: session.user.id, resourceId },
      include: {
        resource: {
          include: {
            contributor: { select: { id: true, name: true, avatarUrl: true } },
          },
        },
      },
    });

    return NextResponse.json({ data: bookmark }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
