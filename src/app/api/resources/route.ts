import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createResourceSchema, queryParamsSchema } from "@/lib/validations";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const params = queryParamsSchema.safeParse(Object.fromEntries(searchParams));
    if (!params.success) {
      return NextResponse.json({ error: "Invalid query parameters" }, { status: 400 });
    }
    const { page, limit, language, proficiencyLevel: _proficiencyLevel, level, resourceType, skillTag, sort, search } = params.data;
    const proficiencyLevel = _proficiencyLevel || level;

    const where: Prisma.ResourceWhereInput = { status: "APPROVED" };
    if (language) where.language = language;
    if (proficiencyLevel) where.proficiencyLevel = proficiencyLevel;
    if (resourceType) where.resourceType = resourceType;
    if (skillTag) where.skillTags = { has: skillTag };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    let orderBy: Prisma.ResourceOrderByWithRelationInput | Prisma.ResourceOrderByWithRelationInput[] = { createdAt: "desc" };
    if (sort === "rating") orderBy = [{ avgRating: "desc" }, { ratingCount: "desc" }];
    if (sort === "popular") orderBy = { downloadCount: "desc" };

    const [resources, total] = await Promise.all([
      prisma.resource.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          contributor: { select: { id: true, name: true, avatarUrl: true } },
          _count: { select: { reviews: true } },
        },
      }),
      prisma.resource.count({ where }),
    ]);

    return NextResponse.json({
      data: resources,
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
    if (!["CONTRIBUTOR", "MODERATOR", "ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden: CONTRIBUTOR role required" }, { status: 403 });
    }

    const body = await request.json();
    const result = createResourceSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const data = result.data;
    const resource = await prisma.resource.create({
      data: {
        title: data.title,
        description: data.description,
        language: data.language.toLowerCase(),
        proficiencyLevel: data.proficiencyLevel,
        resourceType: data.resourceType,
        skillTags: data.skillTags,
        fileUrl: data.fileUrl || null,
        embedUrl: data.embedUrl || null,
        thumbnailUrl: data.thumbnailUrl || null,
        contributorId: session.user.id,
        status: "PENDING",
      },
      include: {
        contributor: { select: { id: true, name: true, avatarUrl: true } },
      },
    });

    return NextResponse.json({ data: resource }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
