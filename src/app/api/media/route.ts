import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createMediaLinkSchema } from "@/lib/validations";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get("language");
    const platform = searchParams.get("platform");
    const proficiencyLevel = searchParams.get("proficiencyLevel");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: any = {};
    if (language) where.language = language;
    if (platform) where.platform = platform;
    if (proficiencyLevel) where.proficiencyLevel = proficiencyLevel;

    const [mediaLinks, total] = await Promise.all([
      prisma.mediaLink.findMany({
        where,
        orderBy: { upvotes: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          submittedBy: { select: { id: true, name: true } },
        },
      }),
      prisma.mediaLink.count({ where }),
    ]);

    return NextResponse.json({
      data: mediaLinks,
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
    const result = createMediaLinkSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const mediaLink = await prisma.mediaLink.create({
      data: {
        title: result.data.title,
        url: result.data.url,
        platform: result.data.platform,
        language: result.data.language.toLowerCase(),
        proficiencyLevel: result.data.proficiencyLevel || null,
        submittedById: session.user.id,
      },
      include: {
        submittedBy: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ data: mediaLink }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
