import { NextResponse } from "next/server";
import { analyzeTextWithAI, fallbackAnalysis } from "@/lib/fraud-detection";
import { saveScanResult } from "@/lib/scan-service";

export async function POST(req) {
  try {
    let body;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          error: "Invalid JSON body."
        },
        { status: 400 }
      );
    }

    const text = typeof body?.text === "string" ? body.text.trim() : "";

    if (!text) {
      return NextResponse.json(
        {
          error: "Text input is required."
        },
        { status: 400 }
      );
    }

    let result;
    let source = "ai";

    try {
      result = await analyzeTextWithAI(text);
    } catch (error) {
      console.error("Text AI analysis failed, using fallback:", error);
      result = fallbackAnalysis(text);
      source = "fallback";
    }

    await saveScanResult({
      type: "text",
      input: text,
      ...result
    });

    return NextResponse.json({
      success: true,
      source,
      ...result
    });
  } catch (error) {
    console.error("Unexpected analyze-text error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to analyze the message right now."
      },
      { status: 500 }
    );
  }
}
