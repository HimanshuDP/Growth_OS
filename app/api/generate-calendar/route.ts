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
      data: (FALLBACK_DATA as any).businesses[bizKey].calendar,
      timestamp 
    });
  }

  try {
    const body = await request.json();
    const { businessProfile, weekStartDate } = body;

    const startDate = weekStartDate || new Date().toISOString().split('T')[0];
    const upcomingFestivals = getUpcomingFestivals(7).map(f => `${f.name} (${f.date})`).join(', ');

    const prompt = `
Create a 7-day social media content calendar for this business:
${JSON.stringify(businessProfile)}

Today's Date: ${startDate}
Upcoming Festivals: ${upcomingFestivals || 'None'}

Return ONLY a JSON array of 7 objects:
[
  {
    "date": "YYYY-MM-DD",
    "dayOfWeek": "Monday",
    "theme": "day theme",
    "contentPillar": "educational | promotional | entertaining | inspirational",
    "postType": "carousel | static | story | reel",
    "caption": "100-150 word human-like Indian caption",
    "hashtags": ["12", "tags"],
    "suggestedTime": "e.g. 7:30 PM IST",
    "festivalHook": "string or null",
    "imageKeyword": "3-word search query",
    "rationale": "1 sentence explain"
  }
]
`;

    try {
      const { text, source } = await callGemini(prompt, true);
      const data = parseGeminiJSON(text);
      return NextResponse.json({ source, data, timestamp });
    } catch (aiError) {
      console.error('Gemini generate-calendar error:', aiError);
      return NextResponse.json({ 
        source: 'fallback', 
        data: FALLBACK_DATA.businesses.techVenture.calendar,
        timestamp 
      });
    }
  } catch (error) {
    console.error('generate-calendar fatal error:', error);
    return NextResponse.json({ 
      source: 'fallback', 
      data: FALLBACK_DATA.businesses.techVenture.calendar,
      timestamp 
    });
  }
}
