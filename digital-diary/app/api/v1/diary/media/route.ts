import { NextRequest, NextResponse } from "next/server";
import { saveMediaAsset } from "@/lib/repository/media";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { filename, content, size, width, height } = await request.json();

    if (!filename || !content) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_REQUEST",
            message: "Missing filename or content payload in request body.",
          },
        },
        { status: 400 }
      );
    }

    const result = await saveMediaAsset({
      filename,
      base64Content: content,
      size,
      width,
      height,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "UPLOAD_FAILED",
          message: error.message || "Failed to upload media asset.",
        },
        diagnostics: [],
      },
      { status: 500 }
    );
  }
}
