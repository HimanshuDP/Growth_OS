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
      data: (FALLBACK_DATA as any).businesses[bizKey].ads,
      timestamp 
    });
  }

  try {
    const body = await request.json();
    const { businessProfile } = body;
    const profileData = businessProfile || {};

    const prompt = `
Generate 3 ad campaign recommendations for ${profileData.name || 'Unknown'}:
Business Info: ${JSON.stringify(profileData)}

Return ONLY JSON:
{
  "campaigns": [
    {
      "id": "string",
      "campaignName": "string",
      "objective": "awareness | traffic | leads | conversions",
      "platform": "Meta Ads | Google Ads | LinkedIn Ads",
      "targetAudience": { "age": "25-45", "gender": "All", "interests": ["tags"], "location": "City", "behaviors": ["tags"] },
      "budgetRecommendation": "₹X per day",
      "estimatedReach": "range",
      "estimatedCPC": "₹range",
      "estimatedCTR": "X.X%",
      "adCopyVariations": ["copy1", "copy2"],
      "headlineOptions": ["head1", "head2"],
      "visualRecommendation": "creative desc",
      "aiInsight": "2 sentences",
      "projectedROAS": "X.Xx"
    }
  ],
  "strategicAdvice": "3 sentences"
}
`;

    try {
      const { text, source } = await callGemini(prompt, true);
      const data = parseGeminiJSON(text);
      return NextResponse.json({ source, data: data.campaigns || data, timestamp });
    } catch (aiError) {
      console.error('Gemini ad-recommendations error:', aiError);
      return NextResponse.json({ 
        source: 'fallback', 
        data: FALLBACK_DATA.businesses.techVenture.ads,
        timestamp 
      });
    }
  } catch (error) {
    console.error('ad-recommendations fatal error:', error);
    return NextResponse.json({ 
      source: 'fallback', 
      data: FALLBACK_DATA.businesses.techVenture.ads,
      timestamp 
    });
  }
}
