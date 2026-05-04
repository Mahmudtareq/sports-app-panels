// app/api/ocr/ocrspace/route.ts
import { asyncHandler } from "@/lib/async-handler";
import { apiResponse } from "@/lib/server.utils";
import { NextRequest } from "next/server";

// helper — call ocr.space with a specific engine
async function callOCRSpace(image: string, language: string, engine: string) {
  const formData = new FormData();
  formData.append("base64Image", image);
  formData.append("apikey", process.env.OCRSPACE_API_KEY || "helloworld");
  formData.append("language", language);
  formData.append("isOverlayRequired", "true");
  formData.append("detectOrientation", "true");
  formData.append("scale", "true");
  formData.append("isTable", "true");
  formData.append("OCREngine", engine); // "1" or "2"

  const res = await fetch("https://api.ocr.space/parse/image", {
    method: "POST",
    body: formData,
  });

  return res.json();
}

export const POST = asyncHandler(async (req: NextRequest) => {
  const body = await req.json();
  const { image, language = "eng" } = body;

  if (!image) {
    return apiResponse(false, 400, "Image is required!");
  }

  // Try Engine 2 first → fallback to Engine 1
  let data = await callOCRSpace(image, language, "2");

  if (
    data.IsErroredOnProcessing ||
    !data.ParsedResults?.[0]?.ParsedText?.trim()
  ) {
    // fallback to engine 1
    data = await callOCRSpace(image, language, "1");
  }

  if (data.IsErroredOnProcessing) {
    return apiResponse(
      false,
      400,
      data.ErrorMessage?.[0] || "OCR processing failed!",
    );
  }

  const result = data.ParsedResults?.[0];
  const extractedText = result?.ParsedText?.trim();

  if (!extractedText) {
    return apiResponse(false, 404, "No text found in image!");
  }

  // words with position
  const words =
    result.TextOverlay?.Lines?.flatMap((line: any) =>
      line.Words?.map((word: any) => ({
        text: word.WordText,
        left: word.Left,
        top: word.Top,
        width: word.Width,
        height: word.Height,
      })),
    ) ?? [];

  // lines
  const lines =
    result.TextOverlay?.Lines?.map((line: any) => ({
      text: line.Words?.map((w: any) => w.WordText).join(" "),
      top: line.Words?.[0]?.Top,
      left: line.Words?.[0]?.Left,
    })) ?? [];

  // numbers only
  const numbers = words
    .map((w: any) => w?.text)
    .filter((t: string) => t && /\d+/.test(t));

  // emails
  const emails = extractedText.match(/[\w.-]+@[\w.-]+\.\w+/g) ?? [];

  // phones
  const phones =
    extractedText.match(/[+]?[\d\s\-().]{7,}/g)?.map((p: string) => p.trim()) ??
    [];

  return apiResponse(true, 200, "Text extracted successfully!", {
    fullText: extractedText,
    lines,
    words,
    numbers,
    emails,
    phones,
    processingTime: data.ProcessingTimeInMilliseconds,
    language,
    engine: "ocrspace",
  });
});
