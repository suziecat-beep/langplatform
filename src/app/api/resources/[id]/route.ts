import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { updateResourceSchema } from "@/lib/validations";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const resource = await prisma.resource.findUnique({
      where: { id: params.id },
      include: {
        contributor: { select: { id: true, name: true, avatarUrl: true } },
        reviews: {
          include: { user: { select: { id: true, name: true, avatarUrl: true } } },
          orderBy: { helpfulnessVotes: "desc" },
        },
        tags: true,
        _count: { select: { reviews: true } },
      },
    });

    if (!resource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }

    // Only show non-approved resources to contributor or admin
    if (resource.status !== "APPROVED") {
      const isOwner = session?.user?.id === resource.contributorId;
      const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "MODERATOR";
      if (!isOwner && !isAdmin) {
        return NextResponse.json({ error: "Resource not found" }, { status: 404 });
      }
    }

    // Fire-and-forget download count increment
    prisma.resource.update({
      where: { id: params.id },
      data: { downloadCount: { increment: 1 } },
    }).catch(() => {});

    return NextResponse.json({ data: resource });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resource = await prisma.resource.findUnique({ where: { id: params.id } });
    if (!resource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }

    const isOwner = session.user.id === resource.contributorId;
    const isAdmin = session.user.role === "ADMIN";
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const result = updateResourceSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const updated = await prisma.resource.update({
      where: { id: params.id },
      data: {
        ...result.data,
        language: result.data.language?.toLowerCase(),
      },
      include: {
        contributor: { select: { id: true, name: true, avatarUrl: true } },
      },
    });

    return NextResponse.json({ data: updated });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resource = await prisma.resource.findUnique({ where: { id: params.id } });
    if (!resource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }

    const isOwner = session.user.id === resource.contributorId;
    const isAdmin = session.user.role === "ADMIN";
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.resource.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Resource deleted" });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
