import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createCollectionSchema } from "@/lib/validations";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const collection = await prisma.collection.findUnique({
      where: { id: params.id },
      include: {
        creator: { select: { id: true, name: true, avatarUrl: true } },
        items: {
          orderBy: { sortOrder: "asc" },
          include: {
            resource: {
              include: {
                contributor: { select: { id: true, name: true, avatarUrl: true } },
                _count: { select: { reviews: true } },
              },
            },
          },
        },
        _count: { select: { items: true } },
      },
    });

    if (!collection) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }

    if (collection.visibility !== "PUBLIC") {
      const isOwner = session?.user?.id === collection.creatorId;
      const isAdmin = session?.user?.role === "ADMIN";
      if (!isOwner && !isAdmin) {
        return NextResponse.json({ error: "Collection not found" }, { status: 404 });
      }
    }

    return NextResponse.json({ data: collection });
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

    const collection = await prisma.collection.findUnique({ where: { id: params.id } });
    if (!collection || collection.creatorId !== session.user.id) {
      return NextResponse.json({ error: "Not found or forbidden" }, { status: 404 });
    }

    const body = await request.json();
    const result = createCollectionSchema.partial().safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const updated = await prisma.collection.update({
      where: { id: params.id },
      data: {
        ...result.data,
        language: result.data.language?.toLowerCase(),
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

    const collection = await prisma.collection.findUnique({ where: { id: params.id } });
    if (!collection) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const isOwner = session.user.id === collection.creatorId;
    const isAdmin = session.user.role === "ADMIN";
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.collection.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Collection deleted" });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
