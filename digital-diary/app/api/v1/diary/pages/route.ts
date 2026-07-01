import { NextResponse } from "next/server";
import { RepositoryService } from "@/lib/github/repository";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await RepositoryService.getPagesIndex();
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "META_INDEX_LOAD_FAILED",
          message: error.message || "Failed to load index pages.",
        },
      },
      { status: 500 }
    );
  }
}
