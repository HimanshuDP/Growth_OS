import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("API key not configured, returning fallback prompt for demo purposes.");
      const { prompt } = await req.json();
      return NextResponse.json({
         videoPrompt: `Cinematic professional video of ${prompt}. Slow motion, beautiful lighting, highly detailed.`,
         suggestedModel: "wan-fast"
      });
    }

    try {
      const { businessName, industry, videoPurpose, platform } = await req.json();

      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const systemPrompt = `Write an optimized AI video generation prompt for a 5-second social media video.
This will be used with the Wan-I2V / wan-fast video generation model.

Business Context:
- Business: ${businessName}
- Industry: ${industry}
- Video Purpose: ${videoPurpose} (e.g. "Diwali promotion", "product launch", "brand intro")
- Platform: ${platform}

Write a prompt that:
1. Describes the opening scene clearly (what we see in the first frame)
2. Describes the motion/action (what moves, how it moves)
3. Describes the mood and lighting
4. Keeps it to 2-3 sentences maximum
5. Is optimized for commercial/advertising look
6. Incorporates Indian cultural context if festival-related

Also provide:
- A negative prompt (what to avoid)
- Suggested aspect ratio: 1:1 for Instagram, 9:16 for Reels/Stories, 16:9 for YouTube

Return ONLY JSON:
{
  "videoPrompt": "...",
  "negativePrompt": "...",
  "aspectRatio": "1:1 | 9:16 | 16:9",
  "estimatedDuration": "5 seconds",
  "motionDescription": "brief description of what moves in the video"
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
        console.warn("Gemini video prompt generation failed, returning fallback:", geminiError);
        return NextResponse.json({
           videoPrompt: `Cinematic professional video of ${videoPurpose}. Slow motion, beautiful lighting, highly detailed.`,
           negativePrompt: "low quality, blurry, static, watermark",
           aspectRatio: "9:16",
           suggestedModel: "wan-fast"
        });
      }
    } catch (parseError) {
      return NextResponse.json({
         videoPrompt: "Cinematic marketing video, professional lighting, slow motion movement.",
         suggestedModel: "wan-fast"
      });
    }
  } catch (error: any) {
    console.error("Critical Video Prompt Gen Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
