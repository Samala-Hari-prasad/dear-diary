import { NextRequest, NextResponse } from "next/server";
import { memoryService } from "@/lib/repository/memory-service";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ success: false, error: { message: "Missing slug parameter." } }, { status: 400 });
    }

    const { date } = await request.json();
    if (!date) {
      return NextResponse.json({ success: false, error: { message: "Missing date field in request body." } }, { status: 400 });
    }

    const result = await memoryService.duplicateMemory(slug, date);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("Failed to duplicate memory:", error);
    let status = 500;
    if (error.message === "DATE_CONFLICT" || error.message === "INVALID_DATE_FORMAT") {
      status = 409;
    }
    return NextResponse.json(
      { success: false, error: { message: error.message || "Failed to duplicate memory." } },
      { status }
    );
  }
}
