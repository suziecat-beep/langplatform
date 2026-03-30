import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createReviewSchema } from "@/lib/validations";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const reviews = await prisma.review.findMany({
      where: { resourceId: params.id },
      orderBy: [{ helpfulnessVotes: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
      },
    });

    const total = await prisma.review.count({ where: { resourceId: params.id } });

    return NextResponse.json({
      data: reviews,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = createReviewSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    // Check resource exists
    const resource = await prisma.resource.findUnique({ where: { id: params.id } });
    if (!resource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }

    // Check for duplicate review
    const existing = await prisma.review.findUnique({
      where: { resourceId_userId: { resourceId: params.id, userId: session.user.id } },
    });
    if (existing) {
      return NextResponse.json({ error: "You have already reviewed this resource" }, { status: 409 });
    }

    const review = await prisma.review.create({
      data: {
        resourceId: params.id,
        userId: session.user.id,
        rating: result.data.rating,
        comment: result.data.comment || null,
      },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
      },
    });

    // Recalculate average rating
    const agg = await prisma.review.aggregate({
      where: { resourceId: params.id },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await prisma.resource.update({
      where: { id: params.id },
      data: {
        avgRating: agg._avg.rating || 0,
        ratingCount: agg._count.rating,
      },
    });

    return NextResponse.json({ data: review }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
