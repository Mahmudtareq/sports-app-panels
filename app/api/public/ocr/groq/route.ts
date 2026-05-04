// app/api/ocr/groq/route.ts
import { asyncHandler } from "@/lib/async-handler";
import { apiResponse } from "@/lib/server.utils";
import Groq from "groq-sdk";
import { NextRequest } from "next/server";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const POST = asyncHandler(async (req: NextRequest) => {
  const body = await req.json();
  const { image, language = "eng" } = body;

  if (!image) {
    return apiResponse(false, 400, "Image is required!");
  }

  const response = await client.chat.completions.create({
    model: "meta-llama/llama-4-scout-17b-16e-instruct", // free vision model
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: image, // base64 with prefix → "data:image/jpeg;base64,..."
            },
          },
          {
            type: "text",
            text: `Extract all text from this image. Language: ${language}. Return only the extracted text, nothing else.`,
          },
        ],
      },
    ],
    max_tokens: 1024,
    temperature: 0, // 0 = consistent output, best for OCR
  });

  const extractedText = response.choices?.[0]?.message?.content?.trim();

  if (!extractedText) {
    return apiResponse(false, 404, "No text found in image!");
  }

  return apiResponse(true, 200, "Text extracted successfully!", {
    text: extractedText,
    language,
    engine: "groq-llama-vision",
    tokens: {
      input: response.usage?.prompt_tokens,
      output: response.usage?.completion_tokens,
    },
  });
});
