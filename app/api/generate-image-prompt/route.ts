import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("API key not configured, returning fallback prompt for demo purposes.");
      const { businessName, industry, captionTheme, style } = await req.json();
      return NextResponse.json({
         imagePrompt: `Professional ${style} marketing photo for ${businessName} in the ${industry} industry. Thematic focus: ${captionTheme}. High quality, 4k resolution, beautiful lighting, cinematic.`,
         negativePrompt: "blurry, low quality, watermark, text, logo, deformed, bad anatomy",
         suggestedModel: "flux",
         colorPalette: ["#FF6B35", "#FFD166", "#0D0A07"]
      });
    }

    const { businessName, industry, captionTheme, brandTone, festivalHook, style } = await req.json();

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const systemPrompt = `You are an expert at writing prompts for Stable Diffusion and Flux AI image generators.
Your job is to convert a marketing brief into a highly optimized image generation prompt.

Marketing Brief:
- Business: ${businessName}
- Industry: ${industry}
- Post Theme: ${captionTheme}
- Brand Tone: ${brandTone}
- Festival/Occasion: ${festivalHook || 'None'}
- Desired Visual Style: ${style}

Write ONE optimized image generation prompt (max 200 words) that will produce a stunning, professional social media post image. 

Rules for the prompt:
- Start with the main subject (person, product, scene)
- Include lighting description (golden hour, studio lighting, etc.)
- Include style tags (photorealistic, commercial photography, advertisement, etc.)
- Include mood/atmosphere
- Include quality tags at the end: (masterpiece, best quality, 4k, professional, sharp)
- For Indian businesses: mention Indian context naturally (Indian person, Indian aesthetic, warm tones)
- For festivals: mention festival colors and decorations
- Do NOT mention the business name in the prompt
- Keep it to ONE paragraph, no bullet points, no explanation

Return ONLY a JSON object:
{
  "imagePrompt": "the optimized prompt text",
  "negativePrompt": "blurry, low quality, watermark, text, logo, deformed, ugly, bad anatomy",
  "suggestedModel": "flux-realism | flux | turbo",
  "colorPalette": ["#hex1", "#hex2", "#hex3"]
}`;

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: systemPrompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
        }
      });

      const text = result.response.text();
      return NextResponse.json(JSON.parse(text));
    } catch (geminiError) {
      console.warn("Gemini prompt generation failed, returning fallback:", geminiError);
      return NextResponse.json({
        imagePrompt: `Professional ${style} marketing photo for ${businessName} in the ${industry} industry. Thematic focus: ${captionTheme}. High quality, 4k resolution, beautiful lighting, cinematic.`,
        negativePrompt: "blurry, low quality, watermark, text, logo, deformed, bad anatomy",
        suggestedModel: "flux",
        colorPalette: ["#FF6B35", "#FFD166", "#0D0A07"]
      });
    }
  } catch (error: any) {
    console.error("Critical Image Prompt Gen Error:", error);
    // Ultimate fallback for JSON parsing errors or other critical failures
    return NextResponse.json({ 
      imagePrompt: "Professional marketing photo, high quality, 4k, cinematic lighting"
    });
  }
}
