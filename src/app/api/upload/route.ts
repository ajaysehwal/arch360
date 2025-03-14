import { NextResponse } from "next/server";
import { s3 } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { sanitizeFileName, validateFile } from "@/utils/api-validation";
export const runtime = "edge";

export const POST = async (req: Request) => {
  try {
    const formData = await req.formData();
    const userId = formData.get("user_id") as string;
    const file = formData.get("file") as File;
    const validationError = validateFile(file, userId);
    if (validationError) {
      return NextResponse.json(
        {
          success: false,
          message: validationError,
        },
        { status: 400 }
      );
    }

    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const sanitizedFileName = sanitizeFileName(file.name);
    const fileName = `${timestamp}-${randomString}-${sanitizedFileName}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: `${userId}/${fileName}`,
      Body: buffer,
      ContentType: file.type,
      ContentDisposition: "inline",
      CacheControl: "max-age=31536000", // 1 year cache
    });

    await s3.send(command);
    return NextResponse.json({
      success: true,
      url: `https://pub-3879bdda317746f28cf98f17e4474ea2.r2.dev/${userId}/${fileName}`,
      key: `${userId}/${fileName}`,
      message: "File uploaded successfully",
    });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {

    return NextResponse.json(
      {
        success: false,
        message: "Failed to upload file",
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
};

export const config = {
  api: {
    bodyParser: false,
    responseLimit: "20mb",
    timeout: 30, // 30 seconds
  },
};
