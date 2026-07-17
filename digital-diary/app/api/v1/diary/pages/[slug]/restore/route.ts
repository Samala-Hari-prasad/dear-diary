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

    await memoryService.restoreMemory(slug);
    return NextResponse.json({ success: true, data: { slug } });
  } catch (error: any) {
    console.error("Failed to restore memory:", error);
    return NextResponse.json(
      { success: false, error: { message: error.message || "Failed to restore memory." } },
      { status: 500 }
    );
  }
}
