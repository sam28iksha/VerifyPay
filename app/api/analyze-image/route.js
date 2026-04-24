import { NextResponse } from "next/server";
import { analyzeImageWithAI, fallbackImageAnalysis } from "@/lib/fraud-detection";
import { saveScanResult } from "@/lib/scan-service";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json(
        {
          error: "Image upload is required."
        },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    let result;
    let source = "ai";

    try {
      result = await analyzeImageWithAI({
        base64,
        mimeType: file.type || "image/png"
      });
    } catch (error) {
      console.error("Image AI analysis failed, using fallback:", error);
      result = fallbackImageAnalysis(file.name);
      source = "fallback";
    }

    await saveScanResult({
      type: "image",
      input: file.name || "uploaded-image",
      ...result
    });

    return NextResponse.json({
      success: true,
      source,
      filename: file.name,
      ...result
    });
  } catch (error) {
    console.error("Unexpected analyze-image error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to analyze the screenshot right now."
      },
      { status: 500 }
    );
  }
}
