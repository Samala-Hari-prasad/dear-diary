import { NextRequest, NextResponse } from "next/server";
import { memoryService } from "@/lib/repository/memory-service";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { date } = await request.json();
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { success: false, error: { message: "Invalid or missing date (YYYY-MM-DD)" } },
        { status: 400 }
      );
    }

    const result = await memoryService.openOrCreate(date);
    return NextResponse.json({
      success: true,
      data: result, // { status: "created" | "opened", slug: string }
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "OPEN_OR_CREATE_FAILED",
          message: error.message || "Failed to open or create memory.",
        },
      },
      { status: 500 }
    );
  }
}
