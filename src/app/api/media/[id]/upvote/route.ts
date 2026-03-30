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

    const mediaLink = await prisma.mediaLink.update({
      where: { id: params.id },
      data: { upvotes: { increment: 1 } },
    });

    return NextResponse.json({ data: mediaLink });
  } catch {
    return NextResponse.json({ error: "Media link not found" }, { status: 404 });
  }
}
