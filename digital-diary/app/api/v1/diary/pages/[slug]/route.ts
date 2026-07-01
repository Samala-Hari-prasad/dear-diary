import { NextRequest, NextResponse } from "next/server";
import { RepositoryService } from "@/lib/github/repository";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const data = await RepositoryService.getPageBySlug(slug);
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    const isNotFound = error.message === "PAGE_NOT_FOUND";
    return NextResponse.json(
      {
        success: false,
        error: {
          code: isNotFound ? "PAGE_NOT_FOUND" : "PAGE_LOAD_FAILED",
          message: error.message || "Failed to load page content.",
        },
      },
      { status: isNotFound ? 404 : 500 }
    );
  }
}
