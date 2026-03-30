import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.S3_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || "",
    secretAccessKey: process.env.S3_SECRET_KEY || "",
  },
});

export async function getPresignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn = 900
) {
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    ContentType: contentType,
  });
  const url = await getSignedUrl(s3Client, command, { expiresIn });
  return url;
}

export async function deleteObject(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
  });
  await s3Client.send(command);
}
