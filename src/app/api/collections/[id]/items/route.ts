import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(
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
    const { resourceId, sortOrder } = body;
    if (!resourceId) {
      return NextResponse.json({ error: "resourceId is required" }, { status: 400 });
    }

    const item = await prisma.collectionItem.create({
      data: {
        collectionId: params.id,
        resourceId,
        sortOrder: sortOrder ?? 0,
      },
      include: {
        resource: {
          include: {
            contributor: { select: { id: true, name: true, avatarUrl: true } },
          },
        },
      },
    });

    return NextResponse.json({ data: item }, { status: 201 });
  } catch (error: any) {
    if (error?.code === "P2002") {
      return NextResponse.json({ error: "Resource already in collection" }, { status: 409 });
    }
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
    if (!collection || collection.creatorId !== session.user.id) {
      return NextResponse.json({ error: "Not found or forbidden" }, { status: 404 });
    }

    const body = await request.json();
    const { resourceId } = body;

    await prisma.collectionItem.delete({
      where: { collectionId_resourceId: { collectionId: params.id, resourceId } },
    });

    return NextResponse.json({ message: "Item removed from collection" });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
