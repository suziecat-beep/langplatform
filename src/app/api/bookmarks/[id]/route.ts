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

    const bookmark = await prisma.bookmark.findUnique({ where: { id: params.id } });
    if (!bookmark || bookmark.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const body = await request.json();
    const updated = await prisma.bookmark.update({
      where: { id: params.id },
      data: {
        ...(body.status && { status: body.status }),
        ...(body.notes !== undefined && { notes: body.notes }),
      },
    });

    return NextResponse.json({ data: updated });
  } catch {
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

    const bookmark = await prisma.bookmark.findUnique({ where: { id: params.id } });
    if (!bookmark || bookmark.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.bookmark.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Bookmark removed" });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
