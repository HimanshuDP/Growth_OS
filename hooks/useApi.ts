import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useDemo } from '@/context/DemoContext';

interface CacheItem<T> {
  data: T;
  source: 'ai' | 'cached' | 'fallback';
  timestamp: string;
  expiry: number;
}

const CACHE_PREFIX = 'growthOS_cache_';
const CACHE_TTL = 3600000; // 1 hour

export function useApi<T>() {
  const [isLoading, setIsLoading] = useState(false);
  const { isDemoMode, demoBusiness } = useDemo();

  const callApi = useCallback(async (
    endpoint: string, 
    body: any = {}, 
    options: { useCache?: boolean; forceAI?: boolean } = {}
  ): Promise<{ data: T; source: string; timestamp: string }> => {
    const { useCache = true, forceAI = false } = options;
    
    // 1. Generate cache key
    const cacheKey = `${CACHE_PREFIX}${btoa(endpoint + JSON.stringify(body))}`;

    // 2. Check cache if allowed
    if (useCache && !forceAI && !isDemoMode) {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const parsed: CacheItem<T> = JSON.parse(cached);
          if (parsed.expiry > Date.now()) {
            console.log(`[API] Using client-side cache for ${endpoint}`);
            toast(`Using cached data — AI response loaded from cache`, {
              icon: '⚡',
              style: { background: '#1e1b4b', color: '#fbbf24' }
            });
            return { data: parsed.data, source: 'cached', timestamp: parsed.timestamp };
          }
        } catch (e) {
          localStorage.removeItem(cacheKey);
        }
      }
    }

    setIsLoading(true);
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (isDemoMode) {
        headers['x-demo-mode'] = 'true';
        headers['x-demo-business'] = demoBusiness;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      if (response.status === 429) {
        toast.error("Rate limit reached. Using high-quality cached data instead.");
        // Try to return even expired cache if rate limited
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          return { data: parsed.data, source: 'cached', timestamp: parsed.timestamp };
        }
        throw new Error("Rate limit reached and no cache available.");
      }

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Store in cache
      if (useCache && !isDemoMode) {
        const cacheItem: CacheItem<T> = {
          data: result.data,
          source: result.source,
          timestamp: result.timestamp,
          expiry: Date.now() + CACHE_TTL
        };
        localStorage.setItem(cacheKey, JSON.stringify(cacheItem));
      }

      if (result.source === 'cached') {
        toast(`Using cached data`, { icon: '⚡' });
      }

      return result;
    } catch (error: any) {
      console.error(`[API Error] ${endpoint}:`, error);
      toast.error(`Error: ${error.message || 'Something went wrong'}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isDemoMode, demoBusiness]);

  return { callApi, isLoading };
}
