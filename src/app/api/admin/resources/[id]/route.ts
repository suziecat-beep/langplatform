import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!["MODERATOR", "ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { status, feedback: _feedback } = body;

    if (!status || !["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const resource = await prisma.resource.update({
      where: { id: params.id },
      data: { status },
      include: {
        contributor: { select: { id: true, name: true, avatarUrl: true } },
      },
    });

    return NextResponse.json({ data: resource, message: `Resource ${status.toLowerCase()}` });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
