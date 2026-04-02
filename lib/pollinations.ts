// ─── IMAGE GENERATION ───────────────────────────────────────────
// Pollinations.ai image API — completely free, no API key needed
// URL format: https://image.pollinations.ai/prompt/{prompt}?params

export type ImageModel = "flux" | "flux-realism" | "flux-anime" | "turbo";

export type SocialFormat = {
  name: string;
  width: number;
  height: number;
  label: string; // e.g. "Instagram Post"
  aspectRatio: string; // e.g. "1:1"
};

export const SOCIAL_FORMATS: SocialFormat[] = [
  {
    name: "instagram_post",
    width: 1080,
    height: 1080,
    label: "Instagram Post",
    aspectRatio: "1:1",
  },
  {
    name: "instagram_story",
    width: 1080,
    height: 1920,
    label: "Instagram Story",
    aspectRatio: "9:16",
  },
  {
    name: "instagram_reel",
    width: 1080,
    height: 1920,
    label: "Instagram Reel",
    aspectRatio: "9:16",
  },
  {
    name: "facebook_post",
    width: 1200,
    height: 630,
    label: "Facebook Post",
    aspectRatio: "1.91:1",
  },
  {
    name: "linkedin_post",
    width: 1200,
    height: 627,
    label: "LinkedIn Post",
    aspectRatio: "1.91:1",
  },
  {
    name: "twitter_post",
    width: 1600,
    height: 900,
    label: "Twitter/X Post",
    aspectRatio: "16:9",
  },
  {
    name: "youtube_thumbnail",
    width: 1280,
    height: 720,
    label: "YouTube Thumbnail",
    aspectRatio: "16:9",
  },
  {
    name: "ad_banner",
    width: 1200,
    height: 628,
    label: "Ad Banner",
    aspectRatio: "1.91:1",
  },
];

export function buildPollinationsImageUrl(
  prompt: string,
  format: SocialFormat,
  model: ImageModel = "flux",
  seed?: number,
): string {
  const encodedPrompt = encodeURIComponent(prompt);
  const params = new URLSearchParams({
    width: String(format.width),
    height: String(format.height),
    model,
    nologo: "true",
    enhance: "true",
  });

  if (seed !== undefined) {
    params.set("seed", String(seed));
  }

  const rawUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?${params}`;
  return rawUrl;
}

// Generate multiple variations of the same prompt (different seeds)
export function buildVariationUrls(
  prompt: string,
  format: SocialFormat,
  count: number = 4,
  model: ImageModel = "flux",
): string[] {
  return Array.from({ length: count }, (_, i) =>
    buildPollinationsImageUrl(
      prompt,
      format,
      model,
      i * 1000 + Math.floor(Math.random() * 999),
    ),
  );
}

// Proxy URL to bypass CORS and ORB (Opaque Response Blocking) in browser
export function getProxiedImageUrl(url: string): string {
  if (!url) return "";
  if (url.startsWith("/api/proxy-image")) return url;
  return `/api/proxy-image?url=${encodeURIComponent(url)}`;
}

// Download image as blob natively, bypassing referrer blocks via strict fetch policies
export async function downloadPollinationsImage(url: string): Promise<Blob> {
  // Use our internal proxy to bypass pure browser Origin restrictions and unblocking Cloudflare!
  const proxiedUrl = getProxiedImageUrl(url);
  const response = await fetch(proxiedUrl, { referrerPolicy: "no-referrer" });
  if (!response.ok) throw new Error("Failed to fetch image through proxy");
  return response.blob();
}

// Save image to user's device
export function saveImageToDevice(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── VIDEO GENERATION ─────────────────────────────────────────────
// Pollinations.ai video API — wan-fast model, free 5-second videos
// API: GET https://video.pollinations.ai/prompt/{prompt}?model=wan-fast

export type VideoModel = "wan-fast" | "wan" | "nova-reel";

export async function generatePollinationsVideo(
  prompt: string,
  model: VideoModel = "wan-fast",
): Promise<string> {
  // returns blob URL
  const encodedPrompt = encodeURIComponent(prompt);
  const rawUrl = `https://video.pollinations.ai/prompt/${encodedPrompt}?model=${model}&nologo=true`;
  const proxiedUrl = getProxiedImageUrl(rawUrl);

  const response = await fetch(proxiedUrl);
  if (!response.ok)
    throw new Error(`Video generation failed: ${response.status}`);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

// ─── PROMPT ENGINEERING (Gemini → Pollinations bridge) ────────────
// Use Gemini to write an optimized image/video generation prompt
// from a marketing brief

export async function buildAIImagePrompt(
  businessName: string,
  industry: string,
  captionTheme: string,
  brandTone: string,
  festivalHook: string | null,
  style: "photorealistic" | "illustration" | "minimal" | "vibrant",
): Promise<string> {
  const geminiResponse = await fetch("/api/generate-image-prompt", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      businessName,
      industry,
      captionTheme,
      brandTone,
      festivalHook,
      style,
    }),
  });

  if (!geminiResponse.ok) {
    return `${captionTheme}, professional marketing photo, Indian market, ${style}, high quality`;
  }

  const data = await geminiResponse.json();
  return (
    data.imagePrompt ||
    `${captionTheme}, professional marketing photo, Indian market, ${style}, high quality`
  );
}
