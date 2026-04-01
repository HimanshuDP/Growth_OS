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
      data: (FALLBACK_DATA as any).businesses[bizKey].profile,
      timestamp 
    });
  }

  try {
    const body = await request.json();
    const { websiteUrl, name: businessName, industry, businessModel, targetAudience, location, productsServices, primaryGoal, monthlyBudget } = body;

    const prompt = `
Analyze this business and generate a marketing profile:
- Name: ${businessName || 'N/A'}
- Website: ${websiteUrl || 'N/A'}
- Industry: ${industry || 'N/A'}
- Model: ${businessModel || 'N/A'}

Return ONLY JSON:
{
  "brandTone": "professional | friendly | playful | authoritative",
  "uniqueValueProposition": "string",
  "targetAudiencePersona": {
    "primaryAge": "25-35",
    "gender": "all",
    "income": "bracket",
    "interests": ["5 items"],
    "painPoints": ["3 items"],
    "onlineBehavior": "description"
  },
  "topCompetitors": ["3 names"],
  "contentPillars": ["5 items"],
  "bestPostingTimes": { "instagram": "time", "facebook": "time", "linkedin": "time" },
  "seasonalOpportunities": ["4 items"],
  "marketingInsight": "3 sentences"
}
`;

    try {
      const { text, source } = await callGemini(prompt, true);
      const data = parseGeminiJSON(text);
      return NextResponse.json({ source, data, timestamp });
    } catch (aiError) {
      console.error('Gemini analyze-business error:', aiError);
      return NextResponse.json({ 
        source: 'fallback', 
        data: FALLBACK_DATA.businesses.techVenture.profile,
        timestamp 
      });
    }
  } catch (error) {
    console.error('analyze-business fatal error:', error);
    return NextResponse.json({ 
      source: 'fallback', 
      data: FALLBACK_DATA.businesses.techVenture.profile,
      timestamp 
    });
  }
}
