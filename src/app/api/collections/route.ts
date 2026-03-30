import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createCollectionSchema } from "@/lib/validations";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get("language");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const session = await getServerSession(authOptions);

    const where: any = { visibility: "PUBLIC" };
    if (language) where.language = language;

    // Also show user's own collections
    if (session?.user) {
      where.OR = [
        { visibility: "PUBLIC" },
        { creatorId: session.user.id },
      ];
      delete where.visibility;
      if (language) {
        where.AND = [{ language }];
      }
    }

    const [collections, total] = await Promise.all([
      prisma.collection.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          creator: { select: { id: true, name: true, avatarUrl: true } },
          _count: { select: { items: true } },
        },
      }),
      prisma.collection.count({ where }),
    ]);

    return NextResponse.json({
      data: collections,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
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
    const result = createCollectionSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const collection = await prisma.collection.create({
      data: {
        title: result.data.title,
        description: result.data.description || null,
        language: result.data.language.toLowerCase(),
        visibility: result.data.visibility || "PUBLIC",
        creatorId: session.user.id,
      },
      include: {
        creator: { select: { id: true, name: true, avatarUrl: true } },
        _count: { select: { items: true } },
      },
    });

    return NextResponse.json({ data: collection }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
