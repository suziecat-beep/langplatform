import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!["MODERATOR", "ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const resources = await prisma.resource.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" },
      include: {
        contributor: { select: { id: true, name: true, email: true, avatarUrl: true } },
      },
    });

    return NextResponse.json({ data: resources });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
