import { NextRequest, NextResponse } from 'next/server';
import { callGemini, parseGeminiJSON } from '@/lib/gemini';
import { getUpcomingFestivals } from '@/lib/festivals-india';
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
      data: (FALLBACK_DATA as any).businesses[bizKey].festivals,
      timestamp 
    });
  }

  try {
    const body = await request.json();
    const { businessProfile, lookAheadDays = 45 } = body;
    const festivals = getUpcomingFestivals(lookAheadDays);
    const profileData = businessProfile || {};

    if (festivals.length === 0) {
      return NextResponse.json({ 
        source: 'fallback', 
        data: FALLBACK_DATA.businesses.techVenture.festivals,
        timestamp 
      });
    }

    const prompt = `
Create festival campaign strategies for ${profileData.name || 'Unknown'}:
Festivals: ${JSON.stringify(festivals)}

Return ONLY JSON array:
[
  {
    "festival": "Festival name",
    "date": "YYYY-MM-DD",
    "daysUntil": 0,
    "urgency": "high | medium | low",
    "campaignIdea": "concept",
    "contentAngles": ["3 items"],
    "sampleCaption": "caption text",
    "visualRecommendation": "creative desc",
    "bestPlatform": "platform",
    "postingStrategy": "timing"
  }
]
`;

    try {
      const { text, source } = await callGemini(prompt, true);
      const data = parseGeminiJSON(text);
      return NextResponse.json({ source, data, timestamp });
    } catch (aiError) {
      console.error('Gemini detect-festivals error:', aiError);
      return NextResponse.json({ 
        source: 'fallback', 
        data: FALLBACK_DATA.businesses.techVenture.festivals,
        timestamp 
      });
    }
  } catch (error) {
    console.error('detect-festivals fatal error:', error);
    return NextResponse.json({ 
      source: 'fallback', 
      data: FALLBACK_DATA.businesses.techVenture.festivals,
      timestamp 
    });
  }
}
