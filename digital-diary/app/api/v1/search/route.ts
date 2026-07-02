import { NextRequest, NextResponse } from "next/server";
import { searchRepository } from "@/lib/search/repository-search";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    const results = await searchRepository({
      query,
      includeTitle: true,
      includeSlug: true,
      includeTags: true,
    });

    return NextResponse.json({
      success: true,
      data: results,
      meta: {
        query,
        count: results.length,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SEARCH_FAILED",
          message: error.message || "Failed to search repository.",
        },
      },
      { status: 500 }
    );
  }
}
