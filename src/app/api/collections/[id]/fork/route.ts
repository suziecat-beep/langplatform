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

    const original = await prisma.collection.findUnique({
      where: { id: params.id },
      include: { items: true },
    });

    if (!original || original.visibility !== "PUBLIC") {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }

    const forked = await prisma.collection.create({
      data: {
        title: original.title + " (fork)",
        description: original.description,
        language: original.language,
        creatorId: session.user.id,
        visibility: "PRIVATE",
        items: {
          create: original.items.map((item) => ({
            resourceId: item.resourceId,
            sortOrder: item.sortOrder,
          })),
        },
      },
      include: {
        creator: { select: { id: true, name: true, avatarUrl: true } },
        _count: { select: { items: true } },
      },
    });

    return NextResponse.json({ data: forked }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
