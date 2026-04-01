import { createHash } from 'crypto';

export class GeminiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GeminiError';
  }
}

export class RateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RateLimitError';
  }
}

export class ParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ParseError';
  }
}

// In-memory cache for the server environment
// Keys are SHA-256 hashes of prompts
const GEMINI_CACHE = new Map<string, { data: string; expiry: number }>();
const CACHE_TTL = 3600000; // 1 hour in ms
const LOCAL_STORAGE_KEY_PREFIX = 'growthOS_cache_';

export function parseGeminiJSON(text: string): any {
  let cleaned = text.trim();
  // Strip markdown code fences if present
  if (cleaned.startsWith('```')) {
    const firstNewline = cleaned.indexOf('\n');
    const lastBacktick = cleaned.lastIndexOf('```');
    if (firstNewline !== -1 && lastBacktick !== -1 && lastBacktick > firstNewline) {
      cleaned = cleaned.substring(firstNewline + 1, lastBacktick).trim();
    }
  }
  
  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('Failed to parse Gemini output:', text);
    throw new ParseError('Failed to parse JSON from Gemini response');
  }
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function getCacheKey(prompt: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const msgUint8 = new TextEncoder().encode(prompt);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  return createHash('sha256').update(prompt).digest('hex');
}

export async function callGemini(
  prompt: string, 
  jsonMode: boolean = true
): Promise<{ text: string; source: 'ai' | 'cached' | 'fallback' }> {
  const cacheKey = await getCacheKey(prompt);
  const fullCacheKey = `${LOCAL_STORAGE_KEY_PREFIX}${cacheKey}`;

  // 1. Check server-side memory cache
  const serverCached = GEMINI_CACHE.get(cacheKey);
  if (serverCached && serverCached.expiry > Date.now()) {
    return { text: serverCached.data, source: 'cached' };
  }

  // 2. Check client-side localStorage cache
  if (typeof window !== 'undefined') {
    try {
      const clientCached = localStorage.getItem(fullCacheKey);
      if (clientCached) {
        const parsed = JSON.parse(clientCached);
        if (parsed.expiry > Date.now()) {
          return { text: parsed.data, source: 'cached' };
        }
      }
    } catch (e) {
      console.warn('Failed to read from localStorage cache');
    }
  }

  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new GeminiError('GEMINI_API_KEY is not configured');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 2048,
      topP: 0.95,
      responseMimeType: jsonMode ? "application/json" : "text/plain"
    }
  };

  const maxRetries = 2;
  const backoffs = [1500, 3000];

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.status === 429) {
        throw new RateLimitError('Gemini API rate limit exceeded (429)');
      }

      if (!response.ok) {
        const errText = await response.text();
        throw new GeminiError(`Gemini API Error: ${response.status} - ${errText}`);
      }

      const data = await response.json();
      const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!textOutput) {
        throw new GeminiError('Empty response from Gemini');
      }

      const cacheEntry = {
        data: textOutput,
        expiry: Date.now() + CACHE_TTL
      };

      // Store in memory cache
      GEMINI_CACHE.set(cacheKey, cacheEntry);

      // Store in localStorage if on client
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(fullCacheKey, JSON.stringify(cacheEntry));
        } catch (e) {
          console.warn('Failed to write to localStorage cache');
        }
      }

      return { text: textOutput, source: 'ai' };
    } catch (error: any) {
      if (error instanceof RateLimitError) {
        // Fallback to expired cache if available
        const staleCached = serverCached || (typeof window !== 'undefined' ? JSON.parse(localStorage.getItem(fullCacheKey) || 'null') : null);
        if (staleCached) {
          return { text: staleCached.data, source: 'cached' };
        }
        throw error;
      }
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      await sleep(backoffs[attempt]);
    }
  }

  throw new GeminiError('Failed to call Gemini after all retries');
}
