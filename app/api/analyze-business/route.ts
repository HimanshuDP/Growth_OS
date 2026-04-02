import { NextRequest, NextResponse } from 'next/server';
import { callGemini, parseGeminiJSON } from '@/lib/gemini';
import { FALLBACK_DATA } from '@/lib/fallback-data';
import * as cheerio from 'cheerio';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function scrapeWebsite(url: string): Promise<string> {
  if (!url || !url.startsWith('http')) return '';
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    
    const response = await fetch(url, { 
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    clearTimeout(timeoutId);
    
    if (!response.ok) return '';
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    $('script, style, noscript, svg, img, video, iframe, nav, footer').remove();
    
    const title = $('title').text().trim();
    const description = $('meta[name="description"]').attr('content') || '';
    const h1 = $('h1').text().trim();
    
    const bodyContent = $('h2, h3, p, li')
      .map((_, el) => $(el).text().replace(/\s+/g, ' ').trim())
      .get()
      .filter(text => text.length > 20)
      .join(' | ');

    const completeText = `Title: ${title}\nDescription: ${description}\nH1: ${h1}\nContent: ${bodyContent}`;
    return completeText.substring(0, 3000);

  } catch (err) {
    console.warn(`Scraping gracefully failed for ${url}`, err);
    return '';
  }
}

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

    let scrapedContext = '';
    if (websiteUrl) {
      scrapedContext = await scrapeWebsite(websiteUrl);
    }

    const prompt = `
Analyze this business and generate a marketing profile:
- Name: ${businessName || 'N/A'}
- Website: ${websiteUrl || 'N/A'}
- Industry: ${industry || 'N/A'}
- Model: ${businessModel || 'N/A'}

Website Scraped Content:
"""
${scrapedContext || 'No readable data found.'}
"""

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
