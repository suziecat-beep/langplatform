import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const [totalResources, languages] = await Promise.all([
      prisma.resource.count({ where: { status: "APPROVED" } }),
      prisma.resource.groupBy({
        by: ["language"],
        where: { status: "APPROVED" },
        _count: { id: true },
      }),
    ]);

    return NextResponse.json({
      data: {
        totalResources,
        totalLanguages: languages.length,
        languages: languages.map((l) => ({ name: l.language, count: l._count.id })),
      },
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
