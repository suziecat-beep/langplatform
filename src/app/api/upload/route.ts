import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPresignedUploadUrl } from "@/lib/s3";

const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
  "video/mp4",
  "application/zip",
];

const MAX_FILE_SIZE = 52428800; // 50MB

function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!["CONTRIBUTOR", "MODERATOR", "ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { filename, contentType, fileSize } = body;

    if (!filename || !contentType || !fileSize) {
      return NextResponse.json({ error: "filename, contentType, and fileSize are required" }, { status: 400 });
    }

    if (fileSize > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File size exceeds 50MB limit" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(contentType)) {
      return NextResponse.json({ error: "File type not allowed" }, { status: 400 });
    }

    const key = `uploads/${session.user.id}/${Date.now()}-${sanitizeFilename(filename)}`;
    const uploadUrl = await getPresignedUploadUrl(key, contentType);
    const fileUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/${key}`;

    return NextResponse.json({ data: { uploadUrl, fileUrl } });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
