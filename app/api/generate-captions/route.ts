import { NextRequest, NextResponse } from 'next/server';
import { callGemini, parseGeminiJSON } from '@/lib/gemini';
import { FALLBACK_DATA } from '@/lib/fallback-data';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(request: NextRequest) {
  const timestamp = new Date().toISOString();
  const isDemoMode = request.headers.get('x-demo-mode') === 'true';
  const demoBusiness = request.headers.get('x-demo-business') || 'Mumbai Mithai House';

  if (isDemoMode) {
    await sleep(1500);
    const bizKey = demoBusiness === 'Mumbai Mithai House' ? 'mumbaiMithai' : 
                   demoBusiness === 'TechVenture Solutions' ? 'techVenture' : 'priyasBoutique';
    return NextResponse.json({ 
      source: 'fallback', 
      data: (FALLBACK_DATA as any).businesses[bizKey].captions,
      timestamp 
    });
  }

  try {
    const body = await request.json();
    const { productDescription, businessProfile, platform } = body;
    const profileData = businessProfile || {};

    const prompt = `
Generate 3 social media caption variations for:
Business: ${profileData.name || 'Unknown'}
Platform: ${platform || 'Instagram'}
Product: ${productDescription || 'General Brand Awareness'}

Return ONLY JSON:
{
  "variations": [
    {
      "id": "1",
      "tone": "Emotional & Story-driven",
      "caption": "Full caption text (150-200 words)",
      "hashtags": ["12 tags"],
      "cta": "cta",
      "characterCount": 0,
      "whyItWorks": "psychology explanation"
    }
  ]
}
`;

    try {
      const { text, source } = await callGemini(prompt, true);
      const data = parseGeminiJSON(text);
      const variations = data.variations || data;
      return NextResponse.json({ source, data: variations, timestamp });
    } catch (aiError) {
      console.error('Gemini generate-captions error:', aiError);
      return NextResponse.json({ 
        source: 'fallback', 
        data: FALLBACK_DATA.businesses.techVenture.captions,
        timestamp 
      });
    }
  } catch (error) {
    console.error('generate-captions fatal error:', error);
    return NextResponse.json({ 
      source: 'fallback', 
      data: FALLBACK_DATA.businesses.techVenture.captions,
      timestamp 
    });
  }
}
