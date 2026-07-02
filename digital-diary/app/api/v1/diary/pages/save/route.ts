import { NextRequest, NextResponse } from "next/server";
import { saveEditorSession } from "@/lib/repository/save";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { session } = await request.json();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_REQUEST",
            message: "Missing session payload in request body.",
          },
        },
        { status: 400 }
      );
    }

    const result = await saveEditorSession(session);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    const isConflict = error.message === "CONFLICT";
    return NextResponse.json(
      {
        success: false,
        error: {
          code: isConflict ? "CONFLICT" : "SAVE_FAILED",
          message: error.message || "Failed to save memory changes.",
        },
      },
      { status: isConflict ? 409 : 500 }
    );
  }
}
