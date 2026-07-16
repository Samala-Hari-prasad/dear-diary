import { NextRequest, NextResponse } from "next/server";
import { RepositoryService } from "@/lib/github/repository";
import { memoryService } from "@/lib/repository/memory-service";

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await memoryService.deleteMemory(slug);

    return NextResponse.json({
      success: true,
      message: "Memory deleted successfully",
    });
  } catch (error: any) {
    const isNotFound = error.message === "MEMORY_NOT_FOUND" || error.message === "PAGE_NOT_FOUND";
    return NextResponse.json(
      {
        success: false,
        error: {
          code: isNotFound ? "MEMORY_NOT_FOUND" : "DELETE_FAILED",
          message: error.message || "Failed to delete memory.",
        },
      },
      { status: isNotFound ? 404 : 500 }
    );
  }
}
