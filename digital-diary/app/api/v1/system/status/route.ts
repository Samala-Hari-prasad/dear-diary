import { NextResponse } from "next/server";
import { checkSystemStatus } from "@/lib/github/health";

export const dynamic = "force-dynamic";

export async function GET() {
  const status = await checkSystemStatus();
  return NextResponse.json(status);
}
