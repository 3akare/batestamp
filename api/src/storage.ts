import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const S3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: `${process.env.R2_ACCESS_KEY_ID}`,
    secretAccessKey: `${process.env.R2_SECRET_ACCESS_KEY}`,
  },
});

export async function getUploadUrl(fileName: string, fileType: string) {
  const command = new PutObjectCommand({
    Bucket: "batestamp",
    Key: `uploads/${Date.now()}-${fileName}`,
    ContentType: fileType,
  });

  return await getSignedUrl(S3, command, { expiresIn: 3600 });
}
