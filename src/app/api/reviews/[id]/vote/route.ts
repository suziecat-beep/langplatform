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

    const review = await prisma.review.update({
      where: { id: params.id },
      data: { helpfulnessVotes: { increment: 1 } },
    });

    return NextResponse.json({ data: review });
  } catch {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }
}
