import { NextRequest, NextResponse } from 'next/server';
import { callGemini, parseGeminiJSON } from '@/lib/gemini';
import { FALLBACK_DATA } from '@/lib/fallback-data';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function generatePerformanceMetrics() {
  const metrics = [];
  const platforms = [
    ...Array(45).fill('Instagram'),
    ...Array(30).fill('Facebook'),
    ...Array(25).fill('LinkedIn')
  ];

  for (let i = 30; i > 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const improvementFactor = (30 - i) / 29; 

    // Ranges: CTR 1.2 -> 3.4, CPC 42 -> 18, ROAS 2.1 -> 4.8
    const ctr = 1.2 + (improvementFactor * (3.4 - 1.2));
    const cpc = 42 - (improvementFactor * (42 - 18));
    const roas = 2.1 + (improvementFactor * (4.8 - 2.1));
    const platform = platforms[Math.floor(Math.random() * platforms.length)];
    
    const impressions = Math.round(5000 + (Math.random() * 2000) + (improvementFactor * 3000));
    const clicks = Math.round(impressions * (ctr / 100));
    const spend = clicks * cpc;
    const revenue = spend * roas;

    metrics.push({
      date: date.toISOString().split('T')[0],
      platform,
      impressions,
      clicks,
      ctr: parseFloat(ctr.toFixed(2)),
      cpc: parseFloat(cpc.toFixed(2)),
      spend: Math.round(spend),
      revenue: Math.round(revenue),
      roas: parseFloat(roas.toFixed(2)),
      conversions: Math.round(revenue / 850)
    });
  }
  return metrics;
}

export async function GET(request: NextRequest) {
  const timestamp = new Date().toISOString();
  const isDemoMode = request.headers.get('x-demo-mode') === 'true';
  const demoBusiness = request.headers.get('x-demo-business') || 'Mumbai Mithai House';

  if (isDemoMode) {
    await sleep(1500);
    const bizKey = demoBusiness === 'Mumbai Mithai House' ? 'mumbaiMithai' : 
                   demoBusiness === 'TechVenture Solutions' ? 'techVenture' : 'priyasBoutique';
    return NextResponse.json({ 
      source: 'fallback', 
      data: {
        metrics: (FALLBACK_DATA as any).businesses[bizKey].performance,
        aiInsight: "Excellent growth trajectory in your ad performance. Scaling top-performing campaigns would be the strategic next step."
      },
      timestamp 
    });
  }

  try {
    const metrics = generatePerformanceMetrics();
    const prompt = `
Analyze 30-day marketing data (CTR 1.2->3.4%, CPC ₹42->18, ROAS 2.1->4.8x).
Return ONLY JSON: { "aiInsight": "3 sentences summarizing growth and advice." }
`;

    let aiInsight = "Your campaigns are showing excellent month-over-month momentum, with ROAS hitting 4.8x. Continued investment in your winning creatives is driving down acquisition costs remarkably.";
    let source = 'fallback' as 'ai' | 'cached' | 'fallback';

    try {
      const { text, source: geminiSource } = await callGemini(prompt, true);
      const data = parseGeminiJSON(text);
      if (data && data.aiInsight) {
        aiInsight = data.aiInsight;
        source = geminiSource;
      }
    } catch (aiError) {
      console.error('Gemini performance-data error:', aiError);
    }

    return NextResponse.json({ 
      source, 
      data: { metrics, aiInsight },
      timestamp
    }, { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error('performance-data fatal error:', error);
    return NextResponse.json({ 
      source: 'fallback', 
      data: {
        metrics: FALLBACK_DATA.businesses.mumbaiMithai.performance,
        aiInsight: "Your performance is trending positively. Keep monitoring metrics."
      },
      timestamp
    }, { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
}
