import { NextRequest, NextResponse } from "next/server";
import { memoryService } from "@/lib/repository/memory-service";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { date } = await request.json();

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { success: false, error: { message: "Invalid date format (YYYY-MM-DD)" } },
        { status: 400 }
      );
    }

    await memoryService.changeDate(slug, date);

    return NextResponse.json({
      success: true,
      message: "Date changed successfully",
    });
  } catch (error: any) {
    const isConflict = error.message === "DATE_CONFLICT";
    const isNotFound = error.message === "MEMORY_NOT_FOUND" || error.message === "PAGE_NOT_FOUND";
    
    let status = 500;
    if (isConflict) status = 409;
    if (isNotFound) status = 404;

    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.message || "CHANGE_DATE_FAILED",
          message: isConflict ? "A memory already exists for this date." : (error.message || "Failed to change date."),
        },
      },
      { status }
    );
  }
}
