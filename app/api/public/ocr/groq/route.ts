// app/api/ocr/groq/route.ts
import { asyncHandler } from "@/lib/async-handler";
import { apiResponse } from "@/lib/server.utils";
import Groq from "groq-sdk";
import { NextRequest } from "next/server";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ─── Groq OCR ───────────────────────────────────────────
async function extractWithGroq(image: string, language: string) {
  const response = await client.chat.completions.create({
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
    max_tokens: 1024,
    temperature: 0,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: { url: image },
          },
          {
            type: "text",
            text: `Extract all text, numbers, and everything visible in this image. Language: ${language}. Return only the extracted content, nothing else.`,
          },
        ],
      },
    ],
  });

  return {
    text: response.choices?.[0]?.message?.content?.trim(),
    tokens: {
      input: response.usage?.prompt_tokens,
      output: response.usage?.completion_tokens,
    },
  };
}

// ─── Google Vision Fallback (paid) ──────────────────────
async function extractWithGoogleVision(image: string, language: string) {
  const base64 = image.replace(/^data:.+;base64,/, "");

  const res = await fetch(
    `https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_VISION_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requests: [
          {
            image: { content: base64 },
            features: [{ type: "TEXT_DETECTION" }],
            imageContext: { languageHints: [language] },
          },
        ],
      }),
    },
  );

  const data = await res.json();
  return data?.responses?.[0]?.fullTextAnnotation?.text?.trim();
}

// ─── Check if Groq error is rate limit ──────────────────
function isGroqRateLimitError(error: any): boolean {
  return (
    error?.status === 429 ||
    error?.error?.type === "tokens" ||
    error?.message?.toLowerCase().includes("rate limit") ||
    error?.message?.toLowerCase().includes("quota") ||
    error?.message?.toLowerCase().includes("limit exceeded")
  );
}

// ─── Main Route ─────────────────────────────────────────
export const POST = asyncHandler(async (req: NextRequest) => {
  const body = await req.json();
  const { image, language = "eng" } = body;

  if (!image) {
    return apiResponse(false, 400, "Image is required!");
  }

  let extractedText: string | undefined;
  let engine = "groq-llama-vision";
  let tokens = {};
  let fallbackUsed = false;

  // ── Try Groq first (free) ──
  try {
    const result = await extractWithGroq(image, language);
    extractedText = result.text;
    tokens = result.tokens;
  } catch (groqError: any) {
    // ── Check what error Groq threw ──
    if (isGroqRateLimitError(groqError)) {
      // free limit exceeded → fallback to Google Vision

      try {
        extractedText = await extractWithGoogleVision(image, language);
        engine = "google-vision-fallback";
        fallbackUsed = true;
      } catch (googleError: any) {
        // both failed
        return apiResponse(
          false,
          503,
          "All OCR services failed. Try again later!",
        );
      }
    } else {
      // different Groq error (not rate limit)
      return apiResponse(false, 500, groqError?.message || "Groq OCR failed!");
    }
  }

  if (!extractedText) {
    return apiResponse(false, 404, "No text found in image!");
  }

  // extract numbers
  // const numbers = extractedText.match(/\d+(\.\d+)?/g) ?? [];

  // extract emails
  // const emails = extractedText.match(/[\w.-]+@[\w.-]+\.\w+/g) ?? [];

  // extract phones
  // const phones =
  //   extractedText.match(/[+]?[\d\s\-().]{7,}/g)?.map((p: string) => p.trim()) ??
  //   [];

  return apiResponse(true, 200, "Text extracted successfully!", {
    fullText: extractedText,
    // numbers,
    // emails,
    // phones,
    language,
    engine,
    fallbackUsed,
    ...(tokens && { tokens }),
  });
});
