import { NextResponse } from "next/server";
import { getRecentScans } from "@/lib/scan-service";

export async function GET() {
  try {
    const results = await getRecentScans(20);
    return NextResponse.json({
      success: true,
      results
    });
  } catch (error) {
    console.error("Unexpected history error:", error);
    return NextResponse.json({
      success: true,
      results: []
    });
  }
}
